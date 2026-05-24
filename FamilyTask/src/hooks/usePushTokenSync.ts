import { useEffect } from "react";
import { Platform } from "react-native";

import { getExpoPushToken } from "@/src/services/notification-service";
import { savePushToken } from "@/src/services/push-token-service";

export function usePushTokenSync(userId?: string) {
  useEffect(() => {
    if (!userId || (Platform.OS !== "ios" && Platform.OS !== "android")) {
      return;
    }

    let isMounted = true;

    async function syncPushToken() {
      try {
        const token = await getExpoPushToken();
        if (!token || !isMounted) return;

        await savePushToken({ userId: userId!, token });
      } catch {
        // Push token sync should not block app usage.
      }
    }

    void syncPushToken();

    return () => {
      isMounted = false;
    };
  }, [userId]);
}
