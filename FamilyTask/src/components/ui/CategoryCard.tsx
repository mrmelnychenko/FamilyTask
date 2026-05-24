import { cn } from "@/src/utils/cn";
import { Pressable } from "react-native";
import { Typo } from "./Typo";

interface ICategoryCard {
    item: { key: string, label: string, icon: string },
    active: boolean,
    onPress: () => void,

}


export function CategoryCard({ item, active, onPress }: ICategoryCard) {
    return (
      <Pressable
        onPress={onPress}
        className={cn(
          "w-[31%] aspect-square rounded-2xl items-center justify-center border-2 p-3",
          active ? "bg-primary/10 border-primary" : "bg-white border-neutral-200"
        )}
      >
        <Typo className="text-2xl">{item.icon}</Typo>
  
        <Typo className={cn("text-xs text-center mt-2", active ? "text-primary" : "text-muted")}>
          {item.label}
        </Typo>
      </Pressable>
    );
  }