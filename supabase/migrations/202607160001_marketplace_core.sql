create extension if not exists pgcrypto;

create type public.user_role as enum ('member', 'dealer', 'admin');
create type public.account_status as enum ('active', 'suspended', 'withdrawn');
create type public.moderation_status as enum ('draft', 'pending', 'approved', 'rejected');
create type public.contact_visibility as enum ('after_inquiry', 'verified_members', 'private');
create type public.inquiry_status as enum ('open', 'answered', 'closed', 'blocked');
create type public.report_status as enum ('received', 'reviewing', 'resolved', 'dismissed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '회원' check (char_length(display_name) between 1 and 40),
  business_name text check (business_name is null or char_length(business_name) <= 80),
  region text not null default '전국',
  introduction text not null default '' check (char_length(introduction) <= 1000),
  contact_visibility public.contact_visibility not null default 'after_inquiry',
  role public.user_role not null default 'member',
  account_status public.account_status not null default 'active',
  completed_trades integer not null default 0 check (completed_trades >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id),
  title text not null check (char_length(title) between 2 and 100),
  category text not null,
  subcategory text not null,
  region text not null,
  district text,
  year integer not null check (year between 1950 and 2100),
  price bigint check (price is null or price >= 0),
  price_negotiable boolean not null default false,
  status text not null default '판매중' check (status in ('판매중', '예약중', '판매완료', '구매요청')),
  condition text not null check (condition in ('신품', '중고')),
  manufacturer text not null check (char_length(manufacturer) between 1 and 80),
  model text,
  usage_hours integer check (usage_hours is null or usage_hours >= 0),
  trade_options text[] not null default '{}',
  description text not null check (char_length(description) between 10 and 10000),
  moderation_status public.moderation_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index listings_public_feed_idx
  on public.listings (created_at desc)
  where moderation_status = 'approved' and deleted_at is null;
create index listings_seller_idx on public.listings (seller_id, created_at desc);
create index listings_filter_idx on public.listings (category, subcategory, region, condition, status);

create table public.listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_key text not null unique,
  original_name text not null,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  byte_size integer not null check (byte_size between 1 and 15728640),
  position smallint not null check (position between 0 and 19),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (listing_id, position)
);

create unique index listing_photos_one_primary_idx
  on public.listing_photos (listing_id)
  where is_primary;

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table public.inquiry_threads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id),
  buyer_id uuid not null references public.profiles(id),
  seller_id uuid not null references public.profiles(id),
  status public.inquiry_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (buyer_id <> seller_id),
  unique (listing_id, buyer_id, seller_id)
);

create index inquiry_threads_buyer_idx on public.inquiry_threads (buyer_id, updated_at desc);
create index inquiry_threads_seller_idx on public.inquiry_threads (seller_id, updated_at desc);

create table public.inquiry_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.inquiry_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null check (char_length(body) between 1 and 2000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index inquiry_messages_thread_idx on public.inquiry_messages (thread_id, created_at);

create table public.listing_reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id),
  reporter_id uuid not null references public.profiles(id),
  reason text not null check (reason in ('suspected_fraud', 'false_information', 'prohibited_item', 'abusive_content', 'other')),
  description text not null check (char_length(description) between 10 and 2000),
  status public.report_status not null default 'received',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listing_reports_queue_idx on public.listing_reports (status, created_at);

create table public.listing_status_history (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  previous_status text,
  next_status text not null,
  changed_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();
create trigger listings_touch_updated_at before update on public.listings
for each row execute function public.touch_updated_at();
create trigger inquiry_threads_touch_updated_at before update on public.inquiry_threads
for each row execute function public.touch_updated_at();
create trigger listing_reports_touch_updated_at before update on public.listing_reports
for each row execute function public.touch_updated_at();

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), '회원'));
  return new;
end;
$$;

create trigger auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

create or replace function public.has_verified_phone(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from auth.users
    where id = user_id and phone_confirmed_at is not null
  );
$$;

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin' and account_status = 'active'
  );
$$;

