import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/src/utils/colors";
import { InviteCopyButton } from "./InviteCopyButton";
import { useCurrentFamily, useFamilyMembers } from "@/src/hooks/queries/useFamily";
import { useAuth } from "@/src/hooks/useAuth";
import { useFamilyInvite } from "@/src/hooks/queries/useInvite";
import { FamilyHeroCardSkeleton } from "../ui/skeleton/FamilyHeroCardSkeleton";

export function FamilyHeroCard() {
  const { user } = useAuth();

  const { data: currentFamily, isLoading } = useCurrentFamily(user?.id);
  const { data: invite, isLoading: isInviteLoading } = useFamilyInvite(
    currentFamily?.family_id
  );
  const { data: members, isLoading: isMembersLoading } = useFamilyMembers(
    currentFamily?.family_id
  );

  if (isLoading || isInviteLoading || isMembersLoading) {
    return <FamilyHeroCardSkeleton />;
  }

  return (
    <View className=" mt-4 rounded-3xl shadow-lg" style={{ shadowColor: colors.primary }}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl overflow-hidden"
      >
        {/* DECORATIONS */}
        <View className="absolute -right-16 -top-20 h-[220px] w-[220px] rounded-full bg-white opacity-10" />
        <View className="absolute -bottom-14 -left-10 h-[140px] w-[140px] rounded-full bg-white opacity-5" />

        <View className="p-5">
          {/* TOP */}
          <View className="mb-5 flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Typo
                variant="label"
                className="mb-1 text-primary-light opacity-80"
              >
                Family Space
              </Typo>

              <Typo variant="h2" className="text-white">
                {currentFamily?.families?.name}
              </Typo>
            </View>

            <View className="h-14 w-14 items-center justify-center rounded-3xl border border-primary-light bg-white/15">
              <MaterialCommunityIcons
                name="account-group"
                size={28}
                color={colors.white}
              />
            </View>
          </View>

          {/* DIVIDER */}
          <View className="mb-5 h-[1px] bg-primary-light opacity-20" />

          {/* BOTTOM */}
          <View className="flex-row items-center justify-between">
            {/* MEMBERS */}
            <View className="flex-row items-center">
              <View className="mr-2 h-7 w-7 items-center justify-center rounded-full bg-white/10">
                <Feather name="users" size={14} color={colors.white} />
              </View>

              <Typo variant="body" className="text-primary-light opacity-90">
                {members?.length ?? 0} member{members?.length === 1 ? '' : 's'}
              </Typo>
            </View>

            {/* INVITE CODE */}
            {invite?.invite_code ? (
              <InviteCopyButton inviteCode={invite.invite_code} />
            ) : null}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}