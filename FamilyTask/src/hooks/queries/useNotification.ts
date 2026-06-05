import { supabase } from "@/src/lib/supabase";
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
} from "@/src/services/notification-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUnreadNotificationsCount(userId?: string) {
  return useQuery({
    queryKey: ["notifications-unread", userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId!)
        .eq("is_read", false);

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!userId,
  });
}

export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getNotifications(userId!),
    enabled: !!userId,
  });
}

export function useCreateNotification(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNotification,

    onSuccess: () => {
      if (!userId) return;

      queryClient.invalidateQueries({
        queryKey: ["notifications", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["notifications-unread", userId],
      });
    },
  });
}

export function useMarkNotificationAsRead(userId: string) {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: markNotificationAsRead,
  
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["notifications", userId],
        })
  
        queryClient.invalidateQueries({
          queryKey: ["notifications-unread", userId],
        })
      },
    })
  }