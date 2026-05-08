import { supabase } from '@/src/lib/supabase';
import { getAuthError } from '@/src/utils/error';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  View,
} from 'react-native';

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormData, loginSchema } from '@/src/schemas/auth.schema';

import { Input } from '../Input';
import { Typo } from '../Typo';
import { Button } from '../Button';
import { Divider } from '../Divider';

import { GoogleIcon } from '../../icons/GoogleIcon';
import { AuthSwitchLink } from './AuthSwitchLink';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      setGeneralError(null);
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (error) {
        setGeneralError(getAuthError(error.message));
        return;
      }

    } catch {
      setGeneralError("Server error. Please try again later");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="gap-4">

      {/* EMAIL */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Email"
            value={value}
            onChangeText={onChange}
            placeholder="example@gmail.com"
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email?.message}
            icon={(color) => (
              <Feather name="mail" size={18} color={color} />
            )}
          />
        )}
      />

      {/* PASSWORD */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Password"
            value={value}
            onChangeText={onChange}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password?.message}
            icon={(color) => (
              <Feather name="lock" size={18} color={color} />
            )}
          />
        )}
      />

      {/* FORGOT PASSWORD */}
      <Pressable
        className="self-end"
        onPress={() => router.push("/")}
      >
        <Typo variant="label" className="text-primary">
          Forgot password?
        </Typo>
      </Pressable>

      {/* GENERAL ERROR */}
      {generalError && (
        <Typo className="text-danger text-center">
          {generalError}
        </Typo>
      )}

      {/* LOGIN BUTTON */}
      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        <Typo variant="h3" className="text-white">
          {loading ? "Loading..." : "Увійти"}
        </Typo>
      </Button>

      <Divider />

      {/* GOOGLE */}
      <Button
        className="bg-white border border-border"
        onPress={() => console.log("google")}
      >
        <View className="flex-row items-center gap-2">
          <GoogleIcon width={18} height={18} />

          <Typo variant="h3" className="text-text">
            Continue with Google
          </Typo>
        </View>
      </Button>

      <AuthSwitchLink
        text="Don't have an account?"
        linkText="Sign up"
        href="/register"
      />

    </View>
  );
}