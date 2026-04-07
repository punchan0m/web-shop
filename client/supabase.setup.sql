-- Run this SQL in Supabase SQL Editor
-- Creates required tables used by the frontend-only version.

create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12,2),
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists price numeric(12,2);

create table if not exists public.product_categories (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  content_section text,
  url text not null,
  created_at timestamptz not null default now()
);

alter table public.images add column if not exists content_section text;

create table if not exists public.content_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text,
  footer_left text,
  footer_right text,
  theme_primary text,
  theme_secondary text,
  theme_text_primary text,
  theme_text_secondary text,
  theme_button_bg text,
  theme_button_text text,
  home_title text,
  home_description text,
  about_title text,
  about_description text,
  contact_title text,
  contact_description text,
  contact_map_query text,
  contact_email text,
  contact_gmail text,
  contact_phone text,
  contact_phone_alt text,
  contact_facebook text,
  contact_instagram text,
  contact_line text,
  contact_zoom int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.content_settings add column if not exists theme_primary text;
alter table public.content_settings add column if not exists theme_secondary text;
alter table public.content_settings add column if not exists theme_text_primary text;
alter table public.content_settings add column if not exists theme_text_secondary text;
alter table public.content_settings add column if not exists theme_button_bg text;
alter table public.content_settings add column if not exists theme_button_text text;

insert into public.content_settings (
  site_name,
  footer_left,
  footer_right,
  theme_primary,
  theme_secondary,
  theme_text_primary,
  theme_text_secondary,
  theme_button_bg,
  theme_button_text,
  home_title,
  home_description,
  about_title,
  about_description,
  contact_title,
  contact_description,
  contact_email,
  contact_map_query,
  contact_zoom
)
select
  'shopname',
  'Curating with intent since 2026.',
  'shopname',
  '#705d00',
  '#e8e2d9',
  '#2d3339',
  '#596066',
  '#705d00',
  '#ffffff',
  'Objects with intent, not noise.',
  '',
  'Curation is a product decision.',
  '',
  'Studio',
  '',
  'support@editorial-merchant.local',
  'Q8MV+GJ Pak Trae, Ranot District, Songkhla',
  14
where not exists (select 1 from public.content_settings);

-- Optional: allow public read/write for quick prototyping
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_categories enable row level security;
alter table public.images enable row level security;
alter table public.content_settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'categories' and policyname = 'public all categories'
  ) then
    create policy "public all categories" on public.categories for all to public using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'products' and policyname = 'public all products'
  ) then
    create policy "public all products" on public.products for all to public using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_categories' and policyname = 'public all product_categories'
  ) then
    create policy "public all product_categories" on public.product_categories for all to public using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'images' and policyname = 'public all images'
  ) then
    create policy "public all images" on public.images for all to public using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'content_settings' and policyname = 'public all content_settings'
  ) then
    create policy "public all content_settings" on public.content_settings for all to public using (true) with check (true);
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('web-shop', 'web-shop', true)
on conflict (id) do update set public = excluded.public;

do $$
begin
  if exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read web-shop images'
  ) then
    drop policy "Public read web-shop images" on storage.objects;
  end if;

  if exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public insert web-shop images'
  ) then
    drop policy "Public insert web-shop images" on storage.objects;
  end if;

  if exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public update web-shop images'
  ) then
    drop policy "Public update web-shop images" on storage.objects;
  end if;

  if exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public delete web-shop images'
  ) then
    drop policy "Public delete web-shop images" on storage.objects;
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read web-shop images'
  ) then
    create policy "Public read web-shop images"
      on storage.objects
      for select
      to anon, authenticated
      using (bucket_id = 'web-shop');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public insert web-shop images'
  ) then
    create policy "Public insert web-shop images"
      on storage.objects
      for insert
      to anon, authenticated
      with check (bucket_id = 'web-shop');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public update web-shop images'
  ) then
    create policy "Public update web-shop images"
      on storage.objects
      for update
      to anon, authenticated
      using (bucket_id = 'web-shop')
      with check (bucket_id = 'web-shop');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public delete web-shop images'
  ) then
    create policy "Public delete web-shop images"
      on storage.objects
      for delete
      to anon, authenticated
      using (bucket_id = 'web-shop');
  end if;
end $$;

NOTIFY pgrst, 'reload schema';
