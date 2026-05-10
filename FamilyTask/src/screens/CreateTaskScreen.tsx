import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { LoadingScreen } from "@/src/components/ui/LoadingScreen";
import { Typo } from "@/src/components/ui/Typo";
import { useAuth } from "@/src/hooks/useAuth";
import { useCurrentFamily } from "@/src/hooks/queries/useFamily";
import { useProfile } from "@/src/hooks/queries/useProfile";
import { useCreateTask, useTaskMembers } from "@/src/hooks/queries/useTasks";
import { cn } from "@/src/utils/cn";
import { colors } from "@/src/utils/colors";

type Priority = "low" | "medium" | "high";

const EMOJI_OPTIONS = ["✅", "🧹", "📚", "🍽️", "🧺", "🐶", "🛒", "🌱"];

const PRIORITY_OPTIONS: {
  value: Priority;
  label: string;
  className: string;
}[] = [
  { value: "low", label: "Низький", className: "bg-success-bg border-success" },
  {
    value: "medium",
    label: "Середній",
    className: "bg-primary-light border-primary",
  },
  { value: "high", label: "Високий", className: "bg-warning-bg border-warning" },
];

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

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
  const { data: members = [], isLoading: areMembersLoading } =
    useTaskMembers(familyId);
  const createTask = useCreateTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);

  const selectedAssignee = useMemo(
    () => members.find((member) => member.id === assigneeId) ?? null,
    [assigneeId, members]
  );

  useEffect(() => {
    const assigneeExists = members.some((member) => member.id === assigneeId);

    if (members.length > 0 && !assigneeExists) {
      setAssigneeId(members[0].id);
    }
  }, [assigneeId, members]);

  async function handleCreateTask() {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedDate = dueDate.trim();
    const trimmedTime = dueTime.trim();

    if (!familyId) {
      Alert.alert(
        "Помилка",
        "Спочатку потрібно створити або приєднатися до сімʼї."
      );
      return;
    }

    if (!profile?.id) {
      Alert.alert("Помилка", "Не вдалося завантажити профіль.");
      return;
    }

    if (!trimmedTitle) {
      Alert.alert("Помилка", "Введіть назву задачі.");
      return;
    }

    if (trimmedDate && !isValidDate(trimmedDate)) {
      Alert.alert("Помилка", "Дата має бути у форматі РРРР-ММ-ДД.");
      return;
    }

    if (trimmedTime && !isValidTime(trimmedTime)) {
      Alert.alert("Помилка", "Час має бути у форматі ГГ:ХХ.");
      return;
    }

    if (!assigneeId) {
      Alert.alert("Помилка", "Оберіть виконавця задачі.");
      return;
    }

    try {
      await createTask.mutateAsync({
        familyId,
        creatorId: profile.id,
        assigneeId,
        title: trimmedTitle,
        description: trimmedDescription || null,
        emoji,
        dueDate: trimmedDate || null,
        dueTime: trimmedTime || null,
        priority,
      });

      Alert.alert("Успішно", "Задачу створено.");
      goBackOrHome();
    } catch (error) {
      console.log("createTask error:", error);
      Alert.alert("Помилка", "Не вдалося створити задачу.");
    }
  }

  const loading = isProfileLoading || isFamilyLoading || areMembersLoading;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 18 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
            <>
              <View className="rounded-2xl bg-white p-4 border border-border gap-4">
                <Input
                  label="Назва задачі"
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Наприклад, прибрати кімнату"
                  icon={(color) => (
                    <Feather name="check-square" size={18} color={color} />
                  )}
                />

                <Input
                  label="Опис"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Додайте коротку підказку"
                  multiline
                  icon={(color) => (
                    <Feather name="align-left" size={18} color={color} />
                  )}
                />
              </View>

              <View className="rounded-2xl bg-white p-4 border border-border gap-3">
                <FieldLabel text="Emoji" />
                <View className="flex-row flex-wrap gap-2">
                  {EMOJI_OPTIONS.map((option) => (
                    <Pressable
                      key={option}
                      onPress={() => setEmoji(option)}
                      className={cn(
                        "h-12 w-12 items-center justify-center rounded-2xl border",
                        emoji === option
                          ? "border-primary bg-primary-light"
                          : "border-border bg-white"
                      )}
                    >
                      <Typo variant="h2">{option}</Typo>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="rounded-2xl bg-white p-4 border border-border gap-4">
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Input
                      label="Дата"
                      value={dueDate}
                      onChangeText={setDueDate}
                      placeholder="2026-05-10"
                      keyboardType="numbers-and-punctuation"
                      icon={(color) => (
                        <Feather name="calendar" size={18} color={color} />
                      )}
                    />
                  </View>

                  <View className="flex-1">
                    <Input
                      label="Час"
                      value={dueTime}
                      onChangeText={setDueTime}
                      placeholder="18:00"
                      keyboardType="numbers-and-punctuation"
                      icon={(color) => (
                        <Feather name="clock" size={18} color={color} />
                      )}
                    />
                  </View>
                </View>
              </View>

              <View className="rounded-2xl bg-white p-4 border border-border gap-3">
                <FieldLabel text="Пріоритет" />
                <View className="flex-row gap-2">
                  {PRIORITY_OPTIONS.map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() => setPriority(option.value)}
                      className={cn(
                        "flex-1 rounded-2xl border px-3 py-3 items-center",
                        priority === option.value
                          ? option.className
                          : "border-border bg-white"
                      )}
                    >
                      <Typo variant="h3" className="text-text">
                        {option.label}
                      </Typo>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="rounded-2xl bg-white p-4 border border-border gap-3">
                <FieldLabel text="Виконавець" />

                {members.length === 0 ? (
                  <Typo className="text-muted">
                    У сімʼї поки немає учасників.
                  </Typo>
                ) : (
                  <View className="gap-2">
                    {members.map((member) => {
                      const active = member.id === assigneeId;

                      return (
                        <Pressable
                          key={member.id}
                          onPress={() => setAssigneeId(member.id)}
                          className={cn(
                            "flex-row items-center gap-3 rounded-2xl border p-3",
                            active
                              ? "border-primary bg-primary-light"
                              : "border-border bg-white"
                          )}
                        >
                          <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                            <Typo variant="h3">
                              {member.avatar_emoji || "😊"}
                            </Typo>
                          </View>

                          <View className="flex-1">
                            <Typo variant="h3">
                              {member.name || "Без імені"}
                            </Typo>
                            <Typo variant="label" className="text-muted">
                              {member.email || "Учасник сімʼї"}
                            </Typo>
                          </View>

                          {active && (
                            <Feather
                              name="check-circle"
                              size={20}
                              color={colors.primary}
                            />
                          )}
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>

              <View className="rounded-2xl bg-primary-light p-4 border border-primary">
                <Typo variant="h3" className="text-text">
                  Нагорода: {priority === "high" ? 15 : 10} XP
                </Typo>
                <Typo className="mt-1 text-muted">
                  Виконавець: {selectedAssignee?.name || "не обрано"}
                </Typo>
              </View>

              <Button
                onPress={handleCreateTask}
                loading={createTask.isPending}
                disabled={members.length === 0}
              >
                <Typo variant="h3" className="text-white">
                  Створити задачу
                </Typo>
              </Button>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FieldLabel({ text }: { text: string }) {
  return (
    <Typo variant="label" className="uppercase text-muted">
      {text}
    </Typo>
  );
}
