import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";

import { FamilyLeaderboard } from "@/src/components/family/FamilyLeaderboard";
import { InviteCopyButton } from "@/src/components/home/InviteCopyButton";
import { Avatar } from "@/src/components/ui/Avatar";
import { LoadingScreen } from "@/src/components/ui/LoadingScreen";
import { Typo } from "@/src/components/ui/Typo";
import {
  useCurrentFamily,
  useFamilyLeaderboard,
  useFamilyMembers,
} from "@/src/hooks/queries/useFamily";
import { useFamilyInvite } from "@/src/hooks/queries/useInvite";
import { useAuth } from "@/src/hooks/useAuth";
import type { FamilyMember } from "@/src/services/family-service";
import { cn } from "@/src/utils/cn";
import { colors } from "@/src/utils/colors";

function getRoleLabel(role?: string | null) {
  if (role === "OWNER") return "Власник";
  if (role === "ADMIN") return "Адмін";
  return "Учасник";
}

function MemberCard({ member }: { member: FamilyMember }) {
  const profile = member.profiles;
  const name = profile?.name ?? "Без імені";
  const role = getRoleLabel(member.role);

  return (
    <View className="flex-row items-center rounded-3xl border border-border bg-white p-4">
      <Avatar name={name} avatarUrl={profile?.avatar_url} size={52} />

      <View className="ml-3 flex-1">
        <View className="flex-row items-center gap-2">
          <Typo variant="h3" className="text-text">
            {name}
          </Typo>
          <View
            className={cn(
              "rounded-full px-2 py-1",
              member.role === "OWNER" ? "bg-gold-bg" : "bg-primary-light"
            )}
          >
            <Typo
              variant="label"
              className={cn(
                member.role === "OWNER" ? "text-gold" : "text-primary"
              )}
            >
              {role}
            </Typo>
          </View>
        </View>

        <Typo className="mt-1 text-muted">
          {profile?.xp ?? 0} XP · серія {profile?.streak ?? 0} дн.
        </Typo>
      </View>
    </View>
  );
}

export function FamilyScreen() {
  const { user } = useAuth();
  const {
    data: currentFamily,
    isLoading: isFamilyLoading,
    isError: isFamilyError,
  } = useCurrentFamily(user?.id);

  const familyId = currentFamily?.family_id;
  const {
    data: members = [],
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useFamilyMembers(familyId);
  const { data: invite } = useFamilyInvite(familyId);
  const {
    data: leaderboard = [],
    isLoading: isLeaderboardLoading,
    isError: isLeaderboardError,
  } = useFamilyLeaderboard(familyId, "week");

  if (isFamilyLoading || isMembersLoading) {
    return <LoadingScreen />;
  }

  const hasError = isFamilyError || isMembersError;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
    >
      <View className="gap-5">
        <View className="rounded-3xl bg-white p-5">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Typo variant="label" className="text-muted">
                Сімейний простір
              </Typo>
              <Typo variant="h2" className="mt-1 text-text">
                {currentFamily?.families?.name ?? "Моя сімʼя"}
              </Typo>
              <Typo className="mt-1 text-muted">
                {members.length} учасник(ів)
              </Typo>
            </View>

            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
              <Feather name="users" size={22} color={colors.primary} />
            </View>
          </View>

          <View className="mt-5 rounded-3xl bg-primary p-4">
            <Typo variant="label" className="text-primary-light">
              Код запрошення
            </Typo>

            <View className="mt-3 flex-row items-center justify-between gap-3">
              <Typo variant="h2" className="flex-1 text-white">
                {invite?.invite_code ?? "Немає коду"}
              </Typo>

              {invite?.invite_code ? (
                <InviteCopyButton inviteCode={invite.invite_code} />
              ) : null}
            </View>

            <Typo className="mt-3 text-primary-light">
              Надішли цей код людині, яка має приєднатися до сімʼї.
            </Typo>
          </View>
        </View>

        {hasError ? (
          <View className="rounded-3xl border border-danger bg-danger-bg p-4">
            <Typo className="text-danger">
              Не вдалося завантажити дані сімʼї. Спробуйте ще раз.
            </Typo>
          </View>
        ) : null}

        <FamilyLeaderboard
          members={leaderboard}
          isLoading={isLeaderboardLoading}
          isError={isLeaderboardError}
        />

        <View>
          <Typo variant="h3" className="mb-3 text-text">
            Учасники сімʼї
          </Typo>

          {members.length === 0 ? (
            <View className="rounded-3xl border border-border bg-white p-5">
              <Typo className="text-muted">
                У сімʼї поки немає учасників.
              </Typo>
            </View>
          ) : (
            <View className="gap-3">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
