import { supabase } from "@/src/lib/supabase";
import { NotificationType } from "@/src/types/notification";

type CreateNotificationParams = {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
};

export async function createNotification({
  userId,
  type,
  title,
  body,
}: CreateNotificationParams) {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    body,
  });

  if (error) {
    throw error;
  }
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
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