revoke all on function public.has_verified_phone(uuid) from public;
revoke all on function public.is_admin(uuid) from public;
grant execute on function public.has_verified_phone(uuid) to authenticated;
grant execute on function public.is_admin(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.favorites enable row level security;
alter table public.inquiry_threads enable row level security;
alter table public.inquiry_messages enable row level security;
alter table public.listing_reports enable row level security;
alter table public.listing_status_history enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_public_read on public.profiles for select to anon, authenticated using (true);
create policy profiles_owner_update on public.profiles for update to authenticated
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

revoke update on public.profiles from authenticated;
grant update (display_name, business_name, region, introduction, contact_visibility) on public.profiles to authenticated;

create policy listings_public_read on public.listings for select to anon, authenticated
using (moderation_status = 'approved' and deleted_at is null and published_at is not null);
create policy listings_owner_read on public.listings for select to authenticated
using ((select auth.uid()) = seller_id);
create policy listings_owner_insert on public.listings for insert to authenticated
with check (
  (select auth.uid()) = seller_id
  and public.has_verified_phone((select auth.uid()))
  and moderation_status in ('draft', 'pending')
);
create policy listings_owner_update on public.listings for update to authenticated
using ((select auth.uid()) = seller_id)
with check ((select auth.uid()) = seller_id);

revoke update on public.listings from authenticated;
grant update (
  title, category, subcategory, region, district, year, price, price_negotiable,
  status, condition, manufacturer, model, usage_hours, trade_options, description, deleted_at
) on public.listings to authenticated;

create policy photos_public_read on public.listing_photos for select to anon, authenticated
using (exists (
  select 1 from public.listings
  where listings.id = listing_photos.listing_id
    and listings.moderation_status = 'approved'
    and listings.deleted_at is null
    and listings.published_at is not null
));
create policy photos_owner_all on public.listing_photos for all to authenticated
using (exists (
  select 1 from public.listings
  where listings.id = listing_photos.listing_id and listings.seller_id = (select auth.uid())
))
with check (exists (
  select 1 from public.listings
  where listings.id = listing_photos.listing_id and listings.seller_id = (select auth.uid())
));

create policy favorites_owner_all on public.favorites for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy inquiry_participant_read on public.inquiry_threads for select to authenticated
using ((select auth.uid()) in (buyer_id, seller_id));
create policy inquiry_buyer_create on public.inquiry_threads for insert to authenticated
with check (
  (select auth.uid()) = buyer_id
  and public.has_verified_phone((select auth.uid()))
  and buyer_id <> seller_id
  and exists (
    select 1 from public.listings
    where listings.id = inquiry_threads.listing_id
      and listings.seller_id = inquiry_threads.seller_id
      and listings.moderation_status = 'approved'
      and listings.deleted_at is null
  )
);
create policy inquiry_participant_update on public.inquiry_threads for update to authenticated
using ((select auth.uid()) in (buyer_id, seller_id))
with check ((select auth.uid()) in (buyer_id, seller_id));

create policy message_participant_read on public.inquiry_messages for select to authenticated
using (exists (
  select 1 from public.inquiry_threads
  where inquiry_threads.id = inquiry_messages.thread_id
    and (select auth.uid()) in (inquiry_threads.buyer_id, inquiry_threads.seller_id)
));
create policy message_participant_create on public.inquiry_messages for insert to authenticated
with check (
  (select auth.uid()) = sender_id
  and exists (
    select 1 from public.inquiry_threads
    where inquiry_threads.id = inquiry_messages.thread_id
      and (select auth.uid()) in (inquiry_threads.buyer_id, inquiry_threads.seller_id)
      and inquiry_threads.status <> 'blocked'
  )
);
create policy message_participant_mark_read on public.inquiry_messages for update to authenticated
using (exists (
  select 1 from public.inquiry_threads
  where inquiry_threads.id = inquiry_messages.thread_id
    and (select auth.uid()) in (inquiry_threads.buyer_id, inquiry_threads.seller_id)
));

create policy reports_owner_create on public.listing_reports for insert to authenticated
with check ((select auth.uid()) = reporter_id and public.has_verified_phone((select auth.uid())));
create policy reports_owner_read on public.listing_reports for select to authenticated
using ((select auth.uid()) = reporter_id);
create policy reports_admin_read on public.listing_reports for select to authenticated
using (public.is_admin((select auth.uid())));
create policy reports_admin_update on public.listing_reports for update to authenticated
using (public.is_admin((select auth.uid())))
with check (public.is_admin((select auth.uid())));

create policy history_owner_read on public.listing_status_history for select to authenticated
using (exists (
  select 1 from public.listings
  where listings.id = listing_status_history.listing_id
    and listings.seller_id = (select auth.uid())
));
create policy history_admin_read on public.listing_status_history for select to authenticated
using (public.is_admin((select auth.uid())));
create policy audit_admin_read on public.audit_logs for select to authenticated
using (public.is_admin((select auth.uid())));
