-- Smart Gym Training & Control schema
create extension if not exists pgcrypto;

create type app_role as enum ('owner', 'member');
create type fitness_goal as enum ('fat_loss', 'muscle_gain');

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role app_role not null,
  name text not null,
  phone text unique not null,
  age int,
  weight_kg numeric(5,2),
  goal fitness_goal,
  force_password_change boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists workout_items (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references profiles(id) on delete cascade,
  weekday text not null,
  position int not null,
  exercise_name text not null,
  sets int not null,
  reps text not null,
  rest_seconds int not null,
  muscle_image_url text not null,
  form_image_url text not null,
  youtube_url text not null,
  done boolean not null default false,
  assigned_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists diet_items (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references profiles(id) on delete cascade,
  meal_order int not null,
  meal_name text not null,
  items text not null,
  done_today boolean not null default false,
  last_checked_on date,
  assigned_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references profiles(id) on delete cascade,
  weight_kg numeric(5,2) not null,
  logged_on date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists password_reset_audit (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id),
  member_id uuid not null references profiles(id),
  reset_at timestamptz not null default now()
);

-- RLS
alter table profiles enable row level security;
alter table workout_items enable row level security;
alter table diet_items enable row level security;
alter table weight_logs enable row level security;
alter table password_reset_audit enable row level security;

create policy "members_can_read_self_profile"
on profiles for select
using (auth.uid() = id);

create policy "owners_can_read_all_profiles"
on profiles for select
using (
  exists (
    select 1 from profiles p
    where p.id = auth.uid() and p.role = 'owner'
  )
);

create policy "owners_manage_members"
on profiles for all
using (
  exists (
    select 1 from profiles p
    where p.id = auth.uid() and p.role = 'owner'
  )
)
with check (
  exists (
    select 1 from profiles p
    where p.id = auth.uid() and p.role = 'owner'
  )
);

create policy "member_workout_visibility"
on workout_items for select
using (
  member_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'owner')
);

create policy "owner_manage_workouts"
on workout_items for all
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'owner'))
with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'owner'));

create policy "member_diet_visibility"
on diet_items for select
using (
  member_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'owner')
);

create policy "member_toggle_diet"
on diet_items for update
using (member_id = auth.uid())
with check (member_id = auth.uid());

create policy "owner_manage_diet"
on diet_items for all
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'owner'))
with check (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'owner'));

create policy "member_and_owner_weight_logs"
on weight_logs for all
using (
  member_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'owner')
)
with check (
  member_id = auth.uid()
  or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'owner')
);

create view owner_daily_dashboard as
select
  m.id as member_id,
  m.name as member_name,
  case
    when exists (select 1 from workout_items w where w.member_id = m.id and w.done) then 'completed'
    else 'skipped/pending'
  end as workout_status,
  case
    when exists (select 1 from diet_items d where d.member_id = m.id and d.done_today and d.last_checked_on = current_date) then 'followed'
    else 'missed/pending'
  end as diet_status,
  (
    select wl.weight_kg
    from weight_logs wl
    where wl.member_id = m.id
    order by wl.logged_on desc
    limit 1
  ) as latest_weight_kg
from profiles m
where m.role = 'member';

create or replace function reset_daily_diet_checkboxes()
returns void language sql as $$
  update diet_items
  set done_today = false
  where last_checked_on is distinct from current_date;
$$;
