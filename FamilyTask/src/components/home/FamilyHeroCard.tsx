import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import type { FamilyMemberProfile } from "@/src/services/family-service";

type Props = {
  familyName: string;
  inviteCode?: string | null;
  memberCount: number;
  profile: FamilyMemberProfile | null;
  rank: number;
  onOpenFamily?: () => void;
};

function getLevel(xp: number) {
  return Math.floor(xp / 250) + 1;
}

function getProgress(xp: number) {
  return Math.min(100, Math.round(((xp % 250) / 250) * 100));
}

export function FamilyHeroCard({
  familyName,
  inviteCode,
  memberCount,
  profile,
  rank,
  onOpenFamily,
}: Props) {
  const xp = profile?.xp ?? 0;
  const streak = profile?.streak ?? 0;
  const level = getLevel(xp);
  const progress = getProgress(xp);

  return (
    <Pressable
      onPress={onOpenFamily}
      className="rounded-b-[28px] bg-primary px-5 pb-5 pt-4"
      style={{
        shadowColor: "#7C3AED",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
            <Typo variant="h2">🏠</Typo>
          </View>

          <View>
            <Typo variant="h3" className="text-white">
              {familyName}
            </Typo>
            <Typo variant="label" className="text-white/80">
              {memberCount} учасники
            </Typo>
          </View>
        </View>

        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
          <Feather name="settings" size={20} color="white" />
        </View>
      </View>

      <View className="mt-4 rounded-2xl bg-white/15 p-3">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Typo variant="label" className="text-white/80">
              Код запрошення
            </Typo>
            <Typo variant="h2" className="text-white">
              {inviteCode || "Немає коду"}
            </Typo>
          </View>
          <View className="h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
            <Feather name="copy" size={18} color="white" />
          </View>
        </View>
        <Typo variant="label" className="mt-1 text-white/70">
          Передайте цей код, щоб інший акаунт приєднався до сімʼї.
        </Typo>
      </View>

      <View className="mt-5 rounded-3xl bg-white p-4">
        <View className="flex-row items-center gap-3">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-light">
            <Typo variant="h2">{profile?.avatar_emoji || "👧"}</Typo>
          </View>

          <View className="flex-1">
            <Typo variant="h3">{profile?.name || "Учасник сімʼї"}</Typo>
            <Typo variant="label" className="text-muted">
              Рівень {level}
            </Typo>
          </View>

          <Stat label="XP" value={`⭐ ${xp}`} />
          <Stat label="днів" value={`🔥 ${streak}`} />
          <Stat label="місце" value={`#${rank}`} />
        </View>

        <View className="mt-4">
          <View className="mb-2 flex-row justify-between">
            <Typo variant="label" className="text-muted">
              До рівня {level + 1}
            </Typo>
            <Typo variant="label" className="text-primary">
              {250 - (xp % 250)} XP
            </Typo>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-border">
            <View
              className="h-full rounded-full bg-pink"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
      </View>

      <View className="mt-3 flex-row justify-center gap-2">
        {[0, 1, 2].map((item) => (
          <View
            key={item}
            className={
              item === 0
                ? "h-1 w-7 rounded-full bg-white/80"
                : "h-1 w-7 rounded-full bg-white/25"
            }
          />
        ))}
      </View>
    </Pressable>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="items-center">
      <Typo variant="h3" className="text-text">
        {value}
      </Typo>
      <Typo variant="label" className="text-muted">
        {label}
      </Typo>
    </View>
  );
}
