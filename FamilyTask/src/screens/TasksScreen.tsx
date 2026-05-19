import { ScrollView, View } from "react-native";
import { HorizontalCalendar } from "../components/tasks/HorizontalCalendar";
import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { StoryList } from "../components/tasks/StoryList";
import { useTasks } from "../hooks/queries/useTasks";
import { useCurrentFamily, useFamilyMembers } from "../hooks/queries/useFamily";

export function TasksScreen() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTab, setSelectedTab] = useState("all");
    const { user } = useAuth()
    const { data: family } = useCurrentFamily(user?.id)
    const { data: familyMembers } = useFamilyMembers(family?.family_id)
    const { data: tasks } = useTasks(family?.family_id, selectedDate);
    console.log(tasks, 'tasks')
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

const filteredTasks = useMemo(() => {
  if (!tasks) return [];
  return tasks.filter((task) => {
    const sameMember = selectedMemberIds.length > 0
      ? selectedMemberIds.includes(task.assigned_to ?? "")
      : true;
    // ...
  });
}, [tasks, selectedMemberIds, selectedTab]);
    console.log(filteredTasks, 'filteredTasks')
    return (
        <View className="flex-1">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 112 }}
                showsVerticalScrollIndicator={false}
            >
                <HorizontalCalendar
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />
                <View className="px-4 pt-6">
                    <View className="w-full">
                        {/* <SegmentedControl tabs={TABS_TASK} onChange={(tab) => setSelectedTab(tab.key)} /> */}
                        <StoryList onSelectMembers={setSelectedMemberIds} />
                    </View>

                </View>

            </ScrollView>
        </View>
    )
}