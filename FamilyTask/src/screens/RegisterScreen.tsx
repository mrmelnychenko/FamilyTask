import { router } from 'expo-router';
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

  const [acceptedTerms, setAcceptedTerms] = useState(false);
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

      if (!acceptedTerms) {
        Alert.alert('Помилка', 'Потрібно погодитися з умовами використання');
        return;
      }

      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) {
        Alert.alert('Помилка реєстрації', error.message);
        return;
      }

      if (!data.user) {
        Alert.alert('Помилка', 'Користувач не створився');
        return;
      }

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
        <Text style={styles.title}>Реєстрація</Text>
        <Text style={styles.subtitle}>Створи акаунт безкоштовно</Text>

        <Text style={styles.label}>Імʼя</Text>
        <TextInput
          style={styles.input}
          placeholder="Олексій"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="oleksii@gmail.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Пароль</Text>
        <TextInput
          style={styles.input}
          placeholder="Мінімум 6 символів"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View style={[styles.checkbox, acceptedTerms && styles.checkboxActive]}>
            {acceptedTerms && <Text style={styles.checkboxText}>✓</Text>}
          </View>

          <Text style={styles.termsText}>
            Погоджуюсь з умовами використання
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Створити акаунт</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginLinkText}>Вже є акаунт? Увійти</Text>
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
  label: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 5,
    fontWeight: '600',
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#A855F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#A855F7',
  },
  checkboxText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  termsText: {
    fontSize: 13,
    color: '#6B7280',
  },
  button: {
    backgroundColor: '#A855F7',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '700',
  },
});