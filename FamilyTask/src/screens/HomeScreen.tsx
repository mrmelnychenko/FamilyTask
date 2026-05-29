import { ScrollView, View } from "react-native";

import { FamilyHeroCard } from "@/src/components/home/FamilyHeroCard";
import { HomeTaskList } from "@/src/components/home/HomeTaskList";
import { useCurrentFamily, useFamilyMembers } from "@/src/hooks/queries/useFamily";
import { useMyTodayTasks } from "@/src/hooks/queries/useTasks";
import { useAuth } from "@/src/hooks/useAuth";
import { StreakCard } from "../components/ui/StreakCard";
import { useProfile } from "../hooks/queries/useProfile";
import { TableHeroes } from "../components/ui/TableHeroes";



export function HomeScreen() {
  const { user } = useAuth();
  const {
    data: familyMember,
    isLoading: isFamilyLoading,
  } = useCurrentFamily(user?.id);

  const familyId = familyMember?.family_id ?? null;
  const { data: profile } = useProfile(user?.id)
  const { data: members } = useFamilyMembers(familyId!)
  const {
    data: myTodayTasks = [],
    isError: isTasksError,
  } = useMyTodayTasks(user?.id!);
  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 112, paddingHorizontal: 20, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <FamilyHeroCard />

        <View className="gap-5  pt-5">
          <View>
            <StreakCard streak={profile.streak} />
          </View>
          <View className="gap-3">

            <HomeTaskList
              tasks={myTodayTasks}
              isError={isTasksError}
            />

          </View>

          <View>
            <TableHeroes/>
          </View>


        </View>
      </ScrollView>
    </View>
  );
}


