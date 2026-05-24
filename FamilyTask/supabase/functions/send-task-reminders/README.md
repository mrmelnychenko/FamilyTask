# send-task-reminders

Supabase Edge Function for Phase 5 task deadline reminders.

## What it does

- Finds `task_reminders` with `status = 'pending'` and `reminder_at <= now()`.
- Claims them as `processing`.
- Loads enabled Expo push tokens for assigned users.
- Sends push notifications through Expo Push API.
- Marks reminders as `sent` or `failed`.
- Disables Expo tokens that return `DeviceNotRegistered`.

## Required setup

1. Run `scripts/sql/20260524_push_reminders.sql` in Supabase SQL Editor.
2. Deploy this function with Supabase CLI.
3. Set `TASK_REMINDER_CRON_SECRET` as a Supabase function secret if the endpoint should require a bearer token.
4. Call this function every minute from Supabase Scheduled Functions, GitHub Actions, or another cron runner.

The app also schedules local reminders on the current device. This function is for cross-device reminders, for example when a parent creates a task assigned to a child.
