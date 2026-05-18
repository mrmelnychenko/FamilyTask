import {
  completeTask,
  createTaskService,
  getFamilyTasks,
  getMyTodayTasks,
} from "@/src/services/task-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFamilyTasks(familyId?: string | null) {
  return useQuery({
    queryKey: ["tasks", familyId],
    enabled: !!familyId,
    queryFn: () => getFamilyTasks(familyId!),
  });
}

export function useMyTodayTasks(userId:string) {
  return useQuery({
    queryKey: ["tasks", userId],
    enabled: !!userId,
    queryFn: () => getMyTodayTasks(userId!),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskService,
    onSuccess: async (_data) => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId }: { taskId: string; familyId: string, userId: string }) => 
    completeTask(taskId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks", variables.familyId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["leaderboard", variables.familyId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["profile", variables.userId], 
      });
    },
  });
}