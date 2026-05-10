import {
  createTaskService,
  getFamilyTasks,
} from "@/src/services/task-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFamilyTasks(familyId?: string | null) {
  return useQuery({
    queryKey: ["tasks", familyId],
    enabled: !!familyId,
    queryFn: () => getFamilyTasks(familyId!),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskService,
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["tasks", variables.familyId],
      });
    },
  });
}
