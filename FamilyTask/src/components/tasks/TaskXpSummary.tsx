import { View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import type { TaskPriority } from "@/src/schemas/task.schema";
import type { FamilyMember } from "@/src/services/family-service";

type Props = {
  priority: TaskPriority;
  assigneeId: string;
  members: FamilyMember[];
};

function getProfile(member: FamilyMember) {
  if (Array.isArray(member.profiles)) {
    return member.profiles[0] ?? null;
  }

  return member.profiles;
}

export function TaskXpSummary({ priority, assigneeId, members }: Props) {
  const selectedAssignee =
    members.map(getProfile).find((profile) => profile?.id === assigneeId) ?? null;

  return (
    <View className="rounded-2xl bg-primary-light p-4 border border-primary">
      <Typo variant="h3" className="text-text">
        Нагорода: {priority === "high" ? 15 : 10} XP
      </Typo>
      <Typo className="mt-1 text-muted">
        Виконавець: {selectedAssignee?.name || "не обрано"}
      </Typo>
    </View>
  );
}
