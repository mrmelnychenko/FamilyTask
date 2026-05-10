import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import { cn } from "@/src/utils/cn";
import { colors } from "@/src/utils/colors";

type NavItem = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  active?: boolean;
  onPress?: () => void;
};

type Props = {
  items: NavItem[];
};

export function HomeBottomNav({ items }: Props) {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white px-4 pb-4 pt-3">
      <View className="flex-row items-center justify-around rounded-3xl bg-white">
        {items.map((item) => (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            disabled={!item.onPress}
            className={cn(
              "min-w-16 items-center gap-1 rounded-2xl px-3 py-2",
              item.active && "bg-primary-light"
            )}
          >
            <Feather
              name={item.icon}
              size={22}
              color={item.active ? colors.primary : colors.muted}
            />
            <Typo
              variant="label"
              className={item.active ? "text-primary" : "text-muted"}
            >
              {item.label}
            </Typo>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
