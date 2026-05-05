import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button } from '../components/ui/Button';
import { Typo } from '../components/ui/Typo';
import { supabase } from '../lib/supabase';

export function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogin() {
    try {
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail) {
        Alert.alert('Помилка', 'Введи email');
        return;
      }

      if (!password.trim()) {
        Alert.alert('Помилка', 'Введи пароль');
        return;
      }

      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        Alert.alert('Помилка входу', 'Невірний email або пароль');
        return;
      }
    } catch {
      Alert.alert('Помилка', 'Щось пішло не так. Спробуй ще раз.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background justify-center px-5"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="bg-card rounded-2xl p-6 border-2 border-primary-light shadow-lg">
        <View className="flex flex-col items-center gap-2 mb-5">
          <Typo variant="h1">FamilyTask</Typo>
          <Typo variant="h2">Раді бачити тебе знову</Typo>
        </View>

        <TextInput
          className="bg-background border border-border rounded-xl px-4 py-4 text-base mb-3"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <TextInput
          className="bg-background border border-border rounded-xl px-4 py-4 text-base mb-3"
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title="Увійти"
          loading={loading}
          disabled={loading}
          onPress={handleLogin}
        />

        <TouchableOpacity className="mt-5 items-center">
          <Typo variant="body">Забули пароль?</Typo>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 items-center"
          onPress={() => router.push('/register')}
        >
          <Typo variant="body">Немає акаунту? Реєстрація</Typo>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}