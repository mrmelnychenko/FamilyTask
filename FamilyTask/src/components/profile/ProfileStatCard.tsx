import { Feather } from "@expo/vector-icons";
import { View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import { colors } from "@/src/utils/colors";

type Props = {
  label: string;
  value: string | number;
  icon: keyof typeof Feather.glyphMap;
  tone?: "primary" | "success" | "warning" | "gold";
};

const toneClassName = {
  primary: "bg-primary-light",
  success: "bg-success-bg",
  warning: "bg-warning-bg",
  gold: "bg-gold-bg",
};

const toneColor = {
  primary: colors.primary,
  success: colors.success,
  warning: colors.warning,
  gold: colors.gold,
};

export function ProfileStatCard({
  label,
  value,
  icon,
  tone = "primary",
}: Props) {
  return (
    <View className="flex-1 rounded-3xl border border-border bg-white p-4">
      <View
        className={`mb-3 h-10 w-10 items-center justify-center rounded-2xl ${toneClassName[tone]}`}
      >
        <Feather name={icon} size={18} color={toneColor[tone]} />
      </View>

      <Typo variant="h2" className="text-text">
        {value}
      </Typo>
      <Typo variant="label" className="mt-1 text-muted">
        {label}
      </Typo>
    </View>
  );
}
