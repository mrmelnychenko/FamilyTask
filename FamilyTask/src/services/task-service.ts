import { supabase } from "@/src/lib/supabase";
import { format, getDay, getDate, subDays } from "date-fns";
import { CreateTaskParams, ITask } from "../types/task";

const PROFILE_SELECT = `
  id,
  email,
  name,
  avatar_emoji,
  avatar_url,
  role,
  xp,
  streak,
  created_at
`;

const TASK_SELECT = `
  *,
  completions:task_completions(*),
  assignee:profiles!tasks_assigned_to_fkey (${PROFILE_SELECT}),
  creator:profiles!tasks_created_by_fkey (${PROFILE_SELECT})
`;

type TaskCompletionRow = {
  id: string;
  xp_earned: number;
  completed_at: string;
  recurring_date: string | null;
};

type ProfileStatsRow = {
  xp: number | null;
  streak: number | null;
};

function getDateKey(date = new Date()) {
  return format(date, "yyyy-MM-dd");
}

function getDayRange(dateKey: string) {
  return {
    from: `${dateKey}T00:00:00`,
    to: `${dateKey}T23:59:59`,
  };
}

async function getExistingCompletion(
  taskId: string,
  userId: string,
  recurringDate?: string
): Promise<TaskCompletionRow | null> {
  let query = supabase
    .from("task_completions")
    .select("id, xp_earned, completed_at, recurring_date")
    .eq("task_id", taskId)
    .eq("user_id", userId);

  query = recurringDate
    ? query.eq("recurring_date", recurringDate)
    : query.is("recurring_date", null);

  const { data, error } = await query
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data as TaskCompletionRow | null;
}

async function hasUserCompletionOnDate(userId: string, dateKey: string) {
  const { from, to } = getDayRange(dateKey);
  const { data, error } = await supabase
    .from("task_completions")
    .select("id")
    .eq("user_id", userId)
    .gte("completed_at", from)
    .lte("completed_at", to)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return !!data;
}

async function calculateCurrentStreak(userId: string) {
  const { data, error } = await supabase
    .from("task_completions")
    .select("completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error) throw error;

  const completionDates = Array.from(
    new Set(
      ((data ?? []) as { completed_at: string }[]).map((completion) =>
        getDateKey(new Date(completion.completed_at))
      )
    )
  );

  if (completionDates.length === 0) {
    return 0;
  }

  const today = getDateKey();
  const yesterday = getDateKey(subDays(new Date(), 1));
  const latestDate = completionDates[0];

  if (latestDate !== today && latestDate !== yesterday) {
    return 0;
  }

  let streak = 0;
  let expectedDate = latestDate;

  for (const completionDate of completionDates) {
    if (completionDate !== expectedDate) {
      break;
    }

    streak += 1;
    expectedDate = getDateKey(subDays(new Date(`${completionDate}T12:00:00`), 1));
  }

  return streak;
}

async function updateProfileAfterCompletion({
  userId,
  xpDelta,
  hadCompletionOnDate,
}: {
  userId: string;
  xpDelta: number;
  hadCompletionOnDate: boolean;
}) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("xp, streak")
    .eq("id", userId)
    .single();

  if (error) throw error;

  const profileStats = profile as ProfileStatsRow;
  const nextProfile: Partial<ProfileStatsRow> = {
    xp: Math.max(0, (profileStats.xp ?? 0) + xpDelta),
  };

  if (!hadCompletionOnDate) {
    nextProfile.streak = await calculateCurrentStreak(userId);
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(nextProfile)
    .eq("id", userId);

  if (updateError) throw updateError;
}

async function updateProfileAfterUncomplete(userId: string, xpDelta: number) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", userId)
    .single();

  if (error) throw error;

  const currentXp = (profile as ProfileStatsRow).xp ?? 0;
  const nextStreak = await calculateCurrentStreak(userId);
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      xp: Math.max(0, currentXp - xpDelta),
      streak: nextStreak,
    })
    .eq("id", userId);

  if (updateError) throw updateError;
}

export async function getTasks(familyId: string, date: Date): Promise<ITask[]> {
  const from = format(date, "yyyy-MM-dd") + "T00:00:00";
  const to = format(date, "yyyy-MM-dd") + "T23:59:59";
  const dayOfWeek = getDay(date);
  const dayOfMonth = getDate(date);

  const [{ data: onetime, error: e1 }, { data: recurring, error: e2 }] =
    await Promise.all([
      supabase
        .from("tasks")
        .select(TASK_SELECT)
        .eq("family_id", familyId)
        .eq("is_recurring", false)
        .gte("deadline", from)
        .lte("deadline", to)
        .order("deadline", { ascending: true }),

      supabase
        .from("tasks")
        .select(TASK_SELECT)
        .eq("family_id", familyId)
        .eq("is_recurring", true)
        .or(
          `recurrence.eq.daily,` +
          `and(recurrence.eq.weekly,recurrence_days.cs.{${dayOfWeek}}),` +
          `and(recurrence.eq.monthly,recurrence_days.cs.{${dayOfMonth}})`
        )
        .or(`recurrence_end_date.is.null,recurrence_end_date.gte.${from}`),
    ]);

  if (e1) throw new Error(e1.message);
  if (e2) throw new Error(e2.message);

  return [...(onetime ?? []), ...(recurring ?? [])] as unknown as ITask[];
}

