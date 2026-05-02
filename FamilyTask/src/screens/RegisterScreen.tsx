import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../lib/supabase';

export function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    try {
      if (!name.trim()) {
        Alert.alert('Помилка', 'Введи імʼя');
        return;
      }

      if (!email.trim()) {
        Alert.alert('Помилка', 'Введи email');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Помилка', 'Пароль має бути мінімум 6 символів');
        return;
      }

      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        Alert.alert('Помилка реєстрації', error.message);
        return;
      }

      if (!data.user) {
        Alert.alert('Помилка', 'Користувач не створився');
        return;
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name: name.trim(),
        avatar_emoji: '😊',
        role: 'parent',
      });

      if (profileError) {
        Alert.alert('Помилка профілю', profileError.message);
        return;
      }

      Alert.alert(
        'Успішно',
        'Акаунт створено. Перевір email, якщо Supabase просить підтвердження.'
      );
    } catch (error) {
      Alert.alert('Помилка', 'Сталася невідома помилка');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>FamilyTask</Text>
        <Text style={styles.subtitle}>Створи свій сімейний акаунт</Text>

        <TextInput
          style={styles.input}
          placeholder="Імʼя"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Зареєструватися</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#EDE9FE',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#A855F7',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});