import { View } from "react-native";

import { Avatar } from "@/src/components/ui/Avatar";
import { Typo } from "@/src/components/ui/Typo";
import { cn } from "@/src/utils/cn";

type LeaderboardMember = {
  id?: string;
  user_id?: string;
  name?: string | null;
  avatar_url?: string | null;
  xp?: number | null;
  streak?: number | null;
};

type Props = {
  members?: LeaderboardMember[];
  isLoading?: boolean;
  isError?: boolean;
};

function getPlaceLabel(index: number) {
  if (index === 0) return "1";
  if (index === 1) return "2";
  if (index === 2) return "3";
  return `${index + 1}`;
}

export function FamilyLeaderboard({
  members = [],
  isLoading = false,
  isError = false,
}: Props) {
  if (isLoading) {
    return (
      <View className="rounded-3xl border border-border bg-white p-5">
        <Typo variant="h3" className="text-text">
          Завантажуємо рейтинг...
        </Typo>
        <Typo className="mt-1 text-muted">
          Рахуємо XP учасників сімʼї.
        </Typo>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="rounded-3xl border border-danger bg-danger-bg p-5">
        <Typo variant="h3" className="text-danger">
          Не вдалося завантажити рейтинг
        </Typo>
        <Typo className="mt-1 text-muted">
          Спробуйте відкрити екран ще раз трохи пізніше.
        </Typo>
      </View>
    );
  }

  if (members.length === 0) {
    return (
      <View className="rounded-3xl border border-border bg-white p-5">
        <Typo variant="h3" className="text-text">
          Рейтинг поки порожній
        </Typo>
        <Typo className="mt-1 text-muted">
          Виконайте першу задачу, щоб побачити XP тут.
        </Typo>
      </View>
    );
  }

  return (
    <View className="rounded-3xl border border-border bg-white p-5">
      <Typo variant="h3" className="mb-3 text-text">
        Лідери тижня
      </Typo>

      <View className="gap-3">
        {members.slice(0, 5).map((member, index) => (
          <View
            key={member.user_id ?? member.id ?? `${member.name}-${index}`}
            className="flex-row items-center"
          >
            <View
              className={cn(
                "mr-3 h-8 w-8 items-center justify-center rounded-full",
                index === 0 ? "bg-gold-bg" : "bg-primary-light"
              )}
            >
              <Typo
                variant="label"
                className={cn(index === 0 ? "text-gold" : "text-primary")}
              >
                {getPlaceLabel(index)}
              </Typo>
            </View>

            <Avatar
              name={member.name ?? "?"}
              avatarUrl={member.avatar_url}
              size={42}
            />

            <View className="ml-3 flex-1">
              <Typo variant="h3" className="text-text" numberOfLines={1}>
                {member.name ?? "Учасник"}
              </Typo>
              <Typo className="mt-0.5 text-muted">
                Серія {member.streak ?? 0} дн.
              </Typo>
            </View>

            <View className="rounded-full bg-primary-light px-3 py-1">
              <Typo variant="label" className="text-primary">
                {member.xp ?? 0} XP
              </Typo>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
