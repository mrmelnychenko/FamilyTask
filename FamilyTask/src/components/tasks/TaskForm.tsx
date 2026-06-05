import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Pressable, ScrollView, Switch, View } from "react-native";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Typo } from "@/src/components/ui/Typo";

import {
  taskSchema,
  type TaskFormData,
} from "@/src/schemas/task.schema";
import type { FamilyMember } from "@/src/services/family-service";
import { cn } from "@/src/utils/cn";
import { TaskRecurrence } from "@/src/types/task";
import { format } from "date-fns";
import { Avatar } from "../ui/Avatar";
import { TASK_CATEGORIES, TASK_PRIORITIES } from "@/src/constants/tasks";
import { Chip } from "../ui/Chip";
import { useCurrentFamilyRole } from "@/src/hooks/useRole";

type Props = {
  members: FamilyMember[];
  currentUserId: string;
  loading?: boolean;
  error?: string | null;
  onSubmit: (data: TaskFormData) => void;
};

export function TaskForm({ members, currentUserId, loading, error, onSubmit }: Props) {
  console.log(members, '3333333333333')
  const { isAdmin, isOwner } = useCurrentFamilyRole()

const canAssignToOthers = isAdmin || isOwner

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

  const is_recurring = watch("is_recurring");
  const recurrence = watch("recurrence");
  const recurrence_days = watch("recurrence_days");
  const assigneeId = watch("assigneeId");

  const assignableMembers = canAssignToOthers
    ? members
    : members.filter((m) => m.profiles?.id === currentUserId);
  const WEEK_DAYS = [
    { label: "Пн", value: 1 },
    { label: "Вт", value: 2 },
    { label: "Ср", value: 3 },
    { label: "Чт", value: 4 },
    { label: "Пт", value: 5 },
    { label: "Сб", value: 6 },
    { label: "Нд", value: 0 },
  ];

  const toggleDay = (day: number) => {
    const current = recurrence_days ?? [];
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setValue("recurrence_days", next);
  };
console.log(assignableMembers, 'assignableMembersassignableMembers')
  return (
    <View className="gap-4">

      {/* ОСНОВНЕ */}
      <View className="rounded-2xl bg-white p-4 border border-border gap-4">
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
              icon={(color) => <Feather name="check-square" size={18} color={color} />}
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
              icon={(color) => <Feather name="align-left" size={18} color={color} />}
            />
          )}
        />
      </View>

      {/* ВИКОНАВЕЦЬ */}
      <View className="rounded-2xl bg-white p-4 border border-border gap-3">
        <Typo className="font-medium text-text">Виконавець</Typo>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {assignableMembers.map((member) => {
              const p = member.profiles;
              const isSelected = assigneeId === p?.id;
              return (
                <Pressable
                  key={member.id}
                  onPress={() => setValue("assigneeId", p?.id ?? "")}
                  className="items-center gap-1"
                >
                  <View className={cn(
                    "rounded-full p-0.5",
                    isSelected ? "border-4 border-primary" : "border-2 border-border opacity-60"
                  )}>
                    <Avatar
                      size={48}
                      name={p?.name ?? "?"}
                      avatarUrl={p?.avatar_url ?? undefined}
                    />
                  </View>
                  <Typo className={cn(
                    "text-[11px] font-bold",
                    isSelected ? "text-primary" : "text-muted"
                  )}>
                    {p?.id === currentUserId ? "Я" : p?.name}
                  </Typo>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        {errors.assigneeId && (
          <Typo className="text-danger text-xs ml-1">{errors.assigneeId.message}</Typo>
        )}
      </View>
      <View className="rounded-2xl bg-white p-4 border border-border gap-3">
        <Typo className="font-medium text-text">Категорія</Typo>
        <Controller
          control={control}
          name="category"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row flex-wrap gap-2">
              {TASK_CATEGORIES.map((cat) => {
                const isActive = value === cat.key;
                return (
                  <Chip
                    key={cat.key}
                    label={cat.label}
                    icon={cat.icon}
                    active={isActive}
                    onPress={() => onChange(cat.key)}
                  />
                );
              })}
            </View>
          )}
        />
      </View>

      {/* ПРІОРИТЕТ */}
      <View className="rounded-2xl bg-white p-4 border border-border gap-3">
        <Typo className="font-medium text-text">Пріоритет</Typo>
        <Controller
          control={control}
          name="priority"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row gap-2">
              {TASK_PRIORITIES.map((p) => {
                const isActive = value === p.key;
                return (
                  <Chip
                    key={p.key}
                    label={p.label}
                    active={isActive}
                    onPress={() => onChange(p.key)}
                  />
                );
              })}
            </View>
          )}
        />
      </View>
      {/* ПОВТОРЕННЯ */}
      <View className="rounded-2xl bg-white p-4 border border-border gap-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Typo className="font-medium text-text">Повторювана задача</Typo>
            <Typo className="text-muted text-[12px]">Щодня, щотижня або щомісяця</Typo>
          </View>
          <Controller
            control={control}
            name="is_recurring"
            render={({ field: { onChange, value } }) => (
              <Switch value={value} onValueChange={onChange} />
            )}
          />
        </View>

        {is_recurring && (
          <>
            <View className="flex-row gap-2">
              {(["daily", "weekly", "monthly"] as TaskRecurrence[]).map((r) => (
                <Pressable
                  key={r}
                  onPress={() => {
                    setValue("recurrence", r);
                    setValue("recurrence_days", []);
                  }}
                  className={cn(
                    "flex-1 py-2 items-center rounded-full border",
                    recurrence === r ? "bg-primary border-primary" : "bg-white border-border"
                  )}
                >
                  <Typo className={cn(
                    "text-[12px] font-bold",
                    recurrence === r ? "text-white" : "text-muted"
                  )}>
                    {r === "daily" ? "Щодня" : r === "weekly" ? "Щотижня" : "Щомісяця"}
                  </Typo>
                </Pressable>
              ))}
            </View>

            {recurrence === "weekly" && (
              <View>
                <Typo className="text-muted text-[12px] mb-2">Оберіть дні</Typo>
                <View className="flex-row gap-2">
                  {WEEK_DAYS.map((d) => {
                    const isActive = recurrence_days?.includes(d.value);
                    return (
                      <Pressable
                        key={d.value}
                        onPress={() => toggleDay(d.value)}
                        className={cn(
                          "flex-1 py-2 items-center rounded-full border",
                          isActive ? "bg-primary border-primary" : "bg-white border-border"
                        )}
                      >
                        <Typo className={cn(
                          "text-[11px] font-bold",
                          isActive ? "text-white" : "text-muted"
                        )}>
                          {d.label}
                        </Typo>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {/* ДАТА І ЧАС */}
      {!is_recurring && (
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
                    placeholder="2026-05-19"
                    keyboardType="numbers-and-punctuation"
                    error={errors.dueDate?.message}
                    icon={(color) => <Feather name="calendar" size={18} color={color} />}
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
                    icon={(color) => <Feather name="clock" size={18} color={color} />}
                  />
                )}
              />
            </View>
          </View>
        </View>
      )}

      {/* ОШИБКА */}
      {error && (
        <View className="rounded-2xl bg-danger-bg p-4 border border-danger">
          <Typo className="text-danger text-center">{error}</Typo>
        </View>
      )}

      {/* КНОПКА */}
      <Button onPress={handleSubmit(onSubmit)} loading={loading}>
        <Typo variant="h3" className="text-white">Створити задачу</Typo>
      </Button>

    </View>
  );
}