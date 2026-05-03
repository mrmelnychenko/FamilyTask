import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';

export function HomeScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user as any);
    //   but we need types and delede type any
    });
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Error', error.message);
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
        <Text style={styles.label}>User email:</Text>
        <Text style={styles.value}>
          {user || 'Loading...'}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
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
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
})