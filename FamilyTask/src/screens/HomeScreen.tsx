import { Href, Redirect, router } from "expo-router";
import { ScrollView, View } from "react-native";

import { FamilyHeroCard } from "@/src/components/home/FamilyHeroCard";
import { HomeSectionHeader } from "@/src/components/home/HomeSectionHeader";
import { HomeTaskList } from "@/src/components/home/HomeTaskList";
import { WeeklyLeaders } from "@/src/components/home/WeeklyLeaders";
import { LoadingScreen } from "@/src/components/ui/LoadingScreen";
import { Typo } from "@/src/components/ui/Typo";
import { useCurrentFamily, useFamilyMembers } from "@/src/hooks/queries/useFamily";
import { useFamilyInvite } from "@/src/hooks/queries/useInvite";
import { useFamilyTasks } from "@/src/hooks/queries/useTasks";
import { useAuth } from "@/src/hooks/useAuth";
import type {
  FamilyMember,
  FamilyMemberProfile,
} from "@/src/services/family-service";
import type { FamilyTask } from "@/src/services/task-service";

function getFamilyName(familyMember: unknown) {
  const families = (familyMember as { families?: { name?: string } | { name?: string }[] } | null)
    ?.families;

  if (Array.isArray(families)) {
    return families[0]?.name ?? null;
  }

  return families?.name ?? null;
}

function getProfile(member: FamilyMember): FamilyMemberProfile | null {
  if (Array.isArray(member.profiles)) {
    return member.profiles[0] ?? null;
  }

  return member.profiles;
}

function getCurrentProfile(members: FamilyMember[], userId?: string) {
  return members.map(getProfile).find((profile) => profile?.id === userId) ?? null;
}

function getRank(members: FamilyMember[], userId?: string) {
  const leaders = members
    .map(getProfile)
    .filter((profile): profile is FamilyMemberProfile => !!profile)
    .sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0));

  const index = leaders.findIndex((profile) => profile.id === userId);
  return index >= 0 ? index + 1 : leaders.length + 1;
}

function isToday(deadline: string | null) {
  if (!deadline) return true;

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function isDone(task: FamilyTask) {
  return task.status === "done" || task.status === "completed";
}

export function HomeScreen() {
  const { user } = useAuth();
  const {
    data: familyMember,
    isLoading: isFamilyLoading,
  } = useCurrentFamily(user?.id);

  const familyId = familyMember?.family_id ?? null;
  const {
    data: members = [],
    isLoading: areMembersLoading,
  } = useFamilyMembers(familyId ?? undefined);
  const {
    data: tasks = [],
    isLoading: areTasksLoading,
    isError: isTasksError,
  } = useFamilyTasks(familyId);
  const { data: invite } = useFamilyInvite(familyId);

  const familyName = getFamilyName(familyMember) || "Сімʼя";
  const todayTasks = tasks.filter((task) => isToday(task.deadline));
  const doneToday = todayTasks.filter(isDone).length;
  const currentProfile = getCurrentProfile(members, user?.id);
  const rank = getRank(members, user?.id);
  const loading = isFamilyLoading || areMembersLoading || areTasksLoading;

  function openCreateTask() {
    router.push("/(protected)/create-task" as Href);
  }

  if (isFamilyLoading) {
    return <LoadingScreen />;
  }

  if (!familyId) {
    return <Redirect href={"/(protected)/(family)" as Href} />;
  }

  return (
      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 112 }}
          showsVerticalScrollIndicator={false}
        >
          <FamilyHeroCard
            familyName={familyName}
            inviteCode={invite?.invite_code ?? null}
            memberCount={members.length}
            profile={currentProfile}
            rank={rank}
          />

          <View className="gap-5 px-5 pt-5">
            <View className="gap-3">
              <HomeSectionHeader
                title="Задачі на сьогодні"
                icon="target"
                count={todayTasks.length}
                onAdd={openCreateTask}
              />

              {loading ? (
                <View className="rounded-3xl bg-white p-6 border border-border">
                  <LoadingScreen />
                </View>
              ) : (
                <HomeTaskList
                  tasks={todayTasks}
                  members={members}
                  isError={isTasksError}
                />
              )}
            </View>

            <WeeklyLeaders members={members} />

            <View className="rounded-3xl bg-white p-5 border border-border">
              <Typo variant="h3">Сімейний прогрес</Typo>
              <Typo className="mt-1 text-muted">
                Виконано сьогодні: {doneToday}/{todayTasks.length}
              </Typo>
            </View>
          </View>
        </ScrollView>
      </View>
  );
}
