import { View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import type { FamilyMember } from "@/src/services/family-service";
import type { TaskPriority } from "@/src/types/task";

type Props = {
  priority: TaskPriority;
  assigneeId: string;
  members: FamilyMember[];
};

function getProfile(member: FamilyMember) {
  return member.profiles;
}

function getXpReward(priority: TaskPriority) {
  if (priority === "high") return 15;
  if (priority === "normal") return 10;
  return 5;
}

export function TaskXpSummary({ priority, assigneeId, members }: Props) {
  const selectedAssignee =
    members.map(getProfile).find((profile) => profile?.id === assigneeId) ??
    null;

  return (
    <View className="rounded-2xl border border-primary bg-primary-light p-4">
      <Typo variant="h3" className="text-text">
        Нагорода: {getXpReward(priority)} XP
      </Typo>
      <Typo className="mt-1 text-muted">
        Виконавець: {selectedAssignee?.name || "не обрано"}
      </Typo>
    </View>
  );
}
