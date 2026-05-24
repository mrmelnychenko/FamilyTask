import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";

import { Button } from "@/src/components/ui/Button";
import { Typo } from "@/src/components/ui/Typo";
import type { ITask } from "@/src/types/task";
import { colors } from "@/src/utils/colors";
import { TaskCard } from "./TaskCard";

type Props = {
  tasks: ITask[];
  selectedDate: Date;
  isLoading: boolean;
  isError: boolean;
  hasFilters: boolean;
  onRetry: () => void;
};

function getEmptyTasksMessage(hasFilters: boolean) {
  return hasFilters
    ? "За цими фільтрами задач не знайдено"
    : "На цю дату задач поки немає";
}

export function TaskListContent({
  tasks,
  selectedDate,
  isLoading,
  isError,
  hasFilters,
  onRetry,
}: Props) {
  if (isLoading) {
    return (
      <View className="rounded-3xl border border-border bg-white p-5">
        <Typo variant="h3" className="text-text">
          Завантажуємо задачі...
        </Typo>
        <Typo className="mt-1 text-muted">
          Зараз підтягнемо список для обраної дати.
        </Typo>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="gap-3 rounded-3xl border border-danger bg-danger-bg p-5">
        <View>
          <Typo variant="h3" className="text-danger">
            Не вдалося завантажити задачі
          </Typo>
          <Typo className="mt-1 text-muted">
            Перевірте інтернет або спробуйте оновити ще раз.
          </Typo>
        </View>

        <Button className="self-start px-5 py-3" onPress={onRetry}>
          <Typo variant="h3" className="text-white">
            Оновити
          </Typo>
        </Button>
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View className="rounded-3xl border border-dashed border-border bg-white p-6">
        <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-primary-light">
          <MaterialIcons name="checklist" size={24} color={colors.primary} />
        </View>
        <Typo variant="h3" className="text-text">
          {getEmptyTasksMessage(hasFilters)}
        </Typo>
        <Typo className="mt-1 text-muted">
          {hasFilters
            ? "Спробуйте змінити фільтри або вибрати інший день."
            : "Можна створити нову задачу через вкладку Додати."}
        </Typo>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          selectedDate={selectedDate}
          showActions
        />
      ))}
    </View>
  );
}
