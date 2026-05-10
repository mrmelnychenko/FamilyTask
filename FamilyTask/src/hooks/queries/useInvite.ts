import { getActiveFamilyInvite } from "@/src/services/invite-service";
import { useQuery } from "@tanstack/react-query";

export function useFamilyInvite(familyId?: string | null) {
  return useQuery({
    queryKey: ["family-invite", familyId],
    enabled: !!familyId,
    queryFn: () => getActiveFamilyInvite(familyId!),
  });
}
