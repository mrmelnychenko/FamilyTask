import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import { useCurrentFamily, useFamilyMembers } from "@/src/hooks/queries/useFamily";
import { useCreateTask } from "@/src/hooks/queries/useTasks";
import { useAuth } from "@/src/hooks/useAuth";
import { useProfile } from "@/src/hooks/queries/useProfile";
import { colors } from "@/src/utils/colors";
import { TaskFormData } from "../schemas/task.schema";
import { TaskForm } from "../components/tasks/TaskForm";


function goBackOrHome() {
  router.replace("/(protected)/(tabs)/home");
}

export function CreateTaskScreen() {
  const { user } = useAuth();
  const { data: family } = useCurrentFamily(user?.id);
  const { data: members = [] } = useFamilyMembers(family?.family_id);
  const { data: profile } = useProfile(user?.id);
  const { mutateAsync: createTask, isPending } = useCreateTask();
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function onSubmit(data: TaskFormData) {
    if (!family?.family_id || !profile?.id) return;
    setSubmitError(null);
    try {
      await createTask({
        familyId: family.family_id,
        creatorId: profile.id,
        assigneeId: data.assigneeId,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        dueDate: data.is_recurring ? null : data.dueDate,
        dueTime: data.is_recurring ? null : data.dueTime,
        priority: data.priority,
        category: data.category,
        is_recurring: data.is_recurring,
        recurrence: data.is_recurring ? data.recurrence : null,
        recurrence_days: data.is_recurring ? data.recurrence_days : null,
      });
      goBackOrHome();
    } catch {
      setSubmitError("Не вдалося створити задачу. Спробуйте ще раз.");
    }
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <View className="gap-4 p-4">
        {/* HEADER */}
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={goBackOrHome}
            className="h-11 w-11 items-center justify-center rounded-full bg-white border border-border"
          >
            <Feather name="arrow-left" size={20} color={colors.text} />
          </Pressable>
          <View>
            <Typo variant="h2">Нова задача</Typo>
            <Typo className="text-muted">Створіть завдання для сімʼї</Typo>
          </View>
        </View>

        {!family?.family_id ? (
          <View className="rounded-2xl border border-warning bg-warning-bg p-4">
            <Typo variant="h3" className="text-text">Сімʼю ще не налаштовано</Typo>
            <Typo className="mt-1 text-muted">
              Після створення або приєднання до сімʼї тут можна буде додавати задачі.
            </Typo>
          </View>
        ) : (
          <TaskForm
            members={members}
            currentUserId={user?.id ?? ""}
            loading={isPending}
            error={submitError}
            onSubmit={onSubmit}
          />
        )}
      </View>
    </ScrollView>
  );
}