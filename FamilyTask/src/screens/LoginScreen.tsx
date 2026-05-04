import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Typo } from '../components/ui/Typo';


export function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function handleLogin() {
    try {
      if (!email.trim()) {
        Alert.alert('Error', 'Please enter your email');
        return;
      }
  
      if (!password.trim()) {
        Alert.alert('Error', 'Please enter your password');
        return;
      }
  
      setLoading(true);
  
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
  
      if (error) {
        Alert.alert('Login failed', error.message);
        return;
      }
  
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
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

        <View className='flex flex-col items-center gap-2 mb-3'>
          <Typo variant='h1'>
            FamilyTask
          </Typo>

          <Typo variant='h2'>
            Раді бачити тебе знову
          </Typo>
        </View>

        {/* EMAIL */}
        <TextInput
          className="bg-background border border-border rounded-xl px-4 py-4 text-base mb-3"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* PASSWORD */}
        <TextInput
          className="bg-background border border-border rounded-xl px-4 py-4 text-base mb-3"
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* BUTTON */}
        <Button
          title="Увійти"
          loading={loading}
          disabled={loading}
          onPress={handleLogin}
        />

        {/* FORGOT PASSWORD */}
        <TouchableOpacity className="mt-5 items-center">
          <Typo variant='body'>
            Забули пароль?
          </Typo>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}