import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { FilterTaskBottom } from "@/src/components/tasks/FilterTaskBottom";
import { HorizontalCalendar } from "@/src/components/tasks/HorizontalCalendar";
import { StoryList } from "@/src/components/tasks/StoryList";
import { TaskListContent } from "@/src/components/tasks/TaskListContent";
import { Typo } from "@/src/components/ui/Typo";
import { useCurrentFamily } from "@/src/hooks/queries/useFamily";
import { useTasks } from "@/src/hooks/queries/useTasks";
import { useAuth } from "@/src/hooks/useAuth";
import { useFiltersToggle } from "@/src/store/store";
import type { ITaskFilters } from "@/src/types/task";

function hasActiveTaskFilters(
  filters: ITaskFilters,
  selectedMemberIds: string[]
) {
  return (
    !!filters.recurrence ||
    !!filters.priority ||
    filters.categories.length > 0 ||
    selectedMemberIds.length > 0
  );
}

export function TasksScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<ITaskFilters>({
    recurrence: null,
    priority: null,
    categories: [],
  });

  const { user } = useAuth();
  const { data: family } = useCurrentFamily(user?.id);
  const { filterVisible, setFilterVisible } = useFiltersToggle();
  const {
    data: tasks,
    isLoading: isTasksLoading,
    isError: isTasksError,
    refetch: refetchTasks,
  } = useTasks(family?.family_id, selectedDate);

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
        matchRecurrence && matchPriority && matchCategories && matchMembers
      );
    });
  }, [tasks, filters, selectedMemberIds]);

  const openFilters = () => setFilterVisible(true);
  const closeFilters = () => setFilterVisible(false);

  const handleApplyFilters = (newFilters: ITaskFilters) => {
    setFilters(newFilters);
    closeFilters();
  };

  const retryTasks = () => {
    void refetchTasks();
  };

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <HorizontalCalendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <View className="px-4 pt-6">
          <StoryList onSelectMembers={setSelectedMemberIds} />
        </View>

        <View className="flex-row justify-end px-4">
          <Pressable
            onPress={openFilters}
            className="flex-row items-center gap-2 rounded-full bg-primary px-4 py-2 shadow"
          >
            <MaterialIcons name="filter-list" size={18} color="white" />
            <Typo variant="body" className="text-white">
              Фільтри
            </Typo>
          </Pressable>
        </View>

        <View className="mt-4 px-4">
          <TaskListContent
            tasks={filteredTasks}
            selectedDate={selectedDate}
            isLoading={isTasksLoading}
            isError={isTasksError}
            hasFilters={hasActiveTaskFilters(filters, selectedMemberIds)}
            onRetry={retryTasks}
          />
        </View>
      </ScrollView>

      <FilterTaskBottom
        visible={filterVisible}
        initialFilters={filters}
        onClose={closeFilters}
        onApply={handleApplyFilters}
      />
    </View>
  );
}