export async function getMyTodayTasks(userId: string): Promise<ITask[]> {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const from = `${todayStr}T00:00:00`;
  const to = `${todayStr}T23:59:59`;
  const dayOfWeek = getDay(new Date());
  const dayOfMonth = getDate(new Date());
  const [{ data: onetime, error: e1 }, { data: recurring, error: e2 }] =
    await Promise.all([
      supabase
        .from("tasks")
        .select(TASK_SELECT)
        .eq("assigned_to", userId)
        .eq("is_recurring", false)
        .neq("status", "DONE")
        .gte("deadline", from)
        .lte("deadline", to)
        .order("deadline", { ascending: true }),

      supabase
        .from("tasks")
        .select(TASK_SELECT)
        .eq("assigned_to", userId)
        .eq("is_recurring", true)
        .or(
          `recurrence.eq.daily,` +
          `and(recurrence.eq.weekly,recurrence_days.cs.{${dayOfWeek}}),` +
          `and(recurrence.eq.monthly,recurrence_days.cs.{${dayOfMonth}})`
        )
        .or(`recurrence_end_date.is.null,recurrence_end_date.gte.${from}`),
    ]);
  if (e1) throw new Error(e1.message);
  if (e2) throw new Error(e2.message);

  return [...(onetime ?? []), ...(recurring ?? [])] as unknown as ITask[];
}

export async function getUpcomingAssignedTasks(userId: string): Promise<ITask[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("tasks")
    .select(TASK_SELECT)
    .eq("assigned_to", userId)
    .eq("is_recurring", false)
    .neq("status", "DONE")
    .not("deadline", "is", null)
    .gte("deadline", now)
    .order("deadline", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as ITask[];
}

export async function createTaskService(params: CreateTaskParams): Promise<ITask> {
  const deadline =
    !params.is_recurring && params.dueDate
      ? `${params.dueDate}T${params.dueTime ?? "23:59"}:00`
      : null;

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      family_id: params.familyId,
      created_by: params.creatorId,
      assigned_to: params.assigneeId,
      title: params.title,
      description: params.description ?? null,
      deadline,
      priority: params.priority,
      category: params.category,
      xp_reward:
        params.priority === "high" ? 15 : params.priority === "normal" ? 10 : 5,
      is_recurring: params.is_recurring,
      recurrence: params.recurrence ?? null,
      recurrence_days: params.recurrence_days ?? null,
      recurrence_end_date: params.recurrence_end_date ?? null,
    })
    .select(TASK_SELECT)
    .single();

  if (error) throw error;

  return data as unknown as ITask;
}

export async function completeTask(
  taskId: string,
  userId: string,
  xpEarned: number,
  recurringDate?: string
): Promise<void> {
  const isRecurring = !!recurringDate;
  const existingCompletion = await getExistingCompletion(
    taskId,
    userId,
    recurringDate
  );

  if (existingCompletion) {
    if (!isRecurring) {
      const { error } = await supabase
        .from("tasks")
        .update({ status: "DONE" })
        .eq("id", taskId);

      if (error) throw error;
    }

    return;
  }

  const completionDate = getDateKey();
  const hadCompletionOnDate = await hasUserCompletionOnDate(
    userId,
    completionDate
  );

  const { error: completionError } = await supabase
    .from("task_completions")
    .insert({
      task_id: taskId,
      user_id: userId,
      xp_earned: xpEarned,
      recurring_date: recurringDate ?? null,
    });

  if (completionError) {
    if (completionError.code === "23505") {
      return;
    }

    throw completionError;
  }

  if (!isRecurring) {
    const { error } = await supabase
      .from("tasks")
      .update({ status: "DONE" })
      .eq("id", taskId);

    if (error) throw error;
  }

  await updateProfileAfterCompletion({
    userId,
    xpDelta: xpEarned,
    hadCompletionOnDate,
  });
}

export async function uncompleteTask(
  taskId: string,
  userId: string,
  recurringDate?: string
): Promise<void> {
  const existingCompletion = await getExistingCompletion(
    taskId,
    userId,
    recurringDate
  );

  let query = supabase
    .from("task_completions")
    .delete()
    .eq("task_id", taskId)
    .eq("user_id", userId);

  if (recurringDate) {
    query = query.eq("recurring_date", recurringDate);
  }

  const { error } = await query;
  if (error) throw error;

  if (existingCompletion) {
    await updateProfileAfterUncomplete(userId, existingCompletion.xp_earned);
  }

  if (!recurringDate) {
    const { error: e } = await supabase
      .from("tasks")
      .update({ status: "PENDING" })
      .eq("id", taskId);
    if (e) throw e;
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw error;
}
