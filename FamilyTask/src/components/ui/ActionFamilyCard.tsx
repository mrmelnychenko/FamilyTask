import { Pressable, View } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/src/utils/colors";
import { cn } from "@/src/utils/cn";
import { Typo } from "./Typo";

type Props = {
  variant?: "primary" | "secondary";
  label: string;
  description: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
};

export function ActionFamilyCard({
  variant = "secondary",
  label,
  description,
  icon,
  onPress,
}: Props) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-4 rounded-3xl p-5 border",
        isPrimary
          ? "bg-primary border-primary"
          : "bg-white border-primary"
      )}
      style={({ pressed }) => ({
        opacity: pressed ? 0.92 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {/* Icon */}
      <View
        className={cn(
          "h-14 w-14 items-center justify-center rounded-2xl",
          isPrimary
            ? "bg-white/20"
            : "bg-primary-light"
        )}
      >
        <Feather
          name={icon}
          size={24}
          color={isPrimary ? "#fff" : colors.primary}
        />
      </View>

      {/* Content */}
      <View className="flex-1 gap-1">
        <Typo
          variant="h3"
          className={cn(
            isPrimary
              ? "text-white"
              : "text-main"
          )}
        >
          {label}
        </Typo>

        <Typo
          variant="body"
          className={cn(
            isPrimary
              ? "text-white/80"
              : "text-muted"
          )}
        >
          {description}
        </Typo>
      </View>

      {/* Arrow */}
      <MaterialIcons
        name="keyboard-arrow-right"
        size={24}
        color={isPrimary ? "#fff" : colors.muted}
      />
    </Pressable>
  );
}