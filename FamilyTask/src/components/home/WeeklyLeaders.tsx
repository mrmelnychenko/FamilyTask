import { View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import type {
  FamilyMember,
  FamilyMemberProfile,
} from "@/src/services/family-service";

type Props = {
  members: FamilyMember[];
};

function getProfile(member: FamilyMember): FamilyMemberProfile | null {
  if (Array.isArray(member.profiles)) {
    return member.profiles[0] ?? null;
  }

  return member.profiles;
}

export function WeeklyLeaders({ members }: Props) {
  const leaders = members
    .map(getProfile)
    .filter((profile): profile is FamilyMemberProfile => !!profile)
    .sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0))
    .slice(0, 3);

  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <Typo variant="h3">🏆</Typo>
        <Typo variant="h3">Лідери тижня</Typo>
      </View>

      <View className="rounded-3xl border border-border bg-white p-4">
        {leaders.length === 0 ? (
          <Typo className="text-muted">Лідери зʼявляться після перших задач.</Typo>
        ) : (
          <View className="gap-3">
            {leaders.map((leader, index) => (
              <View
                key={leader.id}
                className="flex-row items-center gap-3 rounded-2xl bg-background p-3"
              >
                <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-light">
                  <Typo variant="h3">{index + 1}</Typo>
                </View>
                <Typo variant="h3">{leader.avatar_emoji || "😊"}</Typo>
                <View className="flex-1">
                  <Typo variant="h3">{leader.name || "Без імені"}</Typo>
                  <Typo variant="label" className="text-muted">
                    streak {leader.streak ?? 0}
                  </Typo>
                </View>
                <View className="rounded-full bg-gold-bg px-3 py-1">
                  <Typo variant="points" className="text-gold">
                    {leader.xp ?? 0} XP
                  </Typo>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
