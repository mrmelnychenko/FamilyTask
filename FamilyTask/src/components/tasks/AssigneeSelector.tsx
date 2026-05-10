import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import type { FamilyMember } from "@/src/services/family-service";
import { cn } from "@/src/utils/cn";
import { colors } from "@/src/utils/colors";

type Props = {
  members: FamilyMember[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

function getProfile(member: FamilyMember) {
  if (Array.isArray(member.profiles)) {
    return member.profiles[0] ?? null;
  }

  return member.profiles;
}

export function AssigneeSelector({ members, value, error, onChange }: Props) {
  return (
    <View className="rounded-2xl bg-white p-4 border border-border gap-3">
      <Typo variant="label" className="uppercase text-muted">
        Виконавець
      </Typo>

      {members.length === 0 ? (
        <Typo className="text-muted">У сімʼї поки немає учасників.</Typo>
      ) : (
        <View className="gap-2">
          {members.map((member) => {
            const profile = getProfile(member);
            const active = profile?.id === value;

            if (!profile) return null;

            return (
              <Pressable
                key={member.id}
                onPress={() => onChange(profile.id)}
                className={cn(
                  "flex-row items-center gap-3 rounded-2xl border p-3",
                  active ? "border-primary bg-primary-light" : "border-border bg-white"
                )}
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                  <Typo variant="h3">{profile.avatar_emoji || "😊"}</Typo>
                </View>

                <View className="flex-1">
                  <Typo variant="h3">{profile.name || "Без імені"}</Typo>
                  <Typo variant="label" className="text-muted">
                    {profile.email || "Учасник сімʼї"}
                  </Typo>
                </View>

                {active && (
                  <Feather name="check-circle" size={20} color={colors.primary} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}

      {!!error && (
        <Typo variant="label" className="text-danger">
          {error}
        </Typo>
      )}
    </View>
  );
}
