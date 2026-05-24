import type { BadgeDefinition, BadgeType } from "@/src/types/achievement";

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    type: "FIRST_TASK",
    emoji: "🎯",
    title: "Перший крок",
    description: "Виконати першу задачу",
    colorClassName: "bg-primary-light border-primary",
  },
  {
    type: "ON_FIRE",
    emoji: "🔥",
    title: "On Fire",
    description: "Тримати серію 7 днів",
    colorClassName: "bg-warning-bg border-warning",
  },
  {
    type: "EARLY_BIRD",
    emoji: "⚡",
    title: "Early Bird",
    description: "Виконати 10 задач до 09:00",
    colorClassName: "bg-gold-bg border-gold",
  },
  {
    type: "DIAMOND",
    emoji: "💎",
    title: "Diamond",
    description: "Зібрати 500 XP",
    colorClassName: "bg-primary-light border-primary",
  },
  {
    type: "TASK_HERO",
    emoji: "👑",
    title: "Task Hero",
    description: "Виконати 50 задач",
    colorClassName: "bg-success-bg border-success",
  },
];

export const BADGE_BY_TYPE = BADGE_DEFINITIONS.reduce<
  Record<BadgeType, BadgeDefinition>
>((acc, badge) => {
  acc[badge.type] = badge;
  return acc;
}, {} as Record<BadgeType, BadgeDefinition>);
