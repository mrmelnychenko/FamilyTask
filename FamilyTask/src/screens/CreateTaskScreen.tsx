import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  View,
} from "react-native";

import { LoadingScreen } from "@/src/components/ui/LoadingScreen";
import { Typo } from "@/src/components/ui/Typo";
import { TaskForm } from "@/src/components/tasks/TaskForm";
import { useCurrentFamily, useFamilyMembers } from "@/src/hooks/queries/useFamily";
import { useCreateTask } from "@/src/hooks/queries/useTasks";
import { useAuth } from "@/src/hooks/useAuth";
import { useProfile } from "@/src/hooks/queries/useProfile";
import type { TaskFormData } from "@/src/schemas/task.schema";
import { colors } from "@/src/utils/colors";

function goBackOrHome() {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace("/home");
}

export function CreateTaskScreen() {
  const { user } = useAuth();
  const { data: profile, isLoading: isProfileLoading } = useProfile(user?.id);
  const { data: familyMember, isLoading: isFamilyLoading } = useCurrentFamily(
    user?.id
  );

  const familyId = familyMember?.family_id ?? null;
  const { data: members = [], isLoading: areMembersLoading } = useFamilyMembers(
    familyId ?? undefined
  );
  const createTask = useCreateTask();
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleCreateTask(data: TaskFormData) {
    if (!familyId || !profile?.id) {
      setSubmitError("Не вдалося завантажити дані сімʼї або профілю.");
      return;
    }

    setSubmitError(null);

    try {
      await createTask.mutateAsync({
        familyId,
        creatorId: profile.id,
        assigneeId: data.assigneeId,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        dueDate: data.dueDate?.trim() || null,
        dueTime: data.dueTime?.trim() || null,
        priority: data.priority,
      });

      goBackOrHome();
    } catch (error) {
      console.log("createTask error:", error);
      setSubmitError("Не вдалося створити задачу. Спробуйте ще раз.");
    }
  }

  const loading = isProfileLoading || isFamilyLoading || areMembersLoading;

  if (loading) {
    return <LoadingScreen />;
  }

  return (

    <View>
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={goBackOrHome}
          className="h-11 w-11 items-center justify-center rounded-full bg-white border border-border"
        >
          <Feather name="arrow-left" size={20} color={colors.text} />
        </Pressable>

        <View className="flex-1">
          <Typo variant="h2">Нова задача</Typo>
          <Typo className="text-muted">
            Створіть завдання для сімʼї
          </Typo>
        </View>
      </View>

      {!familyId ? (
        <View className="rounded-2xl border border-warning bg-warning-bg p-4">
          <Typo variant="h3" className="text-text">
            Сімʼю ще не налаштовано
          </Typo>
          <Typo className="mt-1 text-muted">
            Після створення або приєднання до сімʼї тут можна буде
            додавати задачі.
          </Typo>
        </View>
      ) : (
        <TaskForm
          members={members}
          loading={createTask.isPending}
          error={submitError}
          onSubmit={handleCreateTask}
        />
      )}

    </View>
  );
}
