import { useQuery } from "@tanstack/react-query";

import {
  getAchievements,
  getProfileTaskStats,
} from "@/src/services/achievement-service";

export function useAchievements(userId?: string) {
  return useQuery({
    queryKey: ["achievements", userId],
    queryFn: () => getAchievements(userId!),
    enabled: !!userId,
  });
}

export function useProfileTaskStats(userId?: string) {
  return useQuery({
    queryKey: ["profile-task-stats", userId],
    queryFn: () => getProfileTaskStats(userId!),
    enabled: !!userId,
  });
}
