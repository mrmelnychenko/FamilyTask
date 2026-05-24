export type BadgeType =
  | "FIRST_TASK"
  | "ON_FIRE"
  | "EARLY_BIRD"
  | "DIAMOND"
  | "TASK_HERO";

export type Achievement = {
  id: string;
  user_id: string;
  badge_type: BadgeType;
  earned_at: string;
  metadata: Record<string, unknown>;
};

export type BadgeDefinition = {
  type: BadgeType;
  emoji: string;
  title: string;
  description: string;
  colorClassName: string;
};

export type ProfileTaskStats = {
  completed_total: number;
  completed_this_week: number;
  completed_this_month: number;
  xp_this_week: number;
  xp_this_month: number;
  early_tasks_total: number;
};
