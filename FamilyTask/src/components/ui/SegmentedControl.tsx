import { cn } from "@/src/utils/cn";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Typo } from "./Typo";
import { ISegmentTabs } from "@/src/types/task";
import { colors } from "@/src/utils/colors";

interface ISegmentedControl {
  tabs: ISegmentTabs[];
  onChange?: (tab: ISegmentTabs) => void;
}

export function SegmentedControl({ tabs, onChange }: ISegmentedControl) {
  const [activeKey, setActiveKey] = useState<string>(tabs[0]?.key ?? "");

  const handlePress = (tab: ISegmentTabs) => {
    setActiveKey(tab.key);
    onChange?.(tab);  
  };

  return (
    <View className="flex-row bg-white p-1 rounded-full w-full mb-4">
      {tabs.map((tab) => {
        const isActive = activeKey === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => handlePress(tab)} 
            className={cn(
              "flex-1 py-2 items-center justify-center rounded-full transition-all duration-200 active:scale-95",
              isActive ? "bg-primary shadow-sm" : "bg-transparent"
            )}
          >
            <Typo
              style={{ color: isActive ? colors.white : undefined }}
              className="text-[12px] transition-all duration-200 font-bold tracking-tight"
            >
              {tab.label}
            </Typo>
          </Pressable>
        );
      })}
    </View>
  );
}