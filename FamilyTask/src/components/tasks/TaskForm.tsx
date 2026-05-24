import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Switch, View } from "react-native";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Typo } from "@/src/components/ui/Typo";
import { TASK_CATEGORIES } from "@/src/constants/tasks";
import { taskSchema, type TaskFormData } from "@/src/schemas/task.schema";
import type { FamilyMember } from "@/src/services/family-service";
import type { TaskRecurrence } from "@/src/types/task";
import { cn } from "@/src/utils/cn";
import { AssigneeSelector } from "./AssigneeSelector";
import { PrioritySelector } from "./PrioritySelector";
import { TaskXpSummary } from "./TaskXpSummary";

const WEEK_DAYS = [
  { label: "Пн", value: 1 },
  { label: "Вт", value: 2 },
  { label: "Ср", value: 3 },
  { label: "Чт", value: 4 },
  { label: "Пт", value: 5 },
  { label: "Сб", value: 6 },
  { label: "Нд", value: 0 },
];

const RECURRENCE_OPTIONS: { key: TaskRecurrence; label: string }[] = [
  { key: "daily", label: "Щодня" },
  { key: "weekly", label: "Щотижня" },
  { key: "monthly", label: "Щомісяця" },
];

type Props = {
  members: FamilyMember[];
  currentUserId: string;
  canAssignToOthers: boolean;
  loading?: boolean;
  error?: string | null;
  onSubmit: (data: TaskFormData) => void;
};

export function TaskForm({
  members,
  currentUserId,
  canAssignToOthers,
  loading,
  error,
  onSubmit,
}: Props) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      priority: "normal",
      category: "other",
      description: "",
      assigneeId: currentUserId,
      dueDate: format(new Date(), "yyyy-MM-dd"),
      dueTime: "23:59",
      is_recurring: false,
      recurrence: null,
      recurrence_days: [],
    },
  });

  const isRecurring = watch("is_recurring");
  const recurrence = watch("recurrence");
  const recurrenceDays = watch("recurrence_days");
  const assigneeId = watch("assigneeId");
  const priority = watch("priority");

  const assignableMembers = canAssignToOthers
    ? members
    : members.filter((member) => member.profiles?.id === currentUserId);

  const toggleDay = (day: number) => {
    const current = recurrenceDays ?? [];
    const next = current.includes(day)
      ? current.filter((selectedDay) => selectedDay !== day)
      : [...current, day];

    setValue("recurrence_days", next);
  };

  return (
    <View className="gap-4">
      <View className="gap-4 rounded-2xl border border-border bg-white p-4">
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Назва"
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
              label="Опис (необовʼязково)"
              value={value}
              onChangeText={onChange}
              placeholder="Коротка підказка"
              error={errors.description?.message}
              icon={(color) => (
                <Feather name="align-left" size={18} color={color} />
              )}
            />
          )}
        />
      </View>

      <Controller
        control={control}
        name="assigneeId"
        render={({ field: { onChange, value } }) => (
          <AssigneeSelector
            members={assignableMembers}
            value={value}
            error={errors.assigneeId?.message}
            onChange={onChange}
          />
        )}
      />

      <View className="gap-3 rounded-2xl border border-border bg-white p-4">
        <Typo className="font-medium text-text">Категорія</Typo>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row flex-wrap gap-2">
              {TASK_CATEGORIES.map((category) => {
                const isActive = value === category.key;

                return (
                  <Pressable
                    key={category.key}
                    onPress={() => onChange(category.key)}
                    className={cn(
                      "flex-row items-center gap-1.5 rounded-full border px-3 py-2",
                      isActive
                        ? "border-primary bg-primary"
                        : "border-border bg-white"
                    )}
                  >
                    <Typo className="text-[13px]">{category.emoji}</Typo>
                    <Typo
                      className={cn(
                        "text-[12px] font-bold",
                        isActive ? "text-white" : "text-muted"
                      )}
                    >
                      {category.label}
                    </Typo>
                  </Pressable>
                );
              })}
            </View>
          )}
        />
      </View>

      <Controller
        control={control}
        name="priority"
        render={({ field: { onChange, value } }) => (
          <PrioritySelector value={value} onChange={onChange} />
        )}
      />

      <TaskXpSummary
        priority={priority}
        assigneeId={assigneeId}
        members={assignableMembers}
      />

      <View className="gap-4 rounded-2xl border border-border bg-white p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Typo className="font-medium text-text">Повторювана задача</Typo>
            <Typo className="text-[12px] text-muted">
              Щодня, щотижня або щомісяця
            </Typo>
          </View>

          <Controller
            control={control}
            name="is_recurring"
            render={({ field: { onChange, value } }) => (
              <Switch value={value} onValueChange={onChange} />
            )}
          />
        </View>

        {isRecurring ? (
          <>
            <View className="flex-row gap-2">
              {RECURRENCE_OPTIONS.map((option) => (
                <Pressable
                  key={option.key}
                  onPress={() => {
                    setValue("recurrence", option.key);
                    setValue("recurrence_days", []);
                  }}
                  className={cn(
                    "flex-1 items-center rounded-full border py-2",
                    recurrence === option.key
                      ? "border-primary bg-primary"
                      : "border-border bg-white"
                  )}
                >
                  <Typo
                    className={cn(
                      "text-[12px] font-bold",
                      recurrence === option.key ? "text-white" : "text-muted"
                    )}
                  >
                    {option.label}
                  </Typo>
                </Pressable>
              ))}
            </View>

            {recurrence === "weekly" ? (
              <View>
                <Typo className="mb-2 text-[12px] text-muted">
                  Оберіть дні
                </Typo>
                <View className="flex-row gap-2">
                  {WEEK_DAYS.map((day) => {
                    const isActive = recurrenceDays?.includes(day.value);

                    return (
                      <Pressable
                        key={day.value}
                        onPress={() => toggleDay(day.value)}
                        className={cn(
                          "flex-1 items-center rounded-full border py-2",
                          isActive
                            ? "border-primary bg-primary"
                            : "border-border bg-white"
                        )}
                      >
                        <Typo
                          className={cn(
                            "text-[11px] font-bold",
                            isActive ? "text-white" : "text-muted"
                          )}
                        >
                          {day.label}
                        </Typo>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </>
        ) : null}
      </View>

      {!isRecurring ? (
        <View className="gap-4 rounded-2xl border border-border bg-white p-4">
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
                    placeholder="2026-05-24"
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
                    placeholder="23:59"
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
      ) : null}

      {error ? (
        <View className="rounded-2xl border border-danger bg-danger-bg p-4">
          <Typo className="text-center text-danger">{error}</Typo>
        </View>
      ) : null}

      <Button onPress={handleSubmit(onSubmit)} loading={loading}>
        <Typo variant="h3" className="text-white">
          Створити задачу
        </Typo>
      </Button>
    </View>
  );
}
