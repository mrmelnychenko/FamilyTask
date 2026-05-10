import { Feather } from "@expo/vector-icons";
import { View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import type { FamilyMember } from "@/src/services/family-service";
import type { FamilyTask } from "@/src/services/task-service";
import { colors } from "@/src/utils/colors";

type Props = {
  task: FamilyTask;
  members: FamilyMember[];
};

function getProfile(member: FamilyMember) {
  if (Array.isArray(member.profiles)) {
    return member.profiles[0] ?? null;
  }

  return member.profiles;
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return "Без часу";

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return "Без часу";

  return date.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isDone(status: string | null) {
  return status === "done" || status === "completed";
}

export function TaskCard({ task, members }: Props) {
  const assignee =
    members.map(getProfile).find((profile) => profile?.id === task.assigned_to) ??
    null;
  const done = isDone(task.status);

  return (
    <View
      className={
        done
          ? "rounded-2xl border border-success bg-success-bg p-4"
          : "rounded-2xl border border-border bg-white p-4"
      }
      style={{
        shadowColor: "#111827",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className={
            done
              ? "h-7 w-7 items-center justify-center rounded-lg bg-success"
              : "h-7 w-7 rounded-lg border border-border bg-white"
          }
        >
          {done && <Feather name="check" size={17} color="white" />}
        </View>

        <View className="flex-1 gap-1">
          <View className="flex-row items-start justify-between gap-2">
            <Typo variant="h3" className="flex-1 text-text">
              {task.title}
            </Typo>
            <View className="rounded-xl bg-primary-light px-3 py-2">
              <Typo variant="points" className="text-primary">
                +{task.xp_reward ?? 10} XP
              </Typo>
            </View>
          </View>

          {!!task.description && (
            <Typo className="text-muted">{task.description}</Typo>
          )}

          <View className="mt-1 flex-row flex-wrap items-center gap-2">
            <Typo variant="label" className="text-muted">
              {assignee?.avatar_emoji || "😊"} {assignee?.name || "Без імені"}
            </Typo>
            <Typo variant="label" className="text-muted">
              ·
            </Typo>
            <View className="flex-row items-center gap-1">
              <Feather name="clock" size={12} color={colors.muted} />
              <Typo variant="label" className="text-muted">
                {formatDeadline(task.deadline)}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
