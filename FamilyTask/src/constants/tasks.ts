export const RECURRENCE_OPTIONS = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
] as const;
export const TASK_CATEGORIES = [
  { key: "cleaning", label: "Cleaning", emoji: "🧹" },
  { key: "cooking", label: "Cooking", emoji: "🍳" },
  { key: "shopping", label: "Shopping", emoji: "🛒" },
  { key: "education", label: "Education", emoji: "📚" },
  { key: "health", label: "Health", emoji: "💊" },
  { key: "finance", label: "Finance", emoji: "💰" },
  { key: "other", label: "Other", emoji: "📌" },
] as const;
export const TASK_PRIORITIES = [
  { key: "low", label: "Low", color: "#22c55e", emoji: "🟢" },
  { key: "normal", label: "Normal", color: "#facc15", emoji: "🟡" },
  { key: "high", label: "High", color: "#ef4444", emoji: "🔴" },
] as const;