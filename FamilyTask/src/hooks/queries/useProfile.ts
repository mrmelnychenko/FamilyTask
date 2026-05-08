import { useQuery } from "@tanstack/react-query";
import {  getProfile } from "../../services/profile-service";


export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
    staleTime: 1000 * 30,
    retry: 1,
  });
}

// export function useCreateProfile() {
//     const queryClient = useQueryClient();
  
//     return useMutation({
//       mutationFn: createProfile,
//       onSuccess: (data) => {
//         queryClient.setQueryData(["profile", data.id], data);
//       },
//     });
//   }

