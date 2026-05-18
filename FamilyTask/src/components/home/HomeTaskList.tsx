import { Pressable, View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import { Feather, Octicons } from "@expo/vector-icons";
import { colors } from "@/src/utils/colors";
import { Button } from "../ui/Button";
import { router } from "expo-router";
import { TaskCard } from "../tasks/TaskCard";
import { ITask } from "@/src/types/task";

type Props = {
  tasks: ITask[];
  isError?: boolean;
};

export function HomeTaskList({ tasks, isError = false }: Props) {
  if (isError) {
    return (
      <View className="rounded-2xl border border-danger bg-danger-bg p-4">
        <Typo variant="h3" className="text-danger">
          Не вдалося завантажити задачі
        </Typo>
        <Typo className="mt-1 text-muted">
          Спробуйте оновити екран трохи пізніше.
        </Typo>
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View className="w-full items-center justify-center rounded-[32px] border border-dashed border-border bg-white p-6">
        <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-primary-light">
        <Octicons name="tasklist" size={24} color={colors.primary} />
        </View>

        <Typo variant="h3" className="text-text mb-1">
          No tasks for today
        </Typo>

        <Button className=" flex-row items-center rounded-full bg-primary px-4 py-2 mt-2">
          <Typo variant="h3" className="text-white font-medium ">Add new task</Typo>
          <Feather name="plus" size={18} color={colors.white}/>
        </Button>
      </View>
    );
  }

  const displayTasks = [...tasks]
    .sort((a, b) => {
      if (a.deadline && !b.deadline) return -1;
      if (!a.deadline && b.deadline) return 1;

      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }

      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })
    .slice(0, 5);
  return (
    <View className="rounded-3xl bg-white border border-border p-4">
      <View className="flex-row justify-between items-center gap-2">
        <View className="flex flex-row items-center gap-2">
          <Feather name="target" size={20} color={colors.primary} />
          <Typo variant="h2">Todays tasks</Typo>
          <View className="rounded-full bg-background px-3 py-1">
            <Typo variant="label" className="text-primary">
              {tasks.length}
            </Typo>
          </View>
        </View>
        <Pressable className="flex items-center flex-row gap-1 text-primary" onPress={() => router.replace('/(protected)/(tabs)/tasks')}>
          <Typo variant="h3" className="text-primary">View all</Typo>
          <Feather name="arrow-right" size={24} color={colors.primary} />
        </Pressable>

      </View>

      <View className="gap-3 mt-3">
        {displayTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </View>
    </View>
  );
}
