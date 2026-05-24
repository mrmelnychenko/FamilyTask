import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { BADGE_BY_TYPE, BADGE_DEFINITIONS } from "@/src/constants/achievements";
import type { Achievement, BadgeDefinition } from "@/src/types/achievement";
import { cn } from "@/src/utils/cn";
import { Typo } from "@/src/components/ui/Typo";

type BadgeCardProps = {
  badge: BadgeDefinition;
  earnedAt?: string;
  locked?: boolean;
  index: number;
};

type Props = {
  achievements: Achievement[];
  isLoading?: boolean;
  isError?: boolean;
};

function formatEarnedDate(date?: string) {
  if (!date) return "";

  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

function BadgeCard({ badge, earnedAt, locked = false, index }: BadgeCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(260)}
      className={cn(
        "w-[48%] rounded-3xl border p-4",
        locked ? "border-border bg-white opacity-45" : badge.colorClassName
      )}
    >
      <Typo variant="h2" className="text-3xl">
        {badge.emoji}
      </Typo>
      <Typo variant="h3" className="mt-2 text-text">
        {badge.title}
      </Typo>
      <Typo className="mt-1 text-xs text-muted">{badge.description}</Typo>

      <Typo variant="label" className="mt-3 text-muted">
        {locked ? "Ще не відкрито" : `Отримано ${formatEarnedDate(earnedAt)}`}
      </Typo>
    </Animated.View>
  );
}

export function BadgeGrid({
  achievements,
  isLoading = false,
  isError = false,
}: Props) {
  if (isLoading) {
    return (
      <View className="rounded-3xl border border-border bg-white p-5">
        <Typo variant="h3" className="text-text">
          Завантажуємо бейджі...
        </Typo>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="rounded-3xl border border-danger bg-danger-bg p-5">
        <Typo variant="h3" className="text-danger">
          Не вдалося завантажити бейджі
        </Typo>
      </View>
    );
  }

  const earnedByType = new Map(
    achievements.map((achievement) => [achievement.badge_type, achievement])
  );

  return (
    <View className="gap-3">
      <Typo variant="h3" className="text-text">
        Бейджі
      </Typo>

      <View className="flex-row flex-wrap justify-between gap-y-3">
        {BADGE_DEFINITIONS.map((badge, index) => {
          const achievement = earnedByType.get(badge.type);

          return (
            <BadgeCard
              key={badge.type}
              badge={BADGE_BY_TYPE[badge.type]}
              earnedAt={achievement?.earned_at}
              locked={!achievement}
              index={index}
            />
          );
        })}
      </View>
    </View>
  );
}
