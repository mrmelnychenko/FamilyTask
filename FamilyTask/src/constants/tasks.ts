import { colors } from "../utils/colors";

export const TASK_CATEGORIES = [
  { key: "cleaning", label: "Прибирання", emoji: "🧹" },
  { key: "cooking", label: "Готування", emoji: "🍳" },
  { key: "shopping", label: "Покупки", emoji: "🛒" },
  { key: "education", label: "Навчання", emoji: "📚" },
  { key: "health", label: "Здоровʼя", emoji: "💊" },
  { key: "finance", label: "Фінанси", emoji: "💰" },
  { key: "other", label: "Інше", emoji: "📌" },
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number]["key"];

export const TASK_PRIORITIES = [
  { key: "low", label: "Низький", color: colors.muted, emoji: "🟢" },
  { key: "normal", label: "Середній", color: colors.gold, emoji: "🟡" },
  { key: "high", label: "Високий", color: colors.danger, emoji: "🔴" },
] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number]["key"];
