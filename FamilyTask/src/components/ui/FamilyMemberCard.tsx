import { View } from "react-native";
import { Avatar } from "./Avatar";
import { Typo } from "./Typo";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/src/utils/colors";
import { FamilyMember } from "@/src/services/family-service";
import { getLevel } from "@/src/utils/level";

interface IFamilyMemberCard {
    member: FamilyMember
    rank: number
}

export function FamilyMemberCard({ member, rank }: IFamilyMemberCard) {

    return (
        <View className="flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-border">

            <View className="flex-row gap-2">
                <View className="w-4 justify-center items-center mr-1">
                    <Typo className="text-base font-black text-muted/80">
                        #{rank}
                    </Typo>
                </View>
                {/* AVATAR + LEVEL */}
                <View className="relative items-center justify-center">

                    <Avatar
                        avatarUrl={member.profiles?.avatar_url}
                        name={member.profiles?.name}
                    />

                    {/* LEVEL BADGE */}
                    <View className="absolute -bottom-1 right-0 left-0 items-center">
                        <View className="bg-primary px-2 py-0.5 rounded-full border border-white">
                            <Typo className="text-[10px] text-white font-bold">
                                LVL {getLevel(member.profiles?.xp ?? 0).level}
                            </Typo>
                        </View>
                    </View>

                </View>
            </View>

            {/* INFO */}
            <View className="flex-1">
                <Typo className="text-text font-bold text-base">
                    {member?.profiles?.name}
                </Typo>

                <View className="flex-row items-center gap-2 mt-1">
                    <MaterialIcons
                        name="local-fire-department"
                        size={16}
                        color={colors.gold}
                    />

                    <Typo className="text-muted text-sm font-semibold">
                        {member?.profiles?.streak} Day Streak
                    </Typo>
                </View>
            </View>

            {/* XP TODAY */}
            <View className="items-end">
                <Typo className="text-[10px] text-muted uppercase tracking-wider">
                    XP total
                </Typo>

                <Typo className="text-primary font-bold text-lg">
                    +{member?.profiles?.xp}
                </Typo>
            </View>

        </View>
    );
}