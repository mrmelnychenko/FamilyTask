import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/src/components/ui/Button';
import { Typo } from '@/src/components/ui/Typo';
import { supabase } from '@/src/lib/supabase';
import { cn } from '@/src/utils/cn';
import { colors } from '@/src/utils/colors';

type Priority = 'low' | 'medium' | 'high';

type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  avatar_emoji: string | null;
  family_id: string | null;
};

const EMOJI_OPTIONS = ['✅', '🧹', '📚', '🍽️', '🧺', '🐶', '🛒', '🌱'];

const PRIORITY_OPTIONS: {
  value: Priority;
  label: string;
  className: string;
}[] = [
  { value: 'low', label: 'Низький', className: 'bg-success-bg border-success' },
  { value: 'medium', label: 'Середній', className: 'bg-primary-light border-primary' },
  { value: 'high', label: 'Високий', className: 'bg-warning-bg border-warning' },
];

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function CreateTaskScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [members, setMembers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);

  const selectedAssignee = useMemo(
    () => members.find((member) => member.id === assigneeId) ?? null,
    [assigneeId, members]
  );

  useEffect(() => {
    loadTaskContext();
  }, []);

  async function loadTaskContext() {
    try {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        Alert.alert('Помилка', 'Не вдалося отримати користувача.');
        router.replace('/login');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_emoji, family_id')
        .eq('id', userData.user.id)
        .single();

      if (profileError || !profileData) {
        Alert.alert('Профіль не знайдено', 'Спочатку потрібно створити профіль.');
        return;
      }

      setProfile(profileData);

      if (!profileData.family_id) {
        Alert.alert('Сімʼю не знайдено', 'Спочатку потрібно створити або приєднатися до сімʼї.');
        return;
      }

      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_emoji, family_id')
        .eq('family_id', profileData.family_id)
        .order('name', { ascending: true });

      if (membersError) {
        Alert.alert('Помилка', 'Не вдалося завантажити членів сімʼї.');
        return;
      }

      const familyMembers = membersData ?? [];
      setMembers(familyMembers);
      setAssigneeId(familyMembers[0]?.id ?? profileData.id);
    } catch {
      Alert.alert('Помилка', 'Не вдалося завантажити дані для задачі.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask() {
    const trimmedTitle = title.trim();
    const trimmedDate = dueDate.trim();
    const trimmedTime = dueTime.trim();

    if (!profile?.family_id) {
      Alert.alert('Помилка', 'Спочатку потрібно створити або приєднатися до сімʼї.');
      return;
    }

    if (!trimmedTitle) {
      Alert.alert('Помилка', 'Введіть назву задачі.');
      return;
    }

    if (trimmedDate && !isValidDate(trimmedDate)) {
      Alert.alert('Помилка', 'Дата має бути у форматі РРРР-ММ-ДД.');
      return;
    }

    if (trimmedTime && !isValidTime(trimmedTime)) {
      Alert.alert('Помилка', 'Час має бути у форматі ГГ:ХХ.');
      return;
    }

    if (!assigneeId) {
      Alert.alert('Помилка', 'Оберіть виконавця задачі.');
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase.from('tasks').insert({
        family_id: profile.family_id,
        creator_id: profile.id,
        assignee_id: assigneeId,
        title: trimmedTitle,
        description: description.trim() || null,
        emoji,
        due_date: trimmedDate || null,
        due_time: trimmedTime || null,
        priority,
        status: 'todo',
        points_reward: priority === 'high' ? 15 : 10,
      });

      if (error) {
        Alert.alert('Помилка', 'Не вдалося створити задачу.');
        return;
      }

      Alert.alert('Успішно', 'Задачу створено.');
      router.back();
    } catch {
      Alert.alert('Помилка', 'Сталася невідома помилка.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-5">
        <ActivityIndicator size="large" color={colors.primary} />
        <Typo className="mt-3 text-muted">Завантажуємо дані...</Typo>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 18 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              className="h-11 w-11 items-center justify-center rounded-full bg-white border border-border"
            >
              <Feather name="arrow-left" size={20} color={colors.text} />
            </Pressable>

            <View className="flex-1">
              <Typo variant="h2">Нова задача</Typo>
              <Typo className="text-muted">Створіть завдання для сімʼї</Typo>
            </View>
          </View>

          {!profile?.family_id ? (
            <View className="rounded-2xl border border-warning bg-warning-bg p-4">
              <Typo variant="h3" className="text-text">
                Сімʼю ще не налаштовано
              </Typo>
              <Typo className="mt-1 text-muted">
                Після створення або приєднання до сімʼї тут можна буде додавати задачі.
              </Typo>
            </View>
          ) : (
            <>
              <View className="rounded-2xl bg-white p-4 border border-border gap-4">
                <FieldLabel text="Назва задачі" />
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Наприклад, прибрати кімнату"
                  placeholderTextColor={colors.light}
                  className="rounded-2xl border border-border bg-background px-4 py-3 text-text"
                  style={{ fontFamily: 'Nunito-Regular', fontSize: 15 }}
                />

                <FieldLabel text="Опис" />
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Додайте коротку підказку"
                  placeholderTextColor={colors.light}
                  multiline
                  className="min-h-24 rounded-2xl border border-border bg-background px-4 py-3 text-text"
                  style={{
                    fontFamily: 'Nunito-Regular',
                    fontSize: 15,
                    textAlignVertical: 'top',
                  }}
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
                        'h-12 w-12 items-center justify-center rounded-2xl border',
                        emoji === option ? 'border-primary bg-primary-light' : 'border-border bg-white'
                      )}
                    >
                      <Typo variant="h2">{option}</Typo>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="rounded-2xl bg-white p-4 border border-border gap-4">
                <View className="flex-row gap-3">
                  <View className="flex-1 gap-2">
                    <FieldLabel text="Дата" />
                    <TextInput
                      value={dueDate}
                      onChangeText={setDueDate}
                      placeholder="2026-05-07"
                      placeholderTextColor={colors.light}
                      keyboardType="numbers-and-punctuation"
                      className="rounded-2xl border border-border bg-background px-4 py-3 text-text"
                      style={{ fontFamily: 'Nunito-Regular', fontSize: 15 }}
                    />
                  </View>

                  <View className="flex-1 gap-2">
                    <FieldLabel text="Час" />
                    <TextInput
                      value={dueTime}
                      onChangeText={setDueTime}
                      placeholder="18:00"
                      placeholderTextColor={colors.light}
                      keyboardType="numbers-and-punctuation"
                      className="rounded-2xl border border-border bg-background px-4 py-3 text-text"
                      style={{ fontFamily: 'Nunito-Regular', fontSize: 15 }}
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
                        'flex-1 rounded-2xl border px-3 py-3 items-center',
                        priority === option.value ? option.className : 'border-border bg-white'
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
                  <Typo className="text-muted">У сімʼї поки немає учасників.</Typo>
                ) : (
                  <View className="gap-2">
                    {members.map((member) => {
                      const active = member.id === assigneeId;

                      return (
                        <Pressable
                          key={member.id}
                          onPress={() => setAssigneeId(member.id)}
                          className={cn(
                            'flex-row items-center gap-3 rounded-2xl border p-3',
                            active ? 'border-primary bg-primary-light' : 'border-border bg-white'
                          )}
                        >
                          <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
                            <Typo variant="h3">{member.avatar_emoji || '😊'}</Typo>
                          </View>

                          <View className="flex-1">
                            <Typo variant="h3">{member.name || 'Без імені'}</Typo>
                            <Typo variant="label" className="text-muted">
                              {member.email || 'Учасник сімʼї'}
                            </Typo>
                          </View>

                          {active && <Feather name="check-circle" size={20} color={colors.primary} />}
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>

              <View className="rounded-2xl bg-primary-light p-4 border border-primary">
                <Typo variant="h3" className="text-text">
                  Нагорода: {priority === 'high' ? 15 : 10} XP
                </Typo>
                <Typo className="mt-1 text-muted">
                  Виконавець: {selectedAssignee?.name || 'не обрано'}
                </Typo>
              </View>

              <Button onPress={handleCreateTask} loading={saving} disabled={members.length === 0}>
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
