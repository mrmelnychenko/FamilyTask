import { Pressable, View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import type { TaskPriority } from "@/src/schemas/task.schema";
import { cn } from "@/src/utils/cn";

type PriorityOption = {
  value: TaskPriority;
  label: string;
  className: string;
};

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: "low", label: "Низький", className: "bg-success-bg border-success" },
  {
    value: "medium",
    label: "Середній",
    className: "bg-primary-light border-primary",
  },
  { value: "high", label: "Високий", className: "bg-warning-bg border-warning" },
];

type Props = {
  value: TaskPriority;
  onChange: (value: TaskPriority) => void;
};

export function PrioritySelector({ value, onChange }: Props) {
  return (
    <View className="rounded-2xl bg-white p-4 border border-border gap-3">
      <Typo variant="label" className="uppercase text-muted">
        Пріоритет
      </Typo>

      <View className="flex-row gap-2">
        {PRIORITY_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={cn(
              "flex-1 rounded-2xl border px-3 py-3 items-center",
              value === option.value ? option.className : "border-border bg-white"
            )}
          >
            <Typo variant="h3" className="text-text">
              {option.label}
            </Typo>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
