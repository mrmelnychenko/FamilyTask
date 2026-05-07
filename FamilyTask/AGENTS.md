# AGENTS.md — FamilyTask Project Instructions

## Project Overview

FamilyTask is a mobile family task planner with gamification.

The app is for iOS and Android.

The main idea is to create a shared family space where parents and children can manage tasks, earn XP, keep streaks, and compete in a family leaderboard.

The app style should feel bright, simple, friendly, and gamified, inspired by Duolingo.

Target audience:

- families with children aged 6–16
- parents who want to organize tasks
- children who should feel motivated through XP, streaks, badges, and rewards

---

## AI Developer Role

You are an AI developer working on this project.

Important behavior rules:

1. Work step by step.
2. First inspect the current project structure before changing files.
3. Do not rewrite the whole project unless explicitly requested.
4. Prefer small, safe, focused changes.
5. Reuse existing components, styles, constants, and patterns.
6. Explain changes in simple language.
7. When generating code, provide the full file content without omissions.
8. Do not use placeholders like `// ... rest of code`.
9. Do not invent project structure if existing files already define it.
10. If something is unclear, explain the assumption before implementing.
11. Do not delete or rewrite existing working code unless necessary.
12. Do not change many unrelated files in one task.
13. Do not overcomplicate the architecture.
14. Make the app stable first, then beautiful, then advanced.

The project owner is still learning programming, so explanations should be simple and practical.

---

## Tech Stack

Use the following stack:

- Framework: React Native + Expo
- Language: TypeScript
- Backend: Supabase
- Database: Supabase PostgreSQL
- Authentication: Supabase Auth
- Realtime: Supabase Realtime
- Push notifications: expo-notifications
- Navigation: Expo Router / React Navigation depending on existing project structure
- State management: Zustand
- UI library: React Native Paper
- Icons: @expo/vector-icons
- Build: EAS Build
- Package manager: npm

Important:

- Use TypeScript everywhere.
- Do not create `.js` files.
- Use `async/await`, not `.then()`.
- Use functional components and React hooks.
- Add loading, error, and empty states where appropriate.

---

## Current Project Context

FamilyTask main features:

- user registration
- user login
- family creation
- joining family by invite code
- shared family tasks
- task assignee
- task date and time
- task priority
- XP rewards
- streak system
- leaderboard inside family
- badges and achievements
- push reminders before deadline
- profile and family member stats

---

## Current Development Focus

Current focus:

- improve authentication
- improve registration
- improve login
- improve onboarding after registration
- create profile after registration
- redirect user depending on state
- prepare family creation and joining flow

Expected auth/onboarding flow:

1. User opens the app.
2. App checks Supabase session.
3. If there is no session:
   - show welcome/login/register flow.
4. If session exists:
   - check if profile exists.
5. If profile does not exist:
   - create profile or redirect to profile setup.
6. If profile exists but user has no family:
   - redirect to create/join family screen.
7. If user has family:
   - redirect to main home screen.

---

## Project Structure Rules

Before editing, inspect the actual repository.

Expected structure may include:

