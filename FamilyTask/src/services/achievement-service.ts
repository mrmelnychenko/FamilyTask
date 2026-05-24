import { supabase } from "@/src/lib/supabase";
import { BADGE_DEFINITIONS } from "@/src/constants/achievements";
import type {
  Achievement,
  BadgeType,
  ProfileTaskStats,
} from "@/src/types/achievement";

const EMPTY_STATS: ProfileTaskStats = {
  completed_total: 0,
  completed_this_week: 0,
  completed_this_month: 0,
  xp_this_week: 0,
  xp_this_month: 0,
  early_tasks_total: 0,
};

type ProfileAchievementStats = {
  xp: number | null;
  streak: number | null;
};

function normalizeStats(stats?: Partial<ProfileTaskStats> | null) {
  return {
    ...EMPTY_STATS,
    ...stats,
  };
}

async function getProfileAchievementStats(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("xp, streak")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data as ProfileAchievementStats;
}

function getEligibleBadges({
  profile,
  stats,
  earnedTypes,
}: {
  profile: ProfileAchievementStats;
  stats: ProfileTaskStats;
  earnedTypes: Set<BadgeType>;
}) {
  const badges: BadgeType[] = [];

  if (stats.completed_total >= 1) badges.push("FIRST_TASK");
  if ((profile.streak ?? 0) >= 7) badges.push("ON_FIRE");
  if (stats.early_tasks_total >= 10) badges.push("EARLY_BIRD");
  if ((profile.xp ?? 0) >= 500) badges.push("DIAMOND");
  if (stats.completed_total >= 50) badges.push("TASK_HERO");

  return badges.filter((badge) => !earnedTypes.has(badge));
}

export async function getAchievements(userId: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as Achievement[];
}

export async function getProfileTaskStats(
  userId: string
): Promise<ProfileTaskStats> {
  const { data, error } = await supabase.rpc("get_profile_task_stats", {
    p_user_id: userId,
  });

  if (error) throw error;

  return normalizeStats(data?.[0]);
}

export async function checkAndUnlockAchievements(userId: string) {
  const [profile, stats, achievements] = await Promise.all([
    getProfileAchievementStats(userId),
    getProfileTaskStats(userId),
    getAchievements(userId),
  ]);

  const earnedTypes = new Set(
    achievements.map((achievement) => achievement.badge_type)
  );
  const eligibleBadges = getEligibleBadges({ profile, stats, earnedTypes });

  if (eligibleBadges.length === 0) {
    return [];
  }

  const rows = eligibleBadges.map((badgeType) => ({
    user_id: userId,
    badge_type: badgeType,
    metadata: {
      xp: profile.xp ?? 0,
      streak: profile.streak ?? 0,
      completed_total: stats.completed_total,
    },
  }));

  const { data, error } = await supabase
    .from("achievements")
    .upsert(rows, { onConflict: "user_id,badge_type", ignoreDuplicates: true })
    .select("*");

  if (error) throw error;

  return (data ?? []) as Achievement[];
}

export function getLockedAchievements(achievements: Achievement[]) {
  const earnedTypes = new Set(
    achievements.map((achievement) => achievement.badge_type)
  );

  return BADGE_DEFINITIONS.filter((badge) => !earnedTypes.has(badge.type));
}
