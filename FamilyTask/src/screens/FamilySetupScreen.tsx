import { Feather } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
import { useAuth } from '@/src/hooks/useAuth';
import { supabase } from '@/src/lib/supabase';
import { cn } from '@/src/utils/cn';
import { colors } from '@/src/utils/colors';

type SetupMode = 'create' | 'join';

type Invite = {
  family_id: string;
  email: string | null;
  status: string | null;
};

type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_emoji: string | null;
  role: string | null;
  family_id: string | null;
};

export function FamilySetupScreen() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [localProfile, setLocalProfile] = useState<Profile | null>(profile);
  const [profileReady, setProfileReady] = useState(false);
  const [mode, setMode] = useState<SetupMode>('create');
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const activeProfile = profile ?? localProfile;

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const ensureProfile = useCallback(async () => {
    if (!user) {
      setProfileReady(true);
      return;
    }

    try {
      setProfileReady(false);

      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('id, email, name, avatar_emoji, role, family_id')
        .eq('id', user.id)
        .maybeSingle();

      if (selectError) {
        Alert.alert('Помилка', 'Не вдалося завантажити профіль.');
        return;
      }

      if (existingProfile) {
        setLocalProfile(existingProfile);
        return;
      }

      const fallbackName =
        typeof user.user_metadata?.name === 'string' && user.user_metadata.name.trim()
          ? user.user_metadata.name.trim()
          : user.email?.split('@')[0] || 'New User';

      const { data: createdProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email ?? null,
          name: fallbackName,
          avatar_emoji: '😊',
          role: 'MEMBER',
        })
        .select('id, email, name, avatar_emoji, role, family_id')
        .single();

      if (insertError || !createdProfile) {
        Alert.alert('Помилка', 'Не вдалося створити профіль користувача.');
        return;
      }

      setLocalProfile(createdProfile);
      await refreshProfile();
    } finally {
      setProfileReady(true);
    }
  }, [refreshProfile, user]);

  useEffect(() => {
    ensureProfile();
  }, [ensureProfile]);

  async function handleCreateFamily() {
    const trimmedName = familyName.trim();

    if (!user) {
      Alert.alert('Помилка', 'Потрібно увійти в акаунт.');
      return;
    }

    if (!activeProfile) {
      Alert.alert('Профіль не готовий', 'Зачекайте кілька секунд і спробуйте ще раз.');
      return;
    }

    if (!trimmedName) {
      Alert.alert('Помилка', 'Введіть назву сімʼї.');
      return;
    }

    try {
      setLoading(true);

      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({
          name: trimmedName,
          created_by: activeProfile.id,
        })
        .select('id')
        .single();

      if (familyError || !family) {
        Alert.alert('Помилка', 'Не вдалося створити сімʼю.');
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ family_id: family.id })
        .eq('id', activeProfile.id);

      if (profileError) {
        Alert.alert('Помилка', 'Сімʼю створено, але не вдалося оновити профіль.');
        return;
      }

      await refreshProfile();
      Alert.alert('Успішно', 'Сімʼю створено.');
      router.replace('/(protected)/home' as Href);
    } catch {
      Alert.alert('Помилка', 'Сталася невідома помилка.');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinFamily() {
    const normalizedCode = inviteCode.trim();

    if (!user) {
      Alert.alert('Помилка', 'Потрібно увійти в акаунт.');
      return;
    }

    if (!activeProfile) {
      Alert.alert('Профіль не готовий', 'Зачекайте кілька секунд і спробуйте ще раз.');
      return;
    }

    if (!normalizedCode) {
      Alert.alert('Помилка', 'Введіть код запрошення.');
      return;
    }

    try {
      setLoading(true);

      const { data: invite, error: inviteError } = await supabase
        .from('invites')
        .select('family_id, email, status')
        .eq('invite_code', normalizedCode)
        .maybeSingle<Invite>();

      if (inviteError || !invite) {
        Alert.alert('Помилка', 'Запрошення з таким кодом не знайдено.');
        return;
      }

      if (invite.status && invite.status !== 'pending') {
        Alert.alert('Помилка', 'Це запрошення вже неактивне.');
        return;
      }

      if (invite.email && activeProfile.email && invite.email.toLowerCase() !== activeProfile.email.toLowerCase()) {
        Alert.alert('Помилка', 'Цей код запрошення створено для іншого email.');
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ family_id: invite.family_id })
        .eq('id', activeProfile.id);

      if (profileError) {
        Alert.alert('Помилка', 'Не вдалося приєднатися до сімʼї.');
        return;
      }

      await supabase
        .from('invites')
        .update({ status: 'accepted' })
        .eq('invite_code', normalizedCode);

      await refreshProfile();
      Alert.alert('Успішно', 'Ви приєдналися до сімʼї.');
      router.replace('/(protected)/home' as Href);
    } catch {
      Alert.alert('Помилка', 'Сталася невідома помилка.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center gap-5">
            <View className="items-center gap-3">
              <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary">
                <Feather name="users" size={34} color="white" />
              </View>

              <Typo variant="h1" className="text-center">
                Налаштуй сімʼю
              </Typo>

              <Typo variant="h3" className="text-center text-muted">
                Створіть сімейний простір або приєднайтесь за кодом запрошення.
              </Typo>
            </View>

            <View className="flex-row rounded-full bg-white p-1 border border-border">
              <ModeButton
                active={mode === 'create'}
                label="Створити"
                onPress={() => setMode('create')}
              />
              <ModeButton
                active={mode === 'join'}
                label="Приєднатися"
                onPress={() => setMode('join')}
              />
            </View>

            <View className="rounded-3xl bg-white p-5 border border-border gap-4">
              {!profileReady && (
                <View className="flex-row items-center gap-2 rounded-2xl bg-primary-light p-3">
                  <ActivityIndicator color={colors.primary} />
                  <Typo className="text-muted">Готуємо профіль...</Typo>
                </View>
              )}

              {mode === 'create' ? (
                <>
                  <View>
                    <Typo variant="h2">Створити сімʼю</Typo>
                    <Typo className="mt-1 text-muted">
                      Назвіть свій сімейний простір. Наприклад, “Сімʼя Мельниченко”.
                    </Typo>
                  </View>

                  <View className="gap-2">
                    <Typo variant="label" className="uppercase text-muted">
                      Назва сімʼї
                    </Typo>
                    <TextInput
                      value={familyName}
                      onChangeText={setFamilyName}
                      placeholder="Сімʼя Олексія"
                      placeholderTextColor={colors.light}
                      className="rounded-2xl border border-border bg-background px-4 py-3 text-text"
                      style={{ fontFamily: 'Nunito-Regular', fontSize: 15 }}
                    />
                  </View>

                  <Button onPress={handleCreateFamily} loading={loading} disabled={!profileReady}>
                    <Typo variant="h3" className="text-white">
                      Створити сімʼю
                    </Typo>
                  </Button>
                </>
              ) : (
                <>
                  <View>
                    <Typo variant="h2">Приєднатися</Typo>
                    <Typo className="mt-1 text-muted">
                      Введіть код запрошення, який вам надіслали.
                    </Typo>
                  </View>

                  <View className="gap-2">
                    <Typo variant="label" className="uppercase text-muted">
                      Код запрошення
                    </Typo>
                    <TextInput
                      value={inviteCode}
                      onChangeText={setInviteCode}
                      placeholder="ABC123"
                      placeholderTextColor={colors.light}
                      autoCapitalize="characters"
                      className="rounded-2xl border border-border bg-background px-4 py-3 text-text"
                      style={{ fontFamily: 'Nunito-Regular', fontSize: 15 }}
                    />
                  </View>

                  <Button onPress={handleJoinFamily} loading={loading} disabled={!profileReady}>
                    <Typo variant="h3" className="text-white">
                      Приєднатися до сімʼї
                    </Typo>
                  </Button>
                </>
              )}
            </View>

            {profileReady && !activeProfile && (
              <View className="rounded-2xl border border-warning bg-warning-bg p-4">
                <Typo variant="h3">Профіль ще не створено</Typo>
                <Typo className="mt-1 text-muted">
                  Створення сімʼї стане доступним після появи запису в profiles.
                </Typo>
              </View>
            )}

            <Pressable
              onPress={signOut}
              disabled={loading}
              className="self-center px-4 py-2"
            >
              {loading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Typo variant="h3" className="text-muted">
                  Вийти з акаунта
                </Typo>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ModeButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-1 items-center rounded-full px-4 py-3',
        active ? 'bg-primary' : 'bg-transparent'
      )}
    >
      <Typo variant="h3" className={active ? 'text-white' : 'text-muted'}>
        {label}
      </Typo>
    </Pressable>
  );
}
