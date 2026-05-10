import { supabase } from "@/src/lib/supabase";

export type TaskMember = {
  id: string;
  name: string | null;
  email: string | null;
  avatar_emoji: string | null;
  family_id: string;
};

export type CreateTaskParams = {
  familyId: string;
  creatorId: string;
  assigneeId: string;
  title: string;
  description?: string | null;
  emoji: string;
  dueDate?: string | null;
  dueTime?: string | null;
  priority: "low" | "medium" | "high";
};

type FamilyMemberRow = {
  user_id: string;
};

type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
  avatar_emoji: string | null;
};

export async function getTaskMembers(familyId: string): Promise<TaskMember[]> {
  const { data: familyMembers, error: familyMembersError } = await supabase
    .from("family_members")
    .select("user_id")
    .eq("family_id", familyId);

  if (familyMembersError) {
    throw familyMembersError;
  }

  const userIds =
    (familyMembers as FamilyMemberRow[] | null)?.map((member) => member.user_id) ??
    [];

  if (userIds.length === 0) {
    return [];
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, name, email, avatar_emoji")
    .in("id", userIds)
    .order("name", { ascending: true });

  if (profilesError) {
    throw profilesError;
  }

  return ((profiles as ProfileRow[] | null) ?? []).map((profile) => ({
    ...profile,
    family_id: familyId,
  }));
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
