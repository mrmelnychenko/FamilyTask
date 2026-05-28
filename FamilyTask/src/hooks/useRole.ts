import { useCurrentFamily } from "./queries/useFamily";
import { useFamilyRole } from "./queries/useProfile";
import { useAuth } from "./useAuth";

export function useCurrentFamilyRole() {
    const { user } = useAuth();
    const { data: currentFamily } = useCurrentFamily(user?.id);
    return useFamilyRole(currentFamily?.family_id, user?.id);
  }