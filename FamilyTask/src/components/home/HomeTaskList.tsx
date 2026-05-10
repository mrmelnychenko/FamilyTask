import { View } from "react-native";

import { TaskCard } from "@/src/components/tasks/TaskCard";
import { Typo } from "@/src/components/ui/Typo";
import type { FamilyMember } from "@/src/services/family-service";
import type { FamilyTask } from "@/src/services/task-service";

type Props = {
  tasks: FamilyTask[];
  members: FamilyMember[];
  isError?: boolean;
};

export function HomeTaskList({ tasks, members, isError = false }: Props) {
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
      <View className="items-center rounded-3xl border border-border bg-white p-6">
        <View className="mb-3 h-16 w-16 items-center justify-center rounded-3xl bg-primary-light">
          <Typo variant="h1">✨</Typo>
        </View>
        <Typo variant="h3" className="text-center">
          Сьогодні задач поки немає
        </Typo>
        <Typo className="mt-1 text-center text-muted">
          Натисніть плюс, щоб додати перше завдання для сімʼї.
        </Typo>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} members={members} />
      ))}
    </View>
  );
}
