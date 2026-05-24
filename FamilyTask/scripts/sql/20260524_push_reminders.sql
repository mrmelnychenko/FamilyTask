-- Phase 5: push reminders for task deadlines.
-- Run this in Supabase SQL Editor before deploying the Edge Function.

create table if not exists push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  token text not null unique,
  platform text not null check (platform in ('ios', 'android')),
  enabled boolean not null default true,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_tokens_user_id_idx
on push_tokens (user_id);

create table if not exists task_reminders (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  reminder_at timestamptz not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'sent', 'cancelled', 'failed')),
  notification_type text not null default 'deadline'
    check (notification_type in ('deadline')),
  sent_at timestamptz,
  failed_reason text,
  expo_ticket_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (task_id, user_id, notification_type)
);

create index if not exists task_reminders_due_idx
on task_reminders (status, reminder_at)
where status = 'pending';

create index if not exists task_reminders_user_id_idx
on task_reminders (user_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists push_tokens_set_updated_at on push_tokens;
create trigger push_tokens_set_updated_at
before update on push_tokens
for each row execute function set_updated_at();

drop trigger if exists task_reminders_set_updated_at on task_reminders;
create trigger task_reminders_set_updated_at
before update on task_reminders
for each row execute function set_updated_at();

create or replace function sync_task_deadline_reminder()
returns trigger as $$
declare
  next_reminder_at timestamptz;
begin
  if new.assigned_to is null
    or new.deadline is null
    or coalesce(new.is_recurring, false) = true
    or new.status = 'DONE'
  then
    update task_reminders
    set status = 'cancelled',
        updated_at = now()
    where task_id = new.id
      and notification_type = 'deadline'
      and status = 'pending';

    return new;
  end if;

  next_reminder_at = new.deadline - interval '30 minutes';

  if next_reminder_at <= now() then
    update task_reminders
    set status = 'cancelled',
        updated_at = now()
    where task_id = new.id
      and notification_type = 'deadline'
      and status = 'pending';

    return new;
  end if;

  insert into task_reminders (
    task_id,
    user_id,
    reminder_at,
    status,
    notification_type
  )
  values (
    new.id,
    new.assigned_to,
    next_reminder_at,
    'pending',
    'deadline'
  )
  on conflict (task_id, user_id, notification_type)
  do update set
    reminder_at = excluded.reminder_at,
    status = 'pending',
    sent_at = null,
    failed_reason = null,
    expo_ticket_id = null,
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists tasks_sync_deadline_reminder on tasks;
create trigger tasks_sync_deadline_reminder
after insert or update of assigned_to, deadline, status, is_recurring on tasks
for each row execute function sync_task_deadline_reminder();

alter table push_tokens enable row level security;
alter table task_reminders enable row level security;

drop policy if exists "Users can read own push tokens" on push_tokens;
create policy "Users can read own push tokens"
on push_tokens for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own push tokens" on push_tokens;
create policy "Users can insert own push tokens"
on push_tokens for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own push tokens" on push_tokens;
create policy "Users can update own push tokens"
on push_tokens for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own push tokens" on push_tokens;
create policy "Users can delete own push tokens"
on push_tokens for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read own task reminders" on task_reminders;
create policy "Users can read own task reminders"
on task_reminders for select
using (auth.uid() = user_id);

-- Backfill pending reminders for existing future one-time tasks.
insert into task_reminders (
  task_id,
  user_id,
  reminder_at,
  status,
  notification_type
)
select
  id,
  assigned_to,
  deadline - interval '30 minutes',
  'pending',
  'deadline'
from tasks
where assigned_to is not null
  and deadline is not null
  and coalesce(is_recurring, false) = false
  and status <> 'DONE'
  and deadline - interval '30 minutes' > now()
on conflict (task_id, user_id, notification_type)
do update set
  reminder_at = excluded.reminder_at,
  status = 'pending',
  updated_at = now();
