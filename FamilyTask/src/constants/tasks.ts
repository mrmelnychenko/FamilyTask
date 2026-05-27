

export const RECURRENCE_OPTIONS = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
] as const;



export const TASK_CATEGORIES = [
  { key: "cleaning", label: "Cleaning", icon: "cleaning-services" },
  { key: "cooking", label: "Cooking", icon: "restaurant" },
  { key: "shopping", label: "Shopping", icon: "shopping-cart" },
  { key: "education", label: "Education", icon: "book" },
  { key: "health", label: "Health", icon: "favorite" },
  { key: "finance", label: "Finance", icon: "attach-money" },
  { key: "other", label: "Other", icon: "category" },
] as const;
export const TASK_PRIORITIES = [
  { key: "low", label: "Low", color: "#22c55e", emoji: "🟢" },
  { key: "normal", label: "Normal", color: "#facc15", emoji: "🟡" },
  { key: "high", label: "High", color: "#ef4444", emoji: "🔴" },
] as const;

