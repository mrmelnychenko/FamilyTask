import { supabase } from '@/src/lib/supabase';
import { AUTH_ERRORS } from '@/src/utils/error';
import { Feather } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  View,
} from 'react-native';
import { Input } from '../Input';
import { Typo } from '../Typo';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { GoogleIcon } from '../../icons/GoogleIcon';
import { AuthSwitchLink } from './AuthSwitchLink';

export function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState<string | null>(null);
  
  
    useEffect(() => {
      setEmailError(null);
      setGeneralError(null);
    }, [email]);
  
    useEffect(() => {
      setPasswordError(null);
      setGeneralError(null);
    }, [password]);
  
    async function handleLogin() {
      let hasError = false;
  
      if (!email.trim()) {
        setEmailError("Email is required");
        hasError = true;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError("Invalid email format");
        hasError = true;
      }
  
      if (!password) {
        setPasswordError("Password is required");
        hasError = true;
      } else if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters");
        hasError = true;
      }
  
      if (hasError) return;
  
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
  
        if (supabaseError) {
          const message = AUTH_ERRORS[supabaseError.code || ''] || supabaseError.message || AUTH_ERRORS.default;
  
          if (supabaseError.code === 'invalid_credentials') {
            setEmailError(" ");
            setPasswordError(message);
          } else {
            setGeneralError(message);
          }

          return;
        }

        if (!data.user) {
          setGeneralError("Не вдалося отримати користувача");
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('family_id')
          .eq('id', data.user.id)
          .maybeSingle();

        router.replace((profile?.family_id ? '/home' : '/family-setup') as Href);
      } catch (err) {
        setGeneralError("Server error. Please try again later");
      } finally {
        setLoading(false);
      }
    }

    return (
        <View className="gap-4">

    <Input
      label="Email"
      error={emailError}
      value={email}
      placeholder="example@gmail.com"
      onChangeText={setEmail}
      autoCapitalize="none"
      icon={(color) => <Feather name="mail" size={18} color={color} />}
    />

    <Input
      label="Password"
      error={passwordError}
      value={password}
      placeholder="••••••••"
      onChangeText={setPassword}
      secureTextEntry
      icon={(color) => <Feather name="lock" size={18} color={color} />}
    />

    <Pressable
      className="self-end"
      onPress={() => router.push("/")}
    // onPress={() => router.push("/forgot-password")}
    >
      <Typo variant="h3" className="text-primary">
        Забули пароль?
      </Typo>
    </Pressable>

    {generalError && (
      <View className="bg-red-50 p-3 rounded-xl border border-red-100">
        <Typo className="text-danger text-center">{generalError}</Typo>
      </View>
    )}

    <Button onPress={handleLogin} disabled={loading}>
      <Typo variant="h3" className="text-white">
        {loading ? "Завантаження..." : "Увійти"}
      </Typo>
    </Button>

    <Divider />

    <Button
      className="bg-white border border-border"
      onPress={() => console.log("google login")}
    >
      <View className="flex-row items-center gap-2">
        <GoogleIcon width={18} height={18} />
        <Typo variant="h3" className="text-text">
          Увійти через Google
        </Typo>
      </View>
    </Button>

    <AuthSwitchLink
      text="Ще немає акаунту?"
      linkText="Зареєструватися"
      href="/register"
    />

  </View>
    )
}
