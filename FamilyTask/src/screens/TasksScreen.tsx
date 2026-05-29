import { FlatList, Pressable, ScrollView, View } from "react-native";
import { HorizontalCalendar } from "../components/tasks/HorizontalCalendar";
import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { StoryList } from "../components/tasks/StoryList";
import { useTasks } from "../hooks/queries/useTasks";
import { useCurrentFamily } from "../hooks/queries/useFamily";
import { MaterialIcons } from "@expo/vector-icons";
import { useFiltersToggle } from "../store/store";
import { TaskCard } from "../components/tasks/TaskCard";
import { ITaskFilters } from "../types/task";
import { FilterTaskBottom } from "../components/tasks/FilterTaskBottom";
import { Typo } from "../components/ui/Typo";


export function TasksScreen() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { user } = useAuth()
    const { data: family } = useCurrentFamily(user?.id)
    const { data: tasks } = useTasks(family?.family_id, selectedDate);
    const { filterVisible, setFilterVisible } = useFiltersToggle()
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

    const [filters, setFilters] = useState<ITaskFilters>({
        recurrence: null,
        priority: null,
        categories: [],
    });

    const filteredTasks = useMemo(() => {
        if (!tasks) return [];

        return tasks.filter((task) => {
            const matchRecurrence =
                !filters.recurrence || task.recurrence === filters.recurrence;

            const matchPriority =
                !filters.priority || task.priority === filters.priority;

            const matchCategories =
                filters.categories.length === 0 ||
                filters.categories.includes(task.category);

            const matchMembers =
                selectedMemberIds.length === 0 ||
                selectedMemberIds.includes(task.assigned_to ?? "");

            return (
                matchRecurrence &&
                matchPriority &&
                matchCategories &&
                matchMembers
            );
        });
    }, [tasks, filters, selectedMemberIds]);


    const openFilters = () => setFilterVisible(true);
    const closeFilters = () => setFilterVisible(false);

    const handleApplyFilters = (newFilters: ITaskFilters) => {
        setFilters(newFilters);
        closeFilters();
    };

    return (
        <View className="flex-1">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* CALENDAR */}
                <HorizontalCalendar
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />

                {/* MEMBERS + FILTER BUTTON */}
                <View className="px-4 pt-6">
                    <View className="w-full">
                        <StoryList onSelectMembers={setSelectedMemberIds} />
                    </View>

                </View>

                {/* FILTERS */}
                <View className="flex-row justify-end px-4">
                    <Pressable
                        onPress={openFilters}
                        className="flex-row items-center gap-2 bg-primary px-4 py-2 rounded-full shadow"
                    >
                        <MaterialIcons name="filter-list" size={18} color="white" />

                        <Typo variant="body" className="text-white">
                            Filters
                        </Typo>
                    </Pressable>
                </View>

                {/* TASKS */}
                <FlatList
                    data={filteredTasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TaskCard task={item} />
                    )}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        marginTop: 16,         
                        paddingBottom: 20     
                    }}
                    ItemSeparatorComponent={() => <View className="h-3" />}
                    scrollEnabled={false}
                />
            </ScrollView>


            {/* only for mobile  !important */}
            {/* FILTER SHEET */}
            <FilterTaskBottom
                    visible={filterVisible}
                    initialFilters={filters}
                    onClose={closeFilters}
                    onApply={handleApplyFilters}
                />

        </View>
    )
}