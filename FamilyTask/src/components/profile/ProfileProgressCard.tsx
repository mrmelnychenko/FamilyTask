import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

import { Typo } from "@/src/components/ui/Typo";

type Props = {
  xp: number;
};

const NEXT_REWARD_XP = 500;

export function ProfileProgressCard({ xp }: Props) {
  const progress = Math.min(xp / NEXT_REWARD_XP, 1);
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 650 });
  }, [animatedProgress, progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  return (
    <View className="rounded-3xl border border-primary bg-primary-light p-5">
      <View className="flex-row items-center justify-between">
        <View>
          <Typo variant="h3" className="text-text">
            Прогрес до Diamond
          </Typo>
          <Typo className="mt-1 text-muted">{xp} / {NEXT_REWARD_XP} XP</Typo>
        </View>

        <Typo variant="h2" className="text-primary">
          💎
        </Typo>
      </View>

      <View className="mt-4 h-3 overflow-hidden rounded-full bg-white">
        <Animated.View className="h-full rounded-full bg-primary" style={progressStyle} />
      </View>
    </View>
  );
}
