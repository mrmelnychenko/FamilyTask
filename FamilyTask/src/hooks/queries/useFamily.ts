import {
  createFamilyService,
  getCurrentFamily,
  getFamilyMembers,
  joinFamilyService,
} from "@/src/services/family-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCreateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFamilyService,

    onSuccess: async (_) => {
      await queryClient.invalidateQueries({
        queryKey: ["current-family"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
}

export function useJoinFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinFamilyService,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["current-family"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
}

export function useCurrentFamily(userId?: string) {
  return useQuery({
    queryKey: ["current-family", userId],
    enabled: !!userId,
    queryFn: () => getCurrentFamily(userId!),
  });
}

export function useFamilyMembers(familyId?: string) {
  return useQuery({
    queryKey: ["family-members", familyId],
    queryFn: () => getFamilyMembers(familyId!),
    enabled: !!familyId,
  });
}
