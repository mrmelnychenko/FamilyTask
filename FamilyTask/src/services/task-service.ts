import { supabase } from "@/src/lib/supabase";
import type { TaskPriority } from "@/src/schemas/task.schema";

export type FamilyTask = {
  id: string;
  family_id: string;
  created_by: string | null;
  assigned_to: string | null;
  title: string;
  description: string | null;
  deadline: string | null;
  status: string | null;
  xp_reward: number | null;
  created_at: string;
};

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

export async function getFamilyTasks(familyId: string): Promise<FamilyTask[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select(
      "id, family_id, created_by, assigned_to, title, description, deadline, status, xp_reward, created_at"
    )
    .eq("family_id", familyId)
    .order("deadline", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as FamilyTask[];
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
