-- ParkEase Schema, Row Level Security, and Transactional RPCs
-- Run in Supabase SQL Editor or via `supabase db push`

create extension if not exists pgcrypto;

-- Enums
do $$ begin
  create type public.slot_type as enum ('standard', 'ev', 'accessible');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.slot_status as enum ('available', 'occupied', 'unavailable');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.booking_status as enum ('confirmed', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

-- Tables
create table if not exists public.parking_locations (
  id text primary key,
  name text not null,
  area text not null,
  city text not null default 'Lucknow',
  address text not null,
  description text not null,
  images text[] not null default '{}',
  price_per_hour numeric(10, 2) not null check (price_per_hour > 0),
  rating numeric(3, 2) not null default 4.5,
  review_count int not null default 0,
  total_slots int not null default 24,
  available_slots int not null default 20,
  parking_type text not null,
  facilities text[] not null default '{}',
  operating_hours text not null,
  distance_km numeric(5, 2) not null default 1.0,
  popularity int not null default 0,
  featured boolean not null default false,
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz not null default now()
);

create table if not exists public.parking_slots (
  id uuid primary key default gen_random_uuid(),
  location_id text not null references public.parking_locations(id) on delete cascade,
  code text not null,
  row text not null,
  type public.slot_type not null default 'standard',
  status public.slot_status not null default 'available',
  unique (location_id, code)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text not null,
  user_name text,
  location_id text not null references public.parking_locations(id),
  location_name text not null,
  location_address text not null,
  location_image text not null,
  slot_code text not null,
  booking_date date not null,
  start_time text not null,
  end_time text not null,
  hours numeric(5, 2) not null check (hours > 0),
  price_per_hour numeric(10, 2) not null,
  total_amount numeric(10, 2) not null,
  vehicle_type text not null,
  vehicle_number text not null,
  payment_method text not null default 'pay_at_venue',
  status public.booking_status not null default 'confirmed',
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  location_id text not null references public.parking_locations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  user_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  date_label text not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_slots_location on public.parking_slots(location_id);
create index if not exists idx_bookings_user on public.bookings(user_id, created_at desc);
create index if not exists idx_reviews_location on public.reviews(location_id, created_at desc);

-- Admin helper
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- Enable RLS
alter table public.parking_locations enable row level security;
alter table public.parking_slots enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;

-- Public read policies
drop policy if exists "Locations are publicly readable" on public.parking_locations;
create policy "Locations are publicly readable"
  on public.parking_locations for select using (true);

drop policy if exists "Only admins manage locations" on public.parking_locations;
create policy "Only admins manage locations"
  on public.parking_locations for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Slots are publicly readable" on public.parking_slots;
create policy "Slots are publicly readable"
  on public.parking_slots for select using (true);

drop policy if exists "Only admins manage slots" on public.parking_slots;
create policy "Only admins manage slots"
  on public.parking_slots for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Reviews are publicly readable" on public.reviews;
create policy "Reviews are publicly readable"
  on public.reviews for select using (true);

drop policy if exists "Authors create own reviews" on public.reviews;
create policy "Authors create own reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

drop policy if exists "Authors or admins update reviews" on public.reviews;
create policy "Authors or admins update reviews"
  on public.reviews for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Authors or admins delete reviews" on public.reviews;
create policy "Authors or admins delete reviews"
  on public.reviews for delete
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users read own bookings or admin" on public.bookings;
create policy "Users read own bookings or admin"
  on public.bookings for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users create own bookings" on public.bookings;
create policy "Users create own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own bookings or admin" on public.bookings;
create policy "Users update own bookings or admin"
  on public.bookings for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users delete own bookings or admin" on public.bookings;
create policy "Users delete own bookings or admin"
  on public.bookings for delete
  using (auth.uid() = user_id or public.is_admin());

-- Base36 booking code generator: "PE-" + 5 uppercase base36 chars
create or replace function public.generate_booking_code()
returns text
language plpgsql
as $$
declare
  chars text := '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  result text := 'PE-';
  i int;
begin
  for i in 1..5 loop
    result := result || substr(chars, floor(random() * 36)::int + 1, 1);
  end loop;
  return result;
end;
$$;

-- Transactional booking creation RPC
create or replace function public.create_booking(
  p_location_id text,
  p_slot_code text,
  p_booking_date date,
  p_start_time text,
  p_end_time text,
  p_hours numeric,
  p_vehicle_type text,
  p_vehicle_number text,
  p_payment_method text default 'pay_at_venue',
  p_user_name text default null
)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_user_email text;
  v_location public.parking_locations%rowtype;
  v_slot public.parking_slots%rowtype;
  v_code text;
  v_total numeric;
  v_booking public.bookings%rowtype;
begin
  if v_user_id is null then
    raise exception 'UNAUTHORIZED: Sign in required to create a booking';
  end if;

  if p_hours is null or p_hours <= 0 then
    raise exception 'INVALID_RANGE: Duration must be greater than zero';
  end if;

  select email into v_user_email from auth.users where id = v_user_id;

  select * into v_location
  from public.parking_locations
  where id = p_location_id
  for update;

  if not found then
    raise exception 'NOT_FOUND: Parking location not found';
  end if;

  select * into v_slot
  from public.parking_slots
  where location_id = p_location_id and code = p_slot_code
  for update;

  if not found or v_slot.status <> 'available' then
    raise exception 'CONFLICT_409: That slot was just taken';
  end if;

  loop
    v_code := public.generate_booking_code();
    exit when not exists (select 1 from public.bookings where booking_code = v_code);
  end loop;

  v_total := round(p_hours * v_location.price_per_hour);

  insert into public.bookings (
    booking_code,
    user_id,
    user_email,
    user_name,
    location_id,
    location_name,
    location_address,
    location_image,
    slot_code,
    booking_date,
    start_time,
    end_time,
    hours,
    price_per_hour,
    total_amount,
    vehicle_type,
    vehicle_number,
    payment_method,
    status
  ) values (
    v_code,
    v_user_id,
    coalesce(v_user_email, ''),
    coalesce(p_user_name, split_part(coalesce(v_user_email, 'Driver'), '@', 1)),
    v_location.id,
    v_location.name,
    v_location.address,
    coalesce(v_location.images[1], ''),
    v_slot.code,
    p_booking_date,
    p_start_time,
    p_end_time,
    p_hours,
    v_location.price_per_hour,
    v_total,
    p_vehicle_type,
    upper(trim(p_vehicle_number)),
    coalesce(p_payment_method, 'pay_at_venue'),
    'confirmed'
  ) returning * into v_booking;

  update public.parking_slots
  set status = 'occupied'
  where id = v_slot.id;

  update public.parking_locations
  set available_slots = greatest(0, available_slots - 1)
  where id = v_location.id;

  return v_booking;
end;
$$;

-- Transactional booking cancellation RPC (never deletes rows)
create or replace function public.cancel_booking(p_booking_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_booking public.bookings%rowtype;
begin
  if v_user_id is null then
    raise exception 'UNAUTHORIZED: Sign in required';
  end if;

  select * into v_booking
  from public.bookings
  where id = p_booking_id
  for update;

  if not found then
    raise exception 'NOT_FOUND: Booking not found';
  end if;

  if v_booking.user_id <> v_user_id and not public.is_admin() then
    raise exception 'FORBIDDEN: You cannot cancel this booking';
  end if;

  if v_booking.status <> 'confirmed' then
    raise exception 'INVALID_STATE: Only confirmed bookings can be cancelled';
  end if;

  update public.bookings
  set status = 'cancelled'
  where id = v_booking.id
  returning * into v_booking;

  update public.parking_slots
  set status = 'available'
  where location_id = v_booking.location_id and code = v_booking.slot_code;

  update public.parking_locations
  set available_slots = least(total_slots, available_slots + 1)
  where id = v_booking.location_id;

  return v_booking;
end;
$$;
