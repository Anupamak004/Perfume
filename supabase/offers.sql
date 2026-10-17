-- Offers and announcements upgrade for existing Supabase installations.
-- Run in Supabase Dashboard → SQL Editor.

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
