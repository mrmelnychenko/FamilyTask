import { supabase } from '@/src/lib/supabase';
import { Href, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HomeUser = {
  email?: string;
};

export function HomeScreen() {
  const [user, setUser] = useState<HomeUser | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      Alert.alert('Помилка', 'Не вдалося завантажити користувача.');
      return;
    }

    setUser(data.user);
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Помилка', 'Не вдалося вийти з акаунта.');
      return;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home</Text>

      <Text style={styles.subtitle}>
        Welcome 👋
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email користувача:</Text>
        <Text style={styles.value}>
          {user?.email || 'Завантаження...'}
        </Text>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={() => router.push('/(protected)/create-task' as Href)}>
        <Text style={styles.buttonText}>Створити задачу</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Вийти</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  label: {
    color: '#6B7280',
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#EF4444',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#A855F7',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
})
