import {
  completeTask,
  createTaskService,
  deleteTask,
  getMyTodayTasks,
  getTasks,
  uncompleteTask,
} from "@/src/services/task-service";
import {
  cancelTaskReminder,
  scheduleTaskReminder,
} from "@/src/services/notification-service";
import { checkAndUnlockAchievements } from "@/src/services/achievement-service";
import { CreateTaskParams } from "@/src/types/task";
import { useAppToast } from "@/src/hooks/useToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { format } from "date-fns";

function invalidateTaskProgress(
  queryClient: ReturnType<typeof useQueryClient>,
  familyId: string,
  userId: string
) {
  queryClient.invalidateQueries({ queryKey: ["tasks"] });
  queryClient.invalidateQueries({ queryKey: ["leaderboard", familyId] });
  queryClient.invalidateQueries({ queryKey: ["profile", userId] });
  queryClient.invalidateQueries({ queryKey: ["family-members", familyId] });
}

export function useTasks(familyId?: string, date?: Date) {
  return useQuery({
    queryKey: ["tasks", familyId, date ? format(date, "yyyy-MM-dd") : null],
    queryFn: () => getTasks(familyId!, date!),
    enabled: !!familyId && !!date,
  });
}

export function useMyTodayTasks(userId?: string) {
  return useQuery({
    queryKey: ["tasks", "today", userId],
    queryFn: () => getMyTodayTasks(userId!),
    enabled: !!userId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation({
    mutationFn: (params: CreateTaskParams) => createTaskService(params),
    onSuccess: async (task, params) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      if (!task.is_recurring && task.assigned_to === params.creatorId) {
        const notificationId = await scheduleTaskReminder({
          taskId: task.id,
          title: task.title,
          deadline: task.deadline,
        });

        if (notificationId) {
          toast.info({
            title: "Нагадування увімкнено",
            message: "Ми нагадаємо за 30 хвилин до дедлайну.",
          });
        }
      }
    },
    onError: () => {
      toast.error({
        title: "Не вдалося створити задачу",
        message: "Перевірте дані та спробуйте ще раз.",
      });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation({
    mutationFn: ({
      taskId,
      userId,
      xpEarned,
      recurringDate,
    }: {
      taskId: string;
      userId: string;
      xpEarned: number;
      familyId: string;
      recurringDate?: string;
    }) => completeTask(taskId, userId, xpEarned, recurringDate),
    onSuccess: async (_data, variables) => {
      invalidateTaskProgress(queryClient, variables.familyId, variables.userId);
      const unlockedAchievements = await checkAndUnlockAchievements(
        variables.userId
      );
      queryClient.invalidateQueries({
        queryKey: ["achievements", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile-task-stats", variables.userId],
      });

      if (!variables.recurringDate) {
        await cancelTaskReminder(variables.taskId);
      }

      if (unlockedAchievements.length > 0) {
        toast.success({
          title: "Новий бейдж!",
          message: "Відкрийте профіль, щоб побачити досягнення.",
        });
      }
    },
    onError: () => {
      toast.error({
        title: "Не вдалося виконати задачу",
        message: "Перевірте інтернет і спробуйте ще раз.",
      });
    },
  });
}

export function useUncompleteTask() {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation({
    mutationFn: ({
      taskId,
      userId,
      recurringDate,
    }: {
      taskId: string;
      userId: string;
      familyId: string;
      recurringDate?: string;
      title?: string;
      deadline?: string | null;
    }) => uncompleteTask(taskId, userId, recurringDate),
    onSuccess: async (_data, variables) => {
      invalidateTaskProgress(queryClient, variables.familyId, variables.userId);
      queryClient.invalidateQueries({
        queryKey: ["profile-task-stats", variables.userId],
      });

      if (!variables.recurringDate && variables.deadline && variables.title) {
        await scheduleTaskReminder({
          taskId: variables.taskId,
          title: variables.title,
          deadline: variables.deadline,
          requestPermission: false,
        });
      }
    },
    onError: () => {
      toast.error({
        title: "Не вдалося змінити задачу",
        message: "Спробуйте ще раз трохи пізніше.",
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const toast = useAppToast();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: async (_data, taskId) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await cancelTaskReminder(taskId);

      toast.success({
        title: "Задачу видалено",
      });
    },
    onError: () => {
      toast.error({
        title: "Не вдалося видалити задачу",
        message: "Перевірте зʼєднання і повторіть дію.",
      });
    },
  });
}
