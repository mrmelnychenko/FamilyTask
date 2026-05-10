import {
  createTaskService,
  getTaskMembers,
} from "@/src/services/task-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTaskMembers(familyId?: string | null) {
  return useQuery({
    queryKey: ["task-members", familyId],
    enabled: !!familyId,
    queryFn: () => getTaskMembers(familyId!),
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