```text
app/
src/
  components/
  components/ui/
  screens/
  hooks/
  lib/
  types/
  constants/
  store/

Important paths:

src/lib/supabase.ts
src/components/
src/components/ui/
src/screens/
src/hooks/
src/types/
src/constants/
src/store/

Supabase client must always be imported from:

import { supabase } from '@/lib/supabase';

Do not create a second Supabase client in screens or components.

Routing Rules

The project may use Expo Router.

If Expo Router is used:

routes are defined inside app/
do not replace the routing system with a classic App.tsx navigator unless asked
use router.push, router.replace, or <Redirect /> where appropriate
keep route structure clean
do not create duplicate screens with the same purpose

If React Navigation is already used in the existing code, follow the existing pattern and do not mix navigation styles unnecessarily.

Before changing routing:

Inspect app/
Inspect layouts like app/_layout.tsx
Inspect tab layouts if they exist
Check current imports
Explain what will change
Supabase Rules

Supabase is used for:

Auth
PostgreSQL database
family data
profiles
tasks
XP logs
achievements
realtime updates

Rules:

Do not hardcode Supabase keys inside components.
Use only the existing Supabase client.
Put reusable database logic into helper files or hooks when needed.
Use try/catch for Supabase calls.
Show clear Ukrainian error messages to the user.
Keep database field names consistent with the schema.
Do not duplicate XP or task completion logic.
Do not create profiles/families/tasks with incomplete required data.
Database Schema

Expected database structure:

CREATE TABLE families (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 6),
  owner_id    UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id),
  family_id    UUID REFERENCES families(id),
  name         TEXT NOT NULL,
  avatar_emoji TEXT DEFAULT '😊',
  role         TEXT CHECK (role IN ('parent','child')) DEFAULT 'parent',
  points_total INTEGER DEFAULT 0,
  streak_days  INTEGER DEFAULT 0,
  last_active  DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id     UUID REFERENCES families(id),
  creator_id    UUID REFERENCES profiles(id),
  assignee_id   UUID REFERENCES profiles(id),
  title         TEXT NOT NULL,
  description   TEXT,
  emoji         TEXT DEFAULT '✅',
  due_date      DATE,
  due_time      TIME,
  priority      TEXT CHECK (priority IN ('low','medium','high')) DEFAULT 'medium',
  status        TEXT CHECK (status IN ('todo','done')) DEFAULT 'todo',
  points_reward INTEGER DEFAULT 10,
  recurring     TEXT CHECK (recurring IN ('none','daily','weekly','monthly')) DEFAULT 'none',
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE points_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES profiles(id),
  task_id    UUID REFERENCES tasks(id),
  amount     INTEGER NOT NULL,
  reason     TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE achievements (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES profiles(id),
  badge_type TEXT NOT NULL,
  earned_at  TIMESTAMPTZ DEFAULT NOW()
);

If the actual database differs from this schema, first explain the difference before making changes.

Design System

Use a bright gamified style.

Design principles:

light background
colorful accents
rounded cards
friendly UI
task cards with emojis
progress bars
streak counter with fire icon
XP and rewards should feel satisfying
avoid boring corporate UI

Use colors from the project constants when available.

Expected color palette:

export const COLORS = {
  primary: '#A855F7',
  primaryDark: '#7C3AED',
  primaryLight: '#EDE9FE',

  success: '#22C55E',
  successBg: '#F0FDF4',

  warning: '#F97316',
  warningBg: '#FFF7ED',

  danger: '#EF4444',
  dangerBg: '#FEF2F2',

  pink: '#EC4899',

  gold: '#F59E0B',
  goldBg: '#FFFBEB',

  streak: '#F97316',
  streakBg: '#FFF7ED',

  background: '#F9FAFB',
  card: '#FFFFFF',
  border: '#E5E7EB',
  textMain: '#111827',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
};

Rules:

Prefer using COLORS instead of hardcoded colors.
Buttons should be rounded and visually clear.
Cards should have rounded corners.
Use readable spacing.
UI should work well on mobile screens.
Keep text friendly and simple.
Use emoji where it makes the interface more playful.
Do not make the UI too dark or too corporate.
Task Card Style

Expected task card style:

const taskCardStyle = {
  backgroundColor: COLORS.primaryLight,
  borderRadius: 14,
  padding: 12,
  marginBottom: 8,
  borderWidth: 2,
  borderColor: '#D8B4FE',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
};

Task card visual states:

todo — purple style
done — green style
warning — orange style
overdue — red style

Use the existing project style system if it already exists.

Button Style

Main CTA buttons should be visually strong and rounded.

Expected style:

const primaryButton = {
  backgroundColor: COLORS.primary,
  borderRadius: 16,
  paddingVertical: 14,
  paddingHorizontal: 24,
  shadowColor: COLORS.primary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 6,
};

Use existing Button component if available.

Typography

Expected typography style:

const typography = {
  h1: { fontSize: 24, fontWeight: '800', color: COLORS.textMain },
  h2: { fontSize: 18, fontWeight: '700', color: COLORS.textMain },
  body: { fontSize: 14, fontWeight: '400', color: COLORS.textMuted },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.textLight },
  points: { fontSize: 12, fontWeight: '800', color: '#fff' },
};

Use system font by default.

Optional future font:

Nunito via expo-font

Do not add custom fonts unless requested.

UI Components

Prefer existing components.

Expected reusable components may include:

Button
Typo
Input
Card
TaskCard

Before creating a new component:

Check src/components/
Check src/components/ui/
Reuse existing UI patterns
Only create a new component if it is actually needed
Error Handling Rules

Every async action should have:

loading state
error handling
user-friendly message
safe fallback

Use Ukrainian messages for users.

Examples:

Alert.alert('Помилка', 'Не вдалося увійти. Спробуйте ще раз.');
Alert.alert('Помилка', 'Не вдалося створити сімʼю.');
Alert.alert('Успішно', 'Задачу створено.');

Do not show raw technical errors directly to normal users unless useful during development.

Screen State Rules

Each important screen should handle:

Loading state
Empty state
Error state
Success state where needed

Examples:

task list without tasks should show a friendly empty message
leaderboard without members should show a helpful message
profile loading should show ActivityIndicator
failed request should show a clear error
XP System

Expected XP rules:

Complete task on time: +10 XP
Complete task after deadline: +5 XP
High priority task bonus: +5 XP
3-day streak bonus: +15 XP
7-day streak bonus: +50 XP
First task before 09:00: +3 XP
Parent bonus/reward: +20 XP

When completing a task:

Update task status to done
Set completed_at
Add record to points_log
Update profiles.points_total
Update streak if needed
Check achievement unlocks if feature exists

Avoid duplicating XP if a task is already completed.

Achievements

Expected badges:

🔥 On Fire — 7-day streak
⚡ Early Bird — 10 tasks before 09:00
👑 Family Champion — first place of the week
💎 Diamond — 500 XP
🎯 Perfect Week — all weekly tasks completed

Do not implement all achievements at once unless requested.

Prefer one small achievement feature at a time.

Main Screens

Expected app structure:

Auth flow:
- WelcomeScreen
- LoginScreen
- RegisterScreen
- ForgotPasswordScreen

Onboarding flow:
- CreateFamilyScreen
- JoinFamilyScreen

Main tabs:
- HomeScreen
- CalendarScreen
- FamilyScreen
- ProfileScreen

HomeScreen should show:

today’s tasks
XP progress
streak counter
quick add task button
task status

CalendarScreen should show:

month view
tasks for selected day

FamilyScreen should show:

family members
leaderboard
invite code

ProfileScreen should show:

profile info
XP
streak
badges
settings
logout
Development Phases

Project phases:

Phase 1: Project setup + Supabase
Phase 2: Authentication + family space
Phase 3: Tasks + Calendar
Phase 4: XP + Streak + Leaderboard
Phase 5: Push reminders
Phase 6: Badges + Statistics + Animations
Phase 7: Testing + App Store / Google Play release

When working on a task, identify which phase it belongs to.

Do not jump to later phases unless needed.

Current Priority Tasks

Current likely priority:

Clean registration flow
Clean login flow
Create profile after registration
Redirect user after login/register
Add create family screen
Add join family by invite code
Prepare home screen after onboarding
Code Style Rules

Use:

TypeScript
functional components
React hooks
async/await
clear readable variable names
small helper functions
existing aliases if configured

Avoid:

.then()
.js files
duplicated Supabase clients
large unreadable components
unnecessary libraries
changing many unrelated files
breaking current navigation
hardcoded colors when COLORS exists
Import Rules

Prefer alias imports if the project supports them:

import { supabase } from '@/lib/supabase';
import { COLORS } from '@/constants/colors';

Before using alias imports, check that aliases are configured correctly in:

tsconfig.json
babel.config.js
metro.config.js

If aliases are already used in the project, continue using them.

If aliases are not configured or are broken, do not randomly replace all imports.

First explain the problem and suggest how to fix alias configuration.

Do not mix alias imports and long relative imports without a reason.

Preferred:

import { supabase } from '@/lib/supabase';
import { COLORS } from '@/constants/colors';

Avoid when alias works:

import { supabase } from '../../src/lib/supabase';
import { COLORS } from '../../../src/constants/colors';
How to Respond When Implementing

When asked to implement something, respond in this structure:

1. What I checked
2. What I will change
3. Files that need changes
4. Full code for each changed file
5. How to test manually
6. Possible risks or notes

When creating Jira tasks, use this structure:

Title
Type
Priority
Description
User Story
Subtasks
Acceptance Criteria
Test Cases
Notes
Manual Testing Checklist

For auth-related changes, test:

1. App opens without logged-in user
2. User can register
3. User can log in
4. Loading state appears
5. Errors are shown clearly
6. User is redirected correctly
7. Session remains after app reload
8. User can log out

For family-related changes, test:

1. User can create family
2. User becomes owner/admin
3. Invite code is generated
4. User can join family by invite code
5. Invalid invite code shows error
6. User with family goes to home screen

For task-related changes, test:

1. User can create task
2. Task appears on home screen
3. Task has assignee
4. Task has due date/time
5. Task can be completed
6. XP is added only once
Preferred Task Size

Prefer small tasks like:

Improve LoginScreen error handling
Create RegisterScreen profile creation
Add CreateFamilyScreen
Add JoinFamilyScreen
Add auth redirect logic
Add task creation form
Add task card component
Add XP calculation helper

Avoid huge tasks like:

Build the whole app
Rewrite all navigation
Create all screens at once
Implement full gamification system in one step
Language

User-facing text in the app should be Ukrainian.

Developer explanations can be Ukrainian or simple mixed Ukrainian/Russian if needed.

Examples of user-facing text:

Увійти
Зареєструватися
Створити сімʼю
Приєднатися до сімʼї
Задачу створено
Не вдалося завантажити дані
Сьогодні задач поки немає
Git and Safety Rules

Before making changes:

Understand the existing structure.
Identify which files are related to the task.
Avoid changing unrelated files.
Keep changes small.
Explain what was changed.

Do not delete files unless clearly required.

Do not rename important files unless requested.

Do not change package versions unless the task requires it.

If adding a dependency:

Explain why it is needed.
Show the install command.
Mention possible risks.
Final Rule

Before editing the project, always understand the existing structure first.

Do not guess.

Do not overcomplicate.

Make the app stable first, then beautiful, then advanced.