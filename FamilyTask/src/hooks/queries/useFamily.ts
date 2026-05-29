
import {
  createFamilyService,
  getCurrentFamily,
  getFamilyLeaderboard,
  getFamilyMembers,
  joinFamilyService,
  removeFamilyMember,
  updateFamilyName,
  updateMemberRole,
  uploadFamilyAvatar,
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

export function useUpdateFamilyName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ familyId, name }: { familyId: string; name: string }) =>
      updateFamilyName(familyId, name),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['family', variables.familyId] });
      queryClient.invalidateQueries({ queryKey: ['current-family'] });
    },
    onError: (error) => {
      console.error('Error updating family name:', error.message);
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


export function useUpdateFamilyAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ familyId, fileUri }: { familyId: string; fileUri: string }) =>
      uploadFamilyAvatar(familyId, fileUri),

    onSuccess: (_publicUrl, variables) => {
      queryClient.invalidateQueries({ queryKey: ["family", variables.familyId] });
      queryClient.invalidateQueries({ queryKey: ["current-family"] });
    },
    onError: (error) => {
      console.error("Error upload family avatar:", error.message);
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

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: ({
          memberId,
          role,
      }: {
          memberId: string;
          role: 'ADMIN' | 'MEMBER';
      }) => updateMemberRole(memberId, role),

      onSuccess: () => {
          queryClient.invalidateQueries({
              queryKey: ['family-members'],
          });
      },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: (memberId: string) =>
          removeFamilyMember(memberId),

      onSuccess: () => {
          queryClient.invalidateQueries({
              queryKey: ['family-members'],
          });
      },
  });
}

export function useFamilyLeaderboard(
    familyId?: string,
    period: "week" | "month" | "all" = "week"
  ) {
    return useQuery({
      queryKey: ["leaderboard", familyId],
      queryFn: () => getFamilyLeaderboard(familyId!, period),
      enabled: !!familyId,
    });
  }