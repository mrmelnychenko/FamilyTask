import { colors } from "@/src/utils/colors";
import { Entypo } from "@expo/vector-icons";
import { FlatList, View } from "react-native";
import { Typo } from "./Typo";
import { useAuth } from "@/src/hooks/useAuth";
import { useCurrentFamily, useFamilyMembers } from "@/src/hooks/queries/useFamily";
import { FamilyMemberCard } from "./FamilyMemberCard";
import { useMemo } from "react";

export function SquadMembers() {
    const { user } = useAuth()
    const { data: currentFamily } = useCurrentFamily(user?.id)
    const { data: members } = useFamilyMembers(currentFamily?.family_id)

    const sortedMembers = useMemo(() => {
        return [...(members ?? [])].sort(
          (a, b) => (b.profiles?.xp ?? 0) - (a.profiles?.xp ?? 0)
        );
      }, [members]);
    console.log(members)
    return (
        <View className="flex-col gap-3 mt-6">
            <View className="flex-row gap-3">
                <Entypo name="users" size={24} color={colors.primary} />
                <Typo variant="h3" className="color-black">
                    Squad Members
                </Typo>
            </View>
            <FlatList
                data={sortedMembers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 16, gap: 12 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <FamilyMemberCard member={item} rank={index + 1} />
                )}
            />

        </View>
    )
}