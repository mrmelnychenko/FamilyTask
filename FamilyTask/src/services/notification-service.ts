import { supabase } from "@/src/lib/supabase";



export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
  *,
  actor:profiles!notifications_actor_id_fkey(*),
  task:tasks(*),
  family:families(*)
`
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) throw error;
}
