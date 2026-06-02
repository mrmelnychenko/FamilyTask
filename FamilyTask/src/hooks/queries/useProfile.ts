import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFamilyRole,
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../../services/profile-service";
import { supabase } from "@/src/lib/supabase";

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
    staleTime: 1000 * 30,
    retry: 1,
  });
}

export function useFamilyRole(
  familyId?: string | null,
  userId?: string | null
) {
  const { data: role, ...query } = useQuery({
    queryKey: ["familyRole", familyId, userId],
    queryFn: () => getFamilyRole(familyId!, userId!),
    enabled: !!familyId && !!userId,
    staleTime: 5 * 60 * 1000,
  });
  return {
    ...query,
    role: role ?? null,
    isOwner: role === "OWNER",
    isAdmin: role === "ADMIN" || role === "OWNER",
    isMember: !!role,
  };
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

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["family-members"],
      });
    },

    onError: (error) => {
      console.error("Error update profile:", error.message);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
    },
  });
}
