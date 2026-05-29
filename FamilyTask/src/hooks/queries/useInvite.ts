import { getActiveFamilyInvite, regenerateNewInviteCode } from "@/src/services/invite-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFamilyInvite(familyId?: string | null) {
  return useQuery({
    queryKey: ["family-invite", familyId],
    enabled: !!familyId,
    queryFn: () => getActiveFamilyInvite(familyId!),
  });
}

export function useRegenerateNewInviteCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ familyId }: { familyId: string }) =>
      regenerateNewInviteCode({ familyId }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["family-invite", variables.familyId],
      });
    },
    onError: (error) => {
      console.error("Error regenerate invite:", error.message);
    },
  });
}