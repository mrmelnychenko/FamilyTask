import { colors } from "@/src/utils/colors";
import { Pressable, View } from "react-native";
import { Typo } from "./Typo";
import { Avatar } from "./Avatar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCurrentFamily, useFamilyLeaderboard } from "@/src/hooks/queries/useFamily";
import { useAuth } from "@/src/hooks/useAuth";
import { LoadingScreen } from "./LoadingScreen";
import { useState } from "react";
import { cn } from "@/src/utils/cn";

type PeriodType = "week" | "month" | "all";
const tabs: { key: PeriodType; label: string }[] = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "all", label: "All Time" },
];

export function TableHeroes() {
  const { user } = useAuth()
  const [period, setPeriod] = useState<PeriodType>("week");
  const { data: myFamily } = useCurrentFamily(user?.id)
  const { data: leaderboard } = useFamilyLeaderboard(myFamily?.family_id, period)
  
  if(!leaderboard) return <LoadingScreen />
  
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.xp - a.xp);
  const [firstPlace, secondPlace, thirdPlace] = sortedLeaderboard;

  return (
    <View className="w-full rounded-[28px] border border-border p-5 bg-white shadow-sm">
      {/* HEADER */}
      <View className="flex-row bg-[#F1F5F9] p-1 rounded-full w-full max-w-[320px] mb-6">
        {tabs.map((tab) => {
          const isActive = period === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setPeriod(tab.key)}
              className={cn(
                "flex-1 py-2 items-center justify-center rounded-full transition-all duration-200 active:scale-95",
                isActive ? "bg-white shadow-sm" : "bg-transparent"
              )}
            >
              <Typo
                className={cn(
                  "text-[12px] font-bold tracking-tight",
                  isActive ? "text-text" : "text-muted"
                )}
              >
                {tab.label}
              </Typo>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row items-end justify-between w-full h-[210px] px-1">

        {/* SECOND PLACE (LEFT) */}
        <View className="items-center w-[30%]">
          <View className="mb-2">
            <Avatar name={secondPlace?.name} />
          </View>
          <View className="w-full rounded-t-[20px] items-center justify-end pb-3 bg-background h-[80px]">
            <Typo className="text-[15px] font-black text-text" numberOfLines={1}>
              2nd
            </Typo>
            <Typo className="text-[11px] mt-0.5 text-muted font-medium" numberOfLines={1}>
              {secondPlace ? `${secondPlace.xp} XP` : "0 XP"}
            </Typo>
          </View>
        </View>

        {/* FIRST PLACE (CENTER) */}
        <View className="items-center w-[35%] relative mx-1">
          {/* CROWN */}
          {firstPlace && (
            <View className="absolute -top-8 z-10">
              <MaterialCommunityIcons name="crown" size={38} color={colors.gold} />
            </View>
          )}

          {/* AVATAR WITH AMBIENT GLOW */}
          <View className="mb-2 relative">
            {firstPlace && (
              <View className="absolute inset-0 rounded-full bg-primary opacity-20 scale-[1.2] blur-sm" />
            )}
            <Avatar name={firstPlace?.name} />
          </View>

          {/* PODIUM */}
          <View className="w-full rounded-t-[24px] items-center justify-end pb-4 border-t border-x bg-primary-light border-primary h-[115px]">
            <Typo className="text-[18px] font-black text-primary-dark" numberOfLines={1}>
              1st
            </Typo>
            <Typo className="text-[12px] font-bold mt-0.5 text-primary-dark" numberOfLines={1}>
              {firstPlace ? `${firstPlace.xp} XP` : "0 XP"}
            </Typo>
          </View>
        </View>

        {/* THIRD PLACE (RIGHT) */}
        <View className="items-center w-[30%]">
          <View className="mb-2">
            <Avatar name={thirdPlace?.name} />
          </View>
          <View className="w-full rounded-t-[20px] items-center justify-end pb-3 bg-background h-[60px]">
            <Typo className="text-[15px] font-black text-text" numberOfLines={1}>
              3rd
            </Typo>
            <Typo className="text-[11px] mt-0.5 text-muted font-medium" numberOfLines={1}>
              {thirdPlace ? `${thirdPlace.xp} XP` : "0 XP"}
            </Typo>
          </View>
        </View>

      </View>
    </View>
  );
}