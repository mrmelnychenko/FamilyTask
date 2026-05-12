import { supabase } from "@/src/lib/supabase";
import type { TaskPriority } from "@/src/schemas/task.schema";
import { ITask, ITaskRow } from "../types/task";


export type CreateTaskParams = {
  familyId: string;
  creatorId: string;
  assigneeId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  dueTime?: string | null;
  priority: TaskPriority;
};

export async function getFamilyTasks(familyId: string): Promise<ITask[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
  id,
  family_id,
  title,
  description,
  deadline,
  status,
  xp_reward,
  created_at,

  assigned_to,
  created_by,

  assignee:profiles!tasks_assigned_to_fkey(*),
  creator:profiles!tasks_created_by_fkey(*)
`
    )
    .eq("family_id", familyId)
    .order("deadline", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(task => ({
    ...task,
    assignee: Array.isArray(task.assignee) ? task.assignee[0] : task.assignee,
    creator: Array.isArray(task.creator) ? task.creator[0] : task.creator,
  })) as ITask[];
}
export async function createTaskService(params: CreateTaskParams) {
  const deadline = params.dueDate
    ? `${params.dueDate}T${params.dueTime ?? "23:59"}:00`
    : null;

  const { error } = await supabase.from("tasks").insert({
    family_id: params.familyId,
    created_by: params.creatorId,
    assigned_to: params.assigneeId,
    title: params.title,
    description: params.description ?? null,
    deadline,
    xp_reward: params.priority === "high" ? 15 : 10,
  });

  if (error) {
    throw error;
  }
}
