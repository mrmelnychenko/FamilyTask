import {
  createFamilyService,
  getCurrentFamily,
//   joinFamilyService,
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

// export function useJoinFamily() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: joinFamilyService,

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["profile"] });
//     },
//   });
// }

export function useCurrentFamily(userId?: string) {
    return useQuery({
      queryKey: ["current-family", userId],
      enabled: !!userId,
  
      queryFn: async () => {
        if (!userId) return null;
  
        return getCurrentFamily(userId);
      },
    });
  }