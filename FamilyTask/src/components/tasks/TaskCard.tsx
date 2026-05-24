import { Feather } from "@expo/vector-icons";
import { Alert, Pressable, View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import { colors } from "@/src/utils/colors";
import { Avatar } from "../ui/Avatar";
import { ITask } from "@/src/types/task";
import { cn } from "@/src/utils/cn";
import {
  useCompleteTask,
  useDeleteTask,
  useUncompleteTask,
} from "@/src/hooks/queries/useTasks";
import { useAuth } from "@/src/hooks/useAuth";
import { format } from "date-fns";

type Props = {
  task: ITask;
  selectedDate?: Date;
  showActions?: boolean;
};

export function TaskCard({ task, selectedDate, showActions = false }: Props) {
  const { mutate: completeTaskMutate, isPending: isCompleting } = useCompleteTask();
  const { mutate: uncompleteTaskMutate, isPending: isUncompleting } = useUncompleteTask();
  const { mutate: deleteTaskMutate, isPending: isDeleting } = useDeleteTask();
  const { user } = useAuth();

  const isPending = isCompleting || isUncompleting || isDeleting;
  const completionUserId = task.assigned_to ?? user?.id;

  const recurringDate = task.is_recurring
    ? format(selectedDate ?? new Date(), "yyyy-MM-dd")
    : undefined;

  const isDone = task.is_recurring
    ? task.completions?.some(
        (c) => c.user_id === completionUserId && c.recurring_date === recurringDate
      ) ?? false
    : task.status === "DONE";

  const handlePressCheckbox = () => {
    if (isPending || !completionUserId) return;

    if (isDone) {
      uncompleteTaskMutate({
        taskId: task.id,
        userId: completionUserId,
        familyId: task.family_id,
        recurringDate,
        title: task.title,
        deadline: task.deadline,
      });
    } else {
      completeTaskMutate({
        taskId: task.id,
        userId: completionUserId,
        familyId: task.family_id,
        xpEarned: task.xp_reward,
        recurringDate,
      });
    }
  };

  const handleDelete = () => {
    if (isPending) return;

    Alert.alert(
      "Видалити задачу?",
      "Цю дію не можна буде швидко скасувати.",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: () => deleteTaskMutate(task.id),
        },
      ]
    );
  };

  return (
    <View
      className={cn(
        "flex-row items-center justify-between rounded-2xl p-4 border",
        "bg-white shadow-sm",
        isDone ? "bg-background opacity-60 border-transparent" : "border-border"
      )}
    >
      {/* LEFT */}
      <View className="flex-1 flex-row items-center">

        {/* CHECKBOX */}
        <Pressable
          onPress={handlePressCheckbox}
          disabled={isPending}
          className={cn(
            "mr-4 items-center justify-center rounded-full border",
            isDone ? "bg-success border-success" : "bg-white border-border"
          )}
          style={{ width: 38, height: 38 }}
        >
          <Feather name="check" size={18} color="white" />
        </Pressable>

        {/* CONTENT */}
        <View className="flex-1 pr-2">
          <View className="flex-row items-center gap-2">
            <Typo
              className={cn(
                "text-[15px] font-semibold",
                isDone ? "text-muted line-through" : "text-text"
              )}
            >
              {task.title}
            </Typo>
            {task.is_recurring && (
              <View className="px-2 py-0.5 rounded-full bg-primary-light">
                <Typo className="text-[9px] text-primary font-semibold uppercase tracking-wide">
                  {task.recurrence}
                </Typo>
              </View>
            )}
          </View>

          <View className="mt-1.5 flex-row items-center">
            <View className="px-2 py-0.5 rounded-md border border-border bg-background">
              <Typo className="text-[10px] text-muted uppercase tracking-wide font-medium">
                {task.description || "Task"}
              </Typo>
            </View>

            {!isDone && (
              <View className="ml-3 flex-row items-center">
                <Feather name="star" size={11} color={colors.gold} />
                <Typo className="ml-1 text-gold text-[11px] font-semibold">
                  {task.xp_reward} XP
                </Typo>
              </View>
            )}

            {!task.is_recurring && task.deadline && !isDone && (
              <View className="ml-3 flex-row items-center">
                <Feather name="clock" size={11} color={colors.muted} />
                <Typo className="ml-1 text-muted text-[11px]">
                  {format(new Date(task.deadline), "HH:mm")}
                </Typo>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* RIGHT */}
      <View className="flex-row items-center gap-2">
        {isDone ? (
          <View className="bg-success-bg px-3 py-1 rounded-full">
            <Typo className="text-success text-[10px] font-semibold uppercase">
              Done
            </Typo>
          </View>
        ) : (
          <Avatar
            name={task.assignee?.name ?? null}
            avatarUrl={task.assignee?.avatar_url ?? undefined}
          />
        )}

        {showActions ? (
          <Pressable
            onPress={handleDelete}
            disabled={isPending}
            className={cn(
              "h-9 w-9 items-center justify-center rounded-full bg-danger-bg",
              isPending && "opacity-50"
            )}
          >
            <Feather name="trash-2" size={16} color={colors.danger} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
