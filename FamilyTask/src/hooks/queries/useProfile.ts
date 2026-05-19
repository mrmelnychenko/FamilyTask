import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  getProfile, uploadAvatar } from "../../services/profile-service";


export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
    staleTime: 1000 * 30,
    retry: 1,
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, fileUri }: { userId: string; fileUri: string }) =>
      uploadAvatar(userId, fileUri),

    onSuccess: (_publicUrl, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["leaderboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: (error) => {
      console.error("Error upload avatar:", error.message);
    },
  });
}