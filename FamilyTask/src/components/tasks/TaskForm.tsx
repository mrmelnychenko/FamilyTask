import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Typo } from "@/src/components/ui/Typo";
import { AssigneeSelector } from "@/src/components/tasks/AssigneeSelector";
import { EmojiPicker } from "@/src/components/tasks/EmojiPicker";
import { PrioritySelector } from "@/src/components/tasks/PrioritySelector";
import { TaskXpSummary } from "@/src/components/tasks/TaskXpSummary";
import {
  type TaskFormData,
  taskSchema,
} from "@/src/schemas/task.schema";
import type { FamilyMember } from "@/src/services/family-service";

type Props = {
  members: FamilyMember[];
  loading?: boolean;
  error?: string | null;
  onSubmit: (data: TaskFormData) => void;
};

function getProfile(member: FamilyMember) {
  if (Array.isArray(member.profiles)) {
    return member.profiles[0] ?? null;
  }

  return member.profiles;
}

export function TaskForm({ members, loading = false, error, onSubmit }: Props) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      emoji: "✅",
      dueDate: "",
      dueTime: "",
      priority: "medium",
      assigneeId: "",
    },
  });

  const priority = watch("priority");
  const assigneeId = watch("assigneeId");

  useEffect(() => {
    const firstProfileId = members.map(getProfile).find(Boolean)?.id;
    const assigneeExists = members.some(
      (member) => getProfile(member)?.id === assigneeId
    );

    if (firstProfileId && !assigneeExists) {
      setValue("assigneeId", firstProfileId, { shouldValidate: true });
    }
  }, [assigneeId, members, setValue]);

  return (
    <View className="gap-4">
      <View className="rounded-2xl bg-white p-4 border border-border gap-4">
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Назва задачі"
              value={value}
              onChangeText={onChange}
              placeholder="Наприклад, прибрати кімнату"
              error={errors.title?.message}
              icon={(color) => (
                <Feather name="check-square" size={18} color={color} />
              )}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Опис"
              value={value}
              onChangeText={onChange}
              placeholder="Додайте коротку підказку"
              error={errors.description?.message}
              multiline
              icon={(color) => (
                <Feather name="align-left" size={18} color={color} />
              )}
            />
          )}
        />
      </View>

      <Controller
        control={control}
        name="emoji"
        render={({ field: { onChange, value } }) => (
          <EmojiPicker value={value} onChange={onChange} />
        )}
      />

      <View className="rounded-2xl bg-white p-4 border border-border gap-4">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Controller
              control={control}
              name="dueDate"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Дата"
                  value={value}
                  onChangeText={onChange}
                  placeholder="2026-05-10"
                  keyboardType="numbers-and-punctuation"
                  error={errors.dueDate?.message}
                  icon={(color) => (
                    <Feather name="calendar" size={18} color={color} />
                  )}
                />
              )}
            />
          </View>

          <View className="flex-1">
            <Controller
              control={control}
              name="dueTime"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Час"
                  value={value}
                  onChangeText={onChange}
                  placeholder="18:00"
                  keyboardType="numbers-and-punctuation"
                  error={errors.dueTime?.message}
                  icon={(color) => (
                    <Feather name="clock" size={18} color={color} />
                  )}
                />
              )}
            />
          </View>
        </View>
      </View>

      <Controller
        control={control}
        name="priority"
        render={({ field: { onChange, value } }) => (
          <PrioritySelector value={value} onChange={onChange} />
        )}
      />

      <Controller
        control={control}
        name="assigneeId"
        render={({ field: { onChange, value } }) => (
          <AssigneeSelector
            members={members}
            value={value}
            onChange={onChange}
            error={errors.assigneeId?.message}
          />
        )}
      />

      <TaskXpSummary
        priority={priority}
        assigneeId={assigneeId}
        members={members}
      />

      {!!error && (
        <View className="rounded-2xl bg-danger-bg p-4 border border-danger">
          <Typo className="text-danger text-center">{error}</Typo>
        </View>
      )}

      <Button
        onPress={handleSubmit(onSubmit)}
        loading={loading}
        disabled={members.length === 0}
      >
        <Typo variant="h3" className="text-white">
          Створити задачу
        </Typo>
      </Button>
    </View>
  );
}
