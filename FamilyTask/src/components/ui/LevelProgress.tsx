import { View } from "react-native";
import { Typo } from "./Typo";

type LevelProgressProps = {
    level: number;
    currentXP: number;
    nextLevelXP: number;
};

export function LevelProgress({
    level,
    currentXP,
    nextLevelXP,
}: LevelProgressProps) {
    const progress = (currentXP / nextLevelXP) * 100;
    const xpLeft = nextLevelXP - currentXP;

    return (
        <View className="bg-white w-full border border-border rounded-3xl p-5 shadow-sm">
            <View className="flex-row justify-between items-end mb-4">
                <View>
                    <Typo variant="h3">
                        Level {level}
                    </Typo>

                    <Typo className="text-muted mt-1">
                        {xpLeft} XP until Level {level + 1}
                    </Typo>
                </View>

                <View className="bg-primary-light px-3 py-1 rounded-full">
                    <Typo className="text-primary font-bold">
                        {Math.round(progress)}%
                    </Typo>
                </View>
            </View>

            <View className="h-4 bg-background rounded-full overflow-hidden">
                <View
                    className="h-full bg-primary rounded-full"
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </View>
        </View>
    );
}