import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import { colors } from "@/src/utils/colors";
import { Avatar } from "../ui/Avatar";
import { ITask } from "@/src/types/task";
import { useCompleteTask, useUncompleteTask } from "@/src/hooks/queries/useTasks";
import { useAuth } from "@/src/hooks/useAuth";
import { format } from "date-fns";
import { TASK_CATEGORIES } from "@/src/constants/tasks";

type Props = {
  task: ITask;
  selectedDate?: Date;
};

export function TaskCard({ task, selectedDate }: Props) {
  const { user } = useAuth();
  const { mutate: complete, isPending: isCompleting } = useCompleteTask();
  const { mutate: uncomplete, isPending: isUncompleting } = useUncompleteTask();

  const isPending = isCompleting || isUncompleting;

  const recurringDate = task.is_recurring
    ? format(selectedDate ?? new Date(), "yyyy-MM-dd")
    : undefined;

  const isDone = task.is_recurring
    ? task.completions?.some(
      (c) =>
        c.user_id === user?.id && c.recurring_date === recurringDate
    ) ?? false
    : task.status === "DONE";
  const toggleDone = () => {
    if (isPending || !user) return;

    if (isDone) {
      uncomplete({
        taskId: task.id,
        userId: user.id,
        familyId: task.family_id,
        recurringDate,
      });
    } else {
      complete({
        taskId: task.id,
        userId: user.id,
        familyId: task.family_id,
        xpEarned: task.xp_reward,
        recurringDate,
      });
    }
  };

  const taskCategory = TASK_CATEGORIES.find((cat) => cat.key === task.category);
  return (
    <View
      style={{
        backgroundColor: colors.white,
        borderColor: colors.border,
      }}
      className="border-2  rounded-xl p-4 space-y-3"
    >
      {/* TOP ROW */}
      <View className="flex-row justify-between items-start">
        {/* ICON */}
        <View
          style={{
            backgroundColor: colors.primaryLight,
            borderColor: colors.primary,
          }}
          className="p-3 rounded-lg border-2"
        >
          <MaterialIcons
            name={taskCategory?.icon}
            size={22}
            color={colors.primary}
          />
        </View>

        {/* XP BADGE */}
        <View
          style={{
            backgroundColor: colors.goldBg,
            borderColor: colors.gold,
          }}
          className="px-3 py-1 rounded-full border-2 flex-row items-center gap-1"
        >
          <Feather name="star" size={12} color={colors.gold} />
          <Typo
            style={{ color: colors.gold }}
            className="text-xs font-bold"
          >
            +{task.xp_reward} XP
          </Typo>
        </View>
      </View>

      {/* TITLE */}
      <View>
        <Typo className="text-[16px] font-bold text-text">
          {task.title}
        </Typo>

        {/* TAGS */}
        <View className="flex-row gap-2 mt-2">
          {task.recurrence && (
            <View
              style={{ backgroundColor: colors.background }}
              className="px-2 py-0.5 rounded"
            >
              <Typo className="text-[10px] uppercase text-muted">
                {task.recurrence}
              </Typo>
            </View>
          )}

          {task.priority && (
            <View
              style={{
                backgroundColor: colors.primaryLight,
              }}
              className="px-2 py-0.5 rounded"
            >
              <Typo
                style={{ color: colors.primary }}
                className="text-[10px] uppercase"
              >
                {task.priority}
              </Typo>
            </View>
          )}
        </View>

        {/* DESCRIPTION */}
        {task.description && (
          <Typo className="text-[12px] text-muted mt-2">
            {task.description}
          </Typo>
        )}
      </View>

      {/* BOTTOM */}
      <View className="flex-row items-center justify-between pt-2">
        {/* avatars placeholder */}
        <View className="flex-row -space-x-2">
          <Avatar
            name={task.assignee?.name ?? null}
            avatarUrl={task.assignee?.avatar_url ?? undefined}
          />
        </View>

        {/* BUTTON */}
        <Pressable
          onPress={toggleDone}
          style={{
            backgroundColor: isDone ? colors.muted : colors.primary,
            borderColor: isDone ? colors.border : colors.primaryDark,
            opacity: isPending ? 0.7 : 1,
          }}
          className="px-6 py-2 rounded-full border-2"
        >
          <Typo
            style={{ color: colors.white }}
            className="font-bold"
          >
            {isDone ? "Done" : "Done"}
          </Typo>
        </Pressable>
      </View>
    </View>
  );
}