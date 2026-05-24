import { useEffect } from "react";

import { scheduleTaskReminder } from "@/src/services/notification-service";
import { getUpcomingAssignedTasks } from "@/src/services/task-service";

export function useTaskReminderSync(userId?: string) {
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    async function syncTaskReminders() {
      try {
        const tasks = await getUpcomingAssignedTasks(userId!);
        if (!isMounted) return;

        await Promise.all(
          tasks.map((task) =>
            scheduleTaskReminder({
              taskId: task.id,
              title: task.title,
              deadline: task.deadline,
              requestPermission: false,
            })
          )
        );
      } catch {
        // Reminder sync should never block the protected app flow.
      }
    }

    void syncTaskReminders();

    return () => {
      isMounted = false;
    };
  }, [userId]);
}
