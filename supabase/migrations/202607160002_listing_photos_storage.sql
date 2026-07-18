insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-photos',
  'listing-photos',
  false,
  15728640,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy listing_photo_object_public_read
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'listing-photos'
  and exists (
    select 1 from public.listings
    where listings.id::text = (storage.foldername(name))[2]
      and listings.moderation_status = 'approved'
      and listings.deleted_at is null
      and listings.published_at is not null
  )
);

create policy listing_photo_object_owner_read
on storage.objects for select to authenticated
using (
  bucket_id = 'listing-photos'
  and owner_id = (select auth.uid()::text)
);

create policy listing_photo_object_owner_insert
on storage.objects for insert to authenticated
with check (
  bucket_id = 'listing-photos'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and exists (
    select 1 from public.listings
    where listings.id::text = (storage.foldername(name))[2]
      and listings.seller_id = (select auth.uid())
      and listings.deleted_at is null
  )
  and storage.extension(name) in ('jpg', 'jpeg', 'png', 'webp')
);

create policy listing_photo_object_owner_update
on storage.objects for update to authenticated
using (
  bucket_id = 'listing-photos'
  and owner_id = (select auth.uid()::text)
)
with check (
  bucket_id = 'listing-photos'
  and owner_id = (select auth.uid()::text)
);

create policy listing_photo_object_owner_delete
on storage.objects for delete to authenticated
using (
  bucket_id = 'listing-photos'
  and owner_id = (select auth.uid()::text)
);
