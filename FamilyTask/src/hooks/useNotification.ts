import { useEffect } from "react";
import { supabase } from "@/src/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export function useNotificationsRealtime(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // 🔥 главный момент
          queryClient.invalidateQueries({
            queryKey: ["notifications", userId],
          });

          queryClient.invalidateQueries({
            queryKey: ["notifications-unread", userId],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
}
