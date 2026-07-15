-- 축산기계장터 Sprint 2 초기 스키마
-- Supabase Dashboard > SQL Editor에서 실행하거나 Supabase CLI로 적용합니다.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  phone text,
  phone_verified boolean not null default false,
  seller_type text not null default '개인' check (seller_type in ('개인', '판매점')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 4 and 60),
  category text not null,
  subcategory text not null,
  condition text not null check (condition in ('신품', '중고')),
  manufacturer text,
  model_name text,
  model_year integer not null check (model_year between 1980 and 2100),
  usage_hours integer check (usage_hours is null or usage_hours >= 0),
  price bigint check (price is null or price >= 0),
  price_negotiable boolean not null default false,
  region text not null,
  description text not null check (char_length(description) >= 10),
  trade_options text[] not null default '{}',
  status text not null default '판매중' check (status in ('판매중', '예약중', '판매완료', '구매요청')),
  is_hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_created_at_idx on public.listings(created_at desc);
create index if not exists listings_category_region_idx on public.listings(category, region);
create index if not exists listings_seller_id_idx on public.listings(seller_id);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null unique,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "listings_public_read" on public.listings
  for select to anon, authenticated using (is_hidden = false);
create policy "listings_owner_insert" on public.listings
  for insert to authenticated with check ((select auth.uid()) = seller_id);
create policy "listings_owner_update" on public.listings
  for update to authenticated using ((select auth.uid()) = seller_id) with check ((select auth.uid()) = seller_id);
create policy "listings_owner_delete" on public.listings
  for delete to authenticated using ((select auth.uid()) = seller_id);

create policy "listing_images_public_read" on public.listing_images
  for select to anon, authenticated using (
    exists (select 1 from public.listings where listings.id = listing_images.listing_id and listings.is_hidden = false)
  );
create policy "listing_images_owner_write" on public.listing_images
  for all to authenticated using (
    exists (select 1 from public.listings where listings.id = listing_images.listing_id and listings.seller_id = (select auth.uid()))
  ) with check (
    exists (select 1 from public.listings where listings.id = listing_images.listing_id and listings.seller_id = (select auth.uid()))
  );

create policy "favorites_owner_all" on public.favorites
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "listing_storage_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'listing-images');
create policy "listing_storage_owner_insert" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'listing-images' and (storage.foldername(name))[1] = (select auth.uid())::text
  );
create policy "listing_storage_owner_update" on storage.objects
  for update to authenticated using (
    bucket_id = 'listing-images' and owner_id = (select auth.uid())::text
  );
create policy "listing_storage_owner_delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'listing-images' and owner_id = (select auth.uid())::text
  );
