import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import { colors } from "@/src/utils/colors";
import { Avatar } from "../ui/Avatar";
import { ITask } from "@/src/types/task";
import { cn } from "@/src/utils/cn";
import { useCompleteTask } from "@/src/hooks/queries/useTasks";
import { useAuth } from "@/src/hooks/useAuth";

type Props = {
  task: ITask;
};



export function TaskCard({ task }: Props) {
  const { mutate: completeTaskMutate, isPending } = useCompleteTask();
  const {user} = useAuth()
  const isDone = task.status === 'DONE';
  const handlePressCheckbox = () => {
    if (isDone || isPending) return;

    completeTaskMutate({
      taskId: task.id,
      familyId: task.family_id,
      userId: user?.id!
    });
  };

  return (
    <View
      className={cn(
        "flex-row items-center justify-between rounded-2xl p-4 border",
        "bg-white shadow-sm",
        isDone
          ? "bg-background opacity-60 border-transparent"
          : "border-border"
      )}
    >
      {/* LEFT */}
      <View className="flex-1 flex-row items-center">

        {/* CHECKBOX */}
        <Pressable
          onPress={handlePressCheckbox}
          className={cn(
            "mr-4 items-center justify-center rounded-full border",
            "transition-all duration-200",
            isDone
              ? "bg-success border-success"
              : "bg-white border-border"
          )}
          style={{ width: 38, height: 38 }}
        >

          <Feather name="check" size={18} color="white" />

        </Pressable>

        {/* CONTENT */}
        <View className="flex-1 pr-2">

          <Typo
            className={cn(
              "text-[15px] font-semibold",
              isDone ? "text-muted line-through" : "text-text"
            )}
          >
            {task.title}
          </Typo>

          <View className="mt-1.5 flex-row items-center">

            {/* TAG */}
            <View className="px-2 py-0.5 rounded-md border border-border bg-background">
              <Typo className="text-[10px] text-muted uppercase tracking-wide font-medium">
                {task.description || "Task"}
              </Typo>
            </View>

            {/* XP */}
            {!isDone && (
              <View className="ml-3 flex-row items-center">
                <Feather name="star" size={11} color={colors.gold} />
                <Typo className="ml-1 text-gold text-[11px] font-semibold">
                  {task.xp_reward} XP
                </Typo>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* RIGHT */}
      <View className="flex-row items-center">
        {isDone ? (
          <View className="bg-success-bg px-3 py-1 rounded-full">
            <Typo className="text-success text-[10px] font-semibold uppercase">
              Done
            </Typo>
          </View>
        ) : (
          <Avatar name={task.assignee?.name ?? null} />
        )}
      </View>
    </View>
  );
}