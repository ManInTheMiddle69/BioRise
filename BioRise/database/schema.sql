-- BioRise V1 cloud schema blueprint (for later Supabase activation).
create table profiles (
  id uuid primary key,
  worker_code text unique,
  role text not null check (role in ('admin','supervisor','worker')),
  full_name text not null,
  phone text,
  job_title text,
  salary numeric(12,2),
  hired_date date,
  national_id text,
  notes text,
  points integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create table locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text
);

create table objectives (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_on date,
  due_on date,
  archived_at timestamptz
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  objective_id uuid references objectives(id),
  title text not null,
  description text,
  task_date date not null,
  start_time time,
  deadline_time time,
  priority text check (priority in ('low','medium','high')),
  progress integer default 0 check (progress between 0 and 100),
  recurrence text default 'none',
  points integer default 0,
  archived_at timestamptz,
  created_at timestamptz default now()
);

create table task_workers (
  task_id uuid references tasks(id) on delete cascade,
  worker_id uuid references profiles(id) on delete cascade,
  primary key (task_id, worker_id)
);

create table task_locations (
  task_id uuid references tasks(id) on delete cascade,
  location_id uuid references locations(id) on delete cascade,
  primary key (task_id, location_id)
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid references profiles(id),
  work_date date not null,
  status text not null,
  started_at time,
  ended_at time,
  unique(worker_id, work_date)
);

-- Before production: add Row Level Security policies, secure authentication,
-- archive cleanup jobs, and server-side point/deadline calculations.
