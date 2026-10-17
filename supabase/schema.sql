-- The Perfume Pirate product management schema
-- Run this in Supabase Dashboard → SQL Editor.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  gender text not null default 'Unisex',
  price numeric(12, 2) not null default 0 check (price >= 0),
  fragrance_type text not null default '',
  description text not null default '',
  image text not null default '',
  images text[] not null default '{}',
  notes jsonb not null default '{"top": [], "heart": [], "base": []}'::jsonb,
  moods text[] not null default '{}',
  occasion text[] not null default '{}',
  style text[] not null default '{}',
  sizes jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  in_stock boolean not null default true,
  rating numeric(3, 2) not null default 0,
  reviews integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Customer reviews are public only after an administrator approves them.
create table if not exists public.customer_reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(trim(customer_name)) between 2 and 80),
  rating smallint not null check (rating between 1 and 5),
  review_text text not null check (char_length(trim(review_text)) between 10 and 2000),
  image_urls text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  moderated_at timestamptz
);
create index if not exists customer_reviews_status_created_idx
  on public.customer_reviews (status, created_at desc);

create or replace function public.set_product_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
for each row execute function public.set_product_updated_at();

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.customer_reviews enable row level security;

drop policy if exists "Admins can read their own admin record" on public.admin_users;
create policy "Admins can read their own admin record" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products" on public.products
  for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- Storefront needs to read out-of-stock products too, so it can display them
-- as unavailable and block adding them to a cart. Product writes stay admin-only.
drop policy if exists "Anyone can read in-stock products" on public.products;
drop policy if exists "Anyone can read products" on public.products;
create policy "Anyone can read products" on public.products
  for select to anon, authenticated using (true);

drop policy if exists "Anyone can submit pending customer reviews" on public.customer_reviews;
create policy "Anyone can submit pending customer reviews" on public.customer_reviews
  for insert to anon, authenticated with check (status = 'pending');
drop policy if exists "Anyone can read approved customer reviews" on public.customer_reviews;
create policy "Anyone can read approved customer reviews" on public.customer_reviews
  for select to anon, authenticated using (status = 'approved');
drop policy if exists "Admins can manage customer reviews" on public.customer_reviews;
create policy "Admins can manage customer reviews" on public.customer_reviews
  for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));

-- Keep open storefronts current when stock or product details change.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'products'
  ) then
    alter publication supabase_realtime add table public.products;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'customer_reviews'
  ) then
    alter publication supabase_realtime add table public.customer_reviews;
  end if;
end;
$$;

-- Public image URLs let the storefront display uploaded product photos.
-- Only allow-listed admins can add, replace, or remove images.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images', 'product-images', true, 8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images" on storage.objects
  for select to public using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'product-images' and exists (
      select 1 from public.admin_users a where a.user_id = (select auth.uid())
    )
  );

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and exists (
    select 1 from public.admin_users a where a.user_id = (select auth.uid())
  ))
  with check (bucket_id = 'product-images' and exists (
    select 1 from public.admin_users a where a.user_id = (select auth.uid())
  ));

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images" on storage.objects
  for delete to authenticated using (
    bucket_id = 'product-images' and exists (
      select 1 from public.admin_users a where a.user_id = (select auth.uid())
    )
  );

-- Customer images can be submitted publicly but only admins can remove them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('review-images', 'review-images', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view review images" on storage.objects;
create policy "Public can view review images" on storage.objects
  for select to public using (bucket_id = 'review-images');
drop policy if exists "Anyone can upload review images" on storage.objects;
create policy "Anyone can upload review images" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'review-images');
drop policy if exists "Admins can delete review images" on storage.objects;
create policy "Admins can delete review images" on storage.objects
  for delete to authenticated using (
    bucket_id = 'review-images' and exists (
      select 1 from public.admin_users a where a.user_id = (select auth.uid())
    )
  );

-- After creating the administrator in Supabase Authentication → Users, replace
-- the UUID below with that user's ID and run this insert:
-- insert into public.admin_users (user_id) values ('00000000-0000-0000-0000-000000000000');

-- Offers & announcement campaigns (existing projects can run supabase/offers.sql).
create table if not exists public.store_promotions (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'announcement' check (kind in ('announcement', 'discount')),
  title text not null,
  message text not null default '',
  discount_type text check (discount_type in ('percent', 'fixed')),
  discount_value numeric(12, 2) check (discount_value is null or discount_value >= 0),
  scope text not null default 'all' check (scope in ('all', 'category', 'products')),
  category text,
  product_ids text[] not null default '{}',
  show_in_banner boolean not null default false,
  cta_label text not null default 'Shop now',
  cta_url text not null default '/collections',
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint store_promotions_valid_range check (ends_at > starts_at),
  constraint store_promotions_discount_values check (
    kind <> 'discount' or (discount_type is not null and discount_value > 0 and
      (discount_type <> 'percent' or discount_value <= 100))
  )
);
create index if not exists store_promotions_active_dates_idx
  on public.store_promotions (is_active, starts_at, ends_at);
alter table public.store_promotions enable row level security;
drop policy if exists "Public can read active promotions" on public.store_promotions;
create policy "Public can read active promotions" on public.store_promotions
  for select to anon, authenticated using (is_active = true);
drop policy if exists "Admins can manage promotions" on public.store_promotions;
create policy "Admins can manage promotions" on public.store_promotions
  for all to authenticated
  using (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create or replace function public.set_store_promotion_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists store_promotions_updated_at on public.store_promotions;
create trigger store_promotions_updated_at before update on public.store_promotions
for each row execute function public.set_store_promotion_updated_at();
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'store_promotions'
  ) then
    alter publication supabase_realtime add table public.store_promotions;
  end if;
end;
$$;
