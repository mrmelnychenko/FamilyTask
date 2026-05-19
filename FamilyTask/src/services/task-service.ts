import { supabase } from "@/src/lib/supabase";
import { format, getDay, getDate } from "date-fns";
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

export async function createTaskService(params: CreateTaskParams): Promise<void> {
  const deadline =
    !params.is_recurring && params.dueDate
      ? `${params.dueDate}T${params.dueTime ?? "23:59"}:00`
      : null;

  const { error } = await supabase.from("tasks").insert({
    family_id: params.familyId,
    created_by: params.creatorId,
    assigned_to: params.assigneeId,
    title: params.title,
    description: params.description ?? null,
    deadline,
    priority: params.priority,
    category: params.category,
    xp_reward: params.priority === "high" ? 15 : params.priority === "normal" ? 10 : 5,
    is_recurring: params.is_recurring,
    recurrence: params.recurrence ?? null,
    recurrence_days: params.recurrence_days ?? null,
    recurrence_end_date: params.recurrence_end_date ?? null,
  });

  if (error) throw error;
}

export async function completeTask(
  taskId: string,
  userId: string,
  xpEarned: number,
  recurringDate?: string
): Promise<void> {
  const isRecurring = !!recurringDate;

  await Promise.all([

    supabase.from("task_completions").insert({
      task_id: taskId,
      user_id: userId,
      xp_earned: xpEarned,
      recurring_date: recurringDate ?? null,
    }),

  
    !isRecurring
      ? supabase.from("tasks").update({ status: "DONE" }).eq("id", taskId)
      : Promise.resolve(),
  ]);
}

export async function uncompleteTask(
  taskId: string,
  userId: string,
  recurringDate?: string
): Promise<void> {
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