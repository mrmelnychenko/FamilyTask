import { Href, router } from "expo-router";
import { ScrollView, View } from "react-native";

import { FamilyHeroCard } from "@/src/components/home/FamilyHeroCard";
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
import { ITask } from "../types/task";


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

function isDone(task: ITask) {
  return task.status === "DONE";
}

export function HomeScreen() {
  const { user } = useAuth();
  const {
    data: familyMember,
    isLoading: isFamilyLoading,
  } = useCurrentFamily(user?.id);

  const familyId = familyMember?.family_id ?? null;

  const {
    data: tasks = [],
    isLoading: areTasksLoading,
    isError: isTasksError,
  } = useFamilyTasks(familyId);
 
console.log(tasks, '55555555555555555555')

  return (
      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 112, paddingHorizontal: 20, paddingTop: 16 }}
          showsVerticalScrollIndicator={false}
        >
         <FamilyHeroCard />

          <View className="gap-5  pt-5">
            <View className="gap-3">
            
                <HomeTaskList
                  tasks={tasks}
                  isError={isTasksError}
                />
              
            </View>

            {/* <WeeklyLeaders members={members} />

            <View className="rounded-3xl bg-white p-5 border border-border">
              <Typo variant="h3">Сімейний прогрес</Typo>
              <Typo className="mt-1 text-muted">
                Виконано сьогодні: {doneToday}/{todayTasks.length}
              </Typo>
            </View> */}
          </View>
        </ScrollView>
      </View>
  );
}


