import { supabase } from "@/src/lib/supabase";
import { RegisterFormData, registerSchema } from "@/src/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Input } from "../Input";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { GoogleIcon } from "../../icons/GoogleIcon";
import { AuthSwitchLink } from "./AuthSwitchLink";
import { Divider } from "../Divider";
import { getRegisterError } from "@/src/utils/auth-error";

export function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState<string | null>(null);
  
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
      },
    });
  
    async function onSubmit(data: RegisterFormData) {
      try {
        setGeneralError(null);
        setLoading(true);
  
        const { error } = await supabase.auth.signUp({
          email: data.email.trim().toLowerCase(),
          password: data.password,
  
          options: {
            data: {
              name: data.name,
            },
          },
        });
  
        if (error) {
          setGeneralError(getRegisterError(error.message));
          return;
        }
  
        router.replace("/(protected)/(family)");
  
      } catch {
        setGeneralError("Server error. Please try again later");
      } finally {
        setLoading(false);
      }
    }
  
    return (
      <View className="gap-4">
  
        {/* NAME */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Name"
              value={value}
              onChangeText={onChange}
              placeholder="John"
              error={errors.name?.message}
              icon={(color) => (
                <Feather name="user" size={18} color={color} />
              )}
            />
          )}
        />
  
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
  
        {/* GENERAL ERROR */}
        {generalError && (
          <Typo className="text-danger text-center">
            {generalError}
          </Typo>
        )}
  
        {/* REGISTER BUTTON */}
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          <Typo variant="h3" className="text-white">
            {loading ? "Loading..." : "Create account"}
          </Typo>
        </Button>
  
        <Divider text="або продовжити через"/>
  
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
          text="Already have an account?"
          linkText="Sign in"
          href="/login"
        />
      </View>
    );
  }