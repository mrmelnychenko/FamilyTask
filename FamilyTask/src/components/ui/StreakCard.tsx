import { colors } from "@/src/utils/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Typo } from "./Typo";
import { cn } from "@/src/utils/cn";

interface IStreakCardProps {
    streak: number;
}

export function StreakCard({ streak }: IStreakCardProps) {
    const hasStreak = streak > 0;

    return (
        <View
            className={cn(
                "flex-1 rounded-[24px] p-5 items-center justify-center border transition-all duration-300",
                hasStreak
                    ? "bg-streak-bg border-warning/10"
                    : "bg-white border-border"
            )}
        >
            {/* ICON */}
            <View
                className={cn(
                    "w-14 h-14 rounded-2xl items-center justify-center mb-3 transition-all duration-300",
                    hasStreak
                        ? "bg-warning-bg scale-105 border border-border"
                        : "bg-background"
                )}
            >
                <MaterialCommunityIcons
                    name={hasStreak ? "fire" : "fire-off"}
                    size={hasStreak ? 32 : 26}
                    color={hasStreak ? colors.streak : colors.light}
                />
            </View>

            {hasStreak ? (
                <View className="items-center">
                    {/* NUMBER */}
                    <Typo
                        variant="h1"
                        className="text-[32px] font-black tracking-tight text-text"
                        style={{ lineHeight: 36 }}
                    >
                        {streak}
                    </Typo>

                    {/* LABEL */}
                    <Typo
                        variant="label"
                        className="mt-1 text-[11px] font-bold uppercase tracking-[2px] text-streak"
                    >
                        Day Streak
                    </Typo>
                </View>
            ) : (
                <View className="items-center px-2">
                    <Typo
                        variant="body"
                        className="text-[14px] font-semibold text-text"
                    >
                        No streak yet
                    </Typo>

                    <Typo
                        variant="body"
                        className="mt-1 text-center text-[12px] leading-5 text-muted"
                    >
                        Complete your first task to start your streak
                    </Typo>
                </View>
            )}
        </View>
    );
}