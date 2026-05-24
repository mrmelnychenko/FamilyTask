-- Task completion safety for XP and recurring tasks.
-- Run this in Supabase SQL Editor after checking duplicate rows below.

-- 1) Check existing duplicate non-recurring completions.
select
  task_id,
  user_id,
  count(*) as duplicate_count
from task_completions
where recurring_date is null
group by task_id, user_id
having count(*) > 1;

-- 2) Check existing duplicate recurring completions.
select
  task_id,
  user_id,
  recurring_date,
  count(*) as duplicate_count
from task_completions
where recurring_date is not null
group by task_id, user_id, recurring_date
having count(*) > 1;

-- 3) Prevent duplicated XP for one-time tasks.
create unique index if not exists task_completions_one_time_unique
on task_completions (task_id, user_id)
where recurring_date is null;

-- 4) Prevent duplicated XP for recurring tasks on the same date.
create unique index if not exists task_completions_recurring_unique
on task_completions (task_id, user_id, recurring_date)
where recurring_date is not null;

-- 5) Speed up profile streak/XP checks by user and completion date.
create index if not exists task_completions_user_completed_at_idx
on task_completions (user_id, completed_at desc);
