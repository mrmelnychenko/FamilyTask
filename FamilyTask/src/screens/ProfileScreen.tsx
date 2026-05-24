import { Feather } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Avatar } from "@/src/components/ui/Avatar";
import { BadgeGrid } from "@/src/components/profile/BadgeGrid";
import { Button } from "@/src/components/ui/Button";
import { LoadingScreen } from "@/src/components/ui/LoadingScreen";
import { ProfileProgressCard } from "@/src/components/profile/ProfileProgressCard";
import { ProfileStatCard } from "@/src/components/profile/ProfileStatCard";
import { Typo } from "@/src/components/ui/Typo";
import {
  useAchievements,
  useProfileTaskStats,
} from "@/src/hooks/queries/useAchievements";
import { useProfile } from "@/src/hooks/queries/useProfile";
import { useAuth } from "@/src/hooks/useAuth";
import { colors } from "@/src/utils/colors";

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading, isError } = useProfile(user?.id);
  const {
    data: achievements = [],
    isLoading: isAchievementsLoading,
    isError: isAchievementsError,
  } = useAchievements(user?.id);
  const { data: stats } = useProfileTaskStats(user?.id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const totalXp = profile?.xp ?? 0;
  const streak = profile?.streak ?? 0;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
    >
      <View className="gap-5">
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="items-center rounded-3xl bg-white p-6"
        >
          <Avatar
            name={profile?.name ?? user?.email}
            avatarUrl={profile?.avatar_url}
            size={88}
          />

          <Typo variant="h2" className="mt-4 text-center text-text">
            {profile?.name ?? "Профіль"}
          </Typo>
          <Typo className="mt-1 text-center text-muted">
            {profile?.email ?? user?.email}
          </Typo>

          <View className="mt-5 w-full flex-row gap-3">
            <ProfileStatCard
              label="Усього XP"
              value={totalXp}
              icon="zap"
              tone="primary"
            />
            <ProfileStatCard
              label="Серія днів"
              value={streak}
              icon="trending-up"
              tone="warning"
            />
          </View>
        </Animated.View>

        {isError ? (
          <View className="rounded-3xl border border-danger bg-danger-bg p-4">
            <Typo className="text-danger">
              Не вдалося завантажити профіль.
            </Typo>
          </View>
        ) : null}

        <ProfileProgressCard xp={totalXp} />

        <View className="gap-3">
          <Typo variant="h3" className="text-text">
            Статистика
          </Typo>

          <View className="flex-row gap-3">
            <ProfileStatCard
              label="Виконано всього"
              value={stats?.completed_total ?? 0}
              icon="check-circle"
              tone="success"
            />
            <ProfileStatCard
              label="Цього тижня"
              value={stats?.completed_this_week ?? 0}
              icon="calendar"
              tone="gold"
            />
          </View>

          <View className="flex-row gap-3">
            <ProfileStatCard
              label="XP за тиждень"
              value={stats?.xp_this_week ?? 0}
              icon="award"
              tone="primary"
            />
            <ProfileStatCard
              label="Ранні задачі"
              value={stats?.early_tasks_total ?? 0}
              icon="sunrise"
              tone="warning"
            />
          </View>
        </View>

        <BadgeGrid
          achievements={achievements}
          isLoading={isAchievementsLoading}
          isError={isAchievementsError}
        />

        <View className="rounded-3xl bg-white p-5">
          <View className="flex-row items-center gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-light">
              <Feather name="settings" size={20} color={colors.primary} />
            </View>
            <View className="flex-1">
              <Typo variant="h3" className="text-text">
                Налаштування профілю
              </Typo>
              <Typo className="mt-1 text-muted">
                Редагування профілю додамо окремим кроком.
              </Typo>
            </View>
          </View>
        </View>

        <Button variant="danger" onPress={signOut}>
          <Feather name="log-out" size={18} color={colors.white} />
          <Typo variant="h3" className="text-white">
            Вийти
          </Typo>
        </Button>
      </View>
    </ScrollView>
  );
}
