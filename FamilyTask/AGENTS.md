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
- Server state: TanStack Query
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
- Use TanStack Query for Supabase/database requests and mutations.
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
- redirect user depending on state
- prepare family creation and joining flow

Important current architecture:

- TanStack Query is already installed and configured.
- `app/_layout.tsx` wraps the app with `QueryClientProvider`.
- `AuthProvider` stores the current Supabase user/session state.
- `RootLayoutNav` performs top-level auth checks and redirects between public/auth/protected routes.
- `app/(protected)/_layout.tsx` performs protected checks, including family access redirects.
- User profile creation is handled automatically by the backend/Supabase flow after registration. Do not manually create duplicate profiles in frontend code unless the backend behavior changes and the owner asks for it.
- Do not replace this auth/provider/redirect structure.

Expected auth/onboarding flow:

1. User opens the app.
2. `AuthProvider` checks Supabase session.
3. If there is no session:
   - show welcome/login/register flow.
4. If session exists:
   - use TanStack Query hooks to load profile/family state when needed.
5. If user has no family:
   - redirect to create/join family screen.
6. If user has family:
   - redirect to main home screen.

Redirect ownership:

- `RootLayoutNav` should keep the main auth redirects.
- `app/(protected)/_layout.tsx` should keep protected/family redirects.
- Screens should not duplicate layout redirect logic unless there is a very specific reason.

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
```

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

import { supabase } from '@/src/lib/supabase';

Do not create a second Supabase client in screens or components.

Actual current structure notes:

- Routes live in `app/`.
- Screens live in `src/screens/`.
- Reusable UI components live in `src/components/ui/`.
- Auth context lives in `src/providers/AuthProvider.tsx`.
- TanStack Query client/setup lives in `src/lib/queryClient.ts` and `src/lib/querySetup.ts`.
- Query hooks live in `src/hooks/queries/`.
- Database/service functions live in `src/services/`.
- Theme colors live in `src/utils/colors.ts` and Tailwind/NativeWind config.
- Family screens currently live in `src/screens/family/`.
- Family routes currently live in `app/(protected)/(family)/`.

Routing Rules

The project may use Expo Router.

If Expo Router is used:

routes are defined inside app/
do not replace the routing system with a classic App.tsx navigator unless asked
use router.push, router.replace, or <Redirect /> where appropriate
keep route structure clean
do not create duplicate screens with the same purpose
do not replace `RootLayoutNav`, `AuthProvider`, or the protected layout redirect flow unless explicitly requested

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
Put reusable database logic into service files and access it from TanStack Query hooks.
Use `useQuery` for reads and `useMutation` for create/update/delete actions.
After mutations, invalidate or update the relevant query keys.
Do not make direct Supabase database requests inside screens when an existing service/query hook should be used.
Prefer one structured Supabase query with nested selects/relations over multiple sequential queries when the schema relationship supports it.
For family members, reuse the existing `getFamilyMembers` pattern from `src/services/family-service.ts` instead of manually querying `family_members`, mapping ids, then querying `profiles` with `.in(...)`.
Avoid client-side join code unless there is no relationship available in Supabase.
Use try/catch for Supabase calls.
Show clear Ukrainian error messages to the user.
Keep database field names consistent with the schema.
Do not duplicate XP or task completion logic.
Do not create profiles/families/tasks with incomplete required data.
Do not manually insert a profile during registration if the backend already creates it automatically.
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
  created_by    UUID REFERENCES profiles(id),
  assigned_to   UUID REFERENCES profiles(id),
  title         TEXT NOT NULL,
  description   TEXT,
  deadline      TIMESTAMPTZ,
  status        TEXT,
  xp_reward     INTEGER,
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

Current schema notes from the existing code:

- `families` currently uses `created_by` in frontend service code.
- Family membership is checked through a `family_members` table.
- Invite creation uses an `invites` table with `family_id`, `invite_code`, `created_by`, `status`, and role/email fields.
- Profile creation is expected to happen automatically after auth registration.
- `tasks` currently uses `created_by`, `assigned_to`, `deadline`, and `xp_reward`.
- `tasks` does not currently expose `creator_id`, `assignee_id`, `due_date`, `due_time`, `priority`, `points_reward`, `recurring`, or `completed_at` in the Supabase REST schema.
- Do not send `tasks.status` from the frontend on create unless the real allowed values are verified first. Let the database default handle initial status.
- Before adding or changing database fields, inspect the current Supabase schema or existing service code and explain any mismatch.

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
In the current project, prefer `colors` from `@/src/utils/colors` and NativeWind theme classes.

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

Prefer using the existing color tokens instead of hardcoded colors.
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
Box
LoadingScreen
Card
TaskCard

Current UI rule:

- For buttons, text, inputs, and loading UI, use the custom components from `src/components/ui/`.
- Prefer `Button`, `Typo`, `Input`, `Box`, and `LoadingScreen` over raw `Pressable`, `Text`, `TextInput`, or `ActivityIndicator` in new feature code.
- Use NativeWind `className` styling when it matches the existing component style.
- Use `colors` from `@/src/utils/colors` when inline styles are needed.
- Create reusable feature components when a screen grows beyond a simple form or repeated UI appears.
- For task UI, prefer small components such as task form fields, emoji picker, priority selector, assignee selector, and XP summary instead of putting everything inside one screen file.
- Keep screens focused on data loading, submit handlers, and composition. Move reusable visual blocks to `src/components/`.

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

For forms:

- Use `react-hook-form` with `Controller`.
- Use Zod schemas with `zodResolver` when validation is needed.
- Show field validation through the custom `Input` `error` prop.
- Show submit/server errors as inline UI using `Typo`/`View`, not `Alert.alert`.
- Avoid `Alert.alert` for normal form validation or expected API errors.
- `Alert.alert` can be used only for rare blocking system-level messages or explicit confirmation dialogs.

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
Redirect user after login/register
Add create family screen
Add join family by invite code
Prepare home screen after onboarding

Important:

- Do not add frontend profile creation after registration unless explicitly requested. Registration should rely on the existing backend automatic profile creation.
- Keep all auth and family state reads aligned with TanStack Query and existing providers/layouts.
Code Style Rules

Use:

TypeScript
functional components
React hooks
async/await
react-hook-form for non-trivial forms
Zod schemas for form validation
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
hardcoded colors when `colors` or NativeWind theme classes exist
large screen components with all form sections inline
manual `useState` form handling for create/edit forms when `react-hook-form` fits
normal validation or API errors shown with `Alert.alert`

Component size and structure:

- If a screen grows past roughly 200 lines, look for natural components to extract before adding more logic.
- Prefer feature components that can be reused in future screens.
- Keep form schemas in `src/schemas/`.
- Keep submit/database logic in services and TanStack Query hooks, not in presentational components.
- For create/edit flows, make the screen compose a form component plus small selectors/cards instead of owning every input directly.
Import Rules

Prefer alias imports if the project supports them:

import { supabase } from '@/src/lib/supabase';
import { colors } from '@/src/utils/colors';

Before using alias imports, check that aliases are configured correctly in:

tsconfig.json
babel.config.js
metro.config.js

If aliases are already used in the project, continue using them.

If aliases are not configured or are broken, do not randomly replace all imports.

First explain the problem and suggest how to fix alias configuration.

Do not mix alias imports and long relative imports without a reason.

Preferred:

import { supabase } from '@/src/lib/supabase';
import { colors } from '@/src/utils/colors';

Avoid when alias works:

import { supabase } from '../../src/lib/supabase';
import { colors } from '../../../src/utils/colors';
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

Task Feature Implementation Rules

When working on task creation or editing:

- Use `react-hook-form` with a Zod schema.
- Do not validate task form fields with manual `useState` checks and `Alert.alert`.
- Show validation errors directly near inputs through the custom `Input` component.
- Show create/update failures as inline error blocks.
- Keep `CreateTaskScreen` small. Extract reusable pieces such as `TaskForm`, `EmojiPicker`, `PrioritySelector`, `AssigneeSelector`, and `TaskXpSummary` when needed.
- Reuse existing family/member query patterns. Do not manually join `family_members` and `profiles` in frontend code when Supabase nested select can return the related profile.
- Keep the final insert payload aligned with the real `tasks` columns: `family_id`, `created_by`, `assigned_to`, `title`, `description`, `deadline`, `xp_reward`.
- Do not send unsupported task fields such as `assignee_id`, `creator_id`, `due_date`, `due_time`, `points_reward`, or `priority` unless the real database schema is updated first.
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

Branch workflow:

- Do not push directly to `master`.
- Before starting a change that will be shared, create a separate branch from the latest `master`.
- Use a clear branch name, for example `codex/update-agents-instructions` or the project task format like `KAN-13_short-description`.
- Commit only related files.
- Push the feature branch and open a pull request into `master`.
- If the owner asks to publish changes, explain the branch, commit, push, and PR steps before doing them.

If adding a dependency:

Explain why it is needed.
Show the install command.
Mention possible risks.
Final Rule

Before editing the project, always understand the existing structure first.

Do not guess.

Do not overcomplicate.

Make the app stable first, then beautiful, then advanced.
