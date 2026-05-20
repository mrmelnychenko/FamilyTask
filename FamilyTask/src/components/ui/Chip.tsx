import { cn } from "@/src/utils/cn";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Typo } from "./Typo";
import { colors } from "@/src/utils/colors";

interface IChip {
    label: string,
    active: boolean,
    onPress: () => void,
    icon?: keyof typeof MaterialIcons.glyphMap;
    color?: string,
}

export function Chip({ label, active, onPress, icon, color }: IChip) {
    return (
      <Pressable
        onPress={onPress}
        className={cn(
          "flex-row items-center gap-2 px-4 py-2 rounded-full border-2",
          active ? "bg-primary/10 border-primary" : "bg-white border-neutral-200"
        )}
      >
        {icon && <MaterialIcons name={icon} size={18} color={active ? colors.primary : colors.muted} />}
  
        {color && <View className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />}
  
        <Typo className={cn("text-sm", active ? "text-primary font-semibold" : "text-muted")}>
          {label}
        </Typo>
      </Pressable>
    );
  }