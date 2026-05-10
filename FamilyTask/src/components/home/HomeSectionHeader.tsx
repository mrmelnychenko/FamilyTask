import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";

type Props = {
  title: string;
  icon: keyof typeof Feather.glyphMap;
  count?: number;
  onAdd?: () => void;
};

export function HomeSectionHeader({ title, icon, count, onAdd }: Props) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Feather name={icon} size={20} color="#A855F7" />
        <Typo variant="h3">{title}</Typo>
        {typeof count === "number" && (
          <View className="rounded-full bg-primary-light px-3 py-1">
            <Typo variant="label" className="text-primary">
              {count}
            </Typo>
          </View>
        )}
      </View>

      {!!onAdd && (
        <Pressable
          onPress={onAdd}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-primary"
          style={{
            shadowColor: "#A855F7",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <Feather name="plus" size={22} color="white" />
        </Pressable>
      )}
    </View>
  );
}
