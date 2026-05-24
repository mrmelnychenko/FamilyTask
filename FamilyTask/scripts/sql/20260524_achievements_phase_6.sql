-- Phase 6: achievements and profile statistics support.
-- Run this in Supabase SQL Editor after the task completion scripts.

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  badge_type text not null,
  earned_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (user_id, badge_type)
);

create index if not exists achievements_user_earned_at_idx
on achievements (user_id, earned_at desc);

alter table achievements enable row level security;

drop policy if exists "Users can read own achievements" on achievements;
create policy "Users can read own achievements"
on achievements for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own achievements" on achievements;
create policy "Users can insert own achievements"
on achievements for insert
with check (auth.uid() = user_id);

drop policy if exists "Family members can read family achievements" on achievements;
create policy "Family members can read family achievements"
on achievements for select
using (
  exists (
    select 1
    from family_members viewer
    join profiles owner_profile on owner_profile.id = achievements.user_id
    where viewer.user_id = auth.uid()
      and viewer.family_id = owner_profile.family_id
  )
);

create or replace function get_profile_task_stats(p_user_id uuid)
returns table (
  completed_total integer,
  completed_this_week integer,
  completed_this_month integer,
  xp_this_week integer,
  xp_this_month integer,
  early_tasks_total integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*)::integer as completed_total,
    count(*) filter (
      where completed_at >= date_trunc('week', now())
    )::integer as completed_this_week,
    count(*) filter (
      where completed_at >= date_trunc('month', now())
    )::integer as completed_this_month,
    coalesce(sum(xp_earned) filter (
      where completed_at >= date_trunc('week', now())
    ), 0)::integer as xp_this_week,
    coalesce(sum(xp_earned) filter (
      where completed_at >= date_trunc('month', now())
    ), 0)::integer as xp_this_month,
    count(*) filter (
      where extract(hour from completed_at at time zone 'Europe/Kyiv') < 9
    )::integer as early_tasks_total
  from task_completions
  where user_id = p_user_id;
$$;

grant execute on function get_profile_task_stats(uuid) to authenticated;
