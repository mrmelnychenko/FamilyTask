import { View } from "react-native";
import { EditProfileAvatar } from "../ui/EditProfileAvatar";
import { Typo } from "../ui/Typo";
import { useAuth } from "@/src/hooks/useAuth";
import { useProfile } from "@/src/hooks/queries/useProfile";
import { getLevel, getLevelTitle } from "@/src/utils/level";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/src/utils/colors";
import { useCompletedTasksCount } from "@/src/hooks/queries/useTasks";
import { LevelProgress } from "../ui/LevelProgress";
import { Avatar } from "../ui/Avatar";

export function ProfileTop() {
    const { user } = useAuth()
    const { data: profile } = useProfile(user?.id)
    const { data: tasksDone = 0 } = useCompletedTasksCount(user?.id!);
    console.log(profile)
    const { level, currentXP, nextLevelXP } = getLevel(profile.xp);
    const title = getLevelTitle(level);

    return (
        <View className="flex flex-col my-6 items-center">
            <View className="flex flex-col my-6 items-center gap-1">
                <View className="p-1 rounded-full bg-primary">
                    <View className="p-1 rounded-full bg-white">
                        <Avatar size={120} name={profile.name} avatarUrl={profile.avatar_url} />
                    </View>
                </View>
                <Typo variant="h1">
                    {profile.name}
                </Typo>
                <Typo variant="body" className="text-muted">
                    {title} • Level {level}
                </Typo>
            </View>
            <View className="flex-row w-full flex-wrap gap-3">
                {/* Total XP */}
                <View className="flex-1 shadow-sm w-1/2 bg-white border-2 border-primary-light p-4 rounded-2xl items-center justify-center">
                    <MaterialIcons
                        name="bolt"
                        size={32}
                        color={colors.primary}
                    />

                    <Typo variant="h2" className="mt-2">
                        {profile.xp}
                    </Typo>

                    <Typo className="text-muted uppercase tracking-wider">
                        Total XP
                    </Typo>
                </View>

                {/* Day Streak */}
                <View className="flex-1 shadow-sm  w-1/2 bg-white border-2 border-primary-light p-4 rounded-2xl items-center justify-center">
                    <MaterialIcons
                        name="local-fire-department"
                        size={32}
                        color={colors.warning}
                    />

                    <Typo variant="h2" className="mt-2">
                        {profile.streak}
                    </Typo>

                    <Typo className="text-muted uppercase tracking-wider">
                        Day Streak
                    </Typo>
                </View>

                {/* Tasks Done */}
                <View className="w-full bg-white shadow-sm border-2 border-border p-4 rounded-2xl items-center justify-center">
                    <MaterialIcons
                        name="task-alt"
                        size={32}
                        color={colors.muted}
                    />
                    <Typo variant="h2">
                        {tasksDone}
                    </Typo>
                    <Typo className="text-muted uppercase tracking-wider">
                        Tasks Done
                    </Typo>
                </View>
            </View>
            <View className="mt-3 w-full">
                <LevelProgress level={level} currentXP={currentXP} nextLevelXP={nextLevelXP} />
            </View>
        </View>
    )
}