import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/src/components/ui/Button";
import { Typo } from "@/src/components/ui/Typo";
import { Input } from "@/src/components/ui/Input";

import { useAuth } from "@/src/hooks/useAuth";
import { useProfile } from "@/src/hooks/queries/useProfile";
import { useCreateFamily } from "../hooks/queries/useFamily";

import { cn } from "@/src/utils/cn";
import { colors } from "@/src/utils/colors";
import { getFamilyError } from "../utils/family-error";

import {
  createFamilySchema,
  CreateFamilyForm,
} from "../schemas/family.schema";

export function FamilySetupScreen() {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);

  const createFamily = useCreateFamily();
  // const joinFamily = useJoinFamily();

  const [mode, setMode] = useState<"create" | "join">("create");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFamilyForm>({
    resolver: zodResolver(createFamilySchema),
    defaultValues: {
      name: "",
    },
  });

  async function handleCreateFamily(data: CreateFamilyForm) {
    if (!user) return;

    setError(null);

    try {
      await createFamily.mutateAsync({
        name: data.name,
        userId: user.id,
      });

      router.replace('/home');
    } catch (e: any) {
      setError(getFamilyError(e?.message));
    }
  }

  // async function handleJoinFamily() {
  //   if (!user) return;

  //   try {
  //     await joinFamily.mutateAsync({
  //       inviteCode: inviteCode.trim(),
  //       userId: user.id,
  //       email: profile?.email,
  //     });

  //     router.replace("/(protected)/home");
  //   } catch (e: any) {
  //     setError(getFamilyError(e?.message));
  //   }
  // }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 16,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center gap-5">

            {/* HEADER */}
            <View className="items-center gap-3">
              <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary">
                <Feather name="users" size={34} color="white" />
              </View>

              <Typo variant="h1" className="text-center">
                Налаштуй сімʼю
              </Typo>

              <Typo variant="h3" className="text-center text-muted">
                Створіть або приєднайтесь до сімʼї
              </Typo>
            </View>

            {/* MODE SWITCH */}
            <View className="flex-row rounded-full bg-white p-1 border border-border">
              <ModeButton
                active={mode === "create"}
                label="Створити"
                onPress={() => setMode("create")}
              />
              <ModeButton
                active={mode === "join"}
                label="Приєднатися"
                onPress={() => setMode("join")}
              />
            </View>

            {/* CONTENT */}
            <View className="rounded-3xl bg-white p-5 border border-border gap-4">

              {/* LOADING */}
              {isLoading && (
                <View className="flex-row items-center gap-2 p-3 rounded-2xl bg-primary-light">
                  <ActivityIndicator color={colors.primary} />
                  <Typo className="text-muted">Завантаження...</Typo>
                </View>
              )}

              {/* NO PROFILE */}
              {!profile && !isLoading && (
                <Typo className="text-danger">
                  Профіль не знайдено
                </Typo>
              )}

              {/* ERROR */}
              {error && (
                <View className="p-3 rounded-2xl bg-red-50 border border-danger">
                  <Typo className="text-danger text-center">
                    {error}
                  </Typo>
                </View>
              )}

              {/* CREATE */}
              {mode === "create" ? (
                <>
                  <Typo variant="h2">Створити сімʼю</Typo>

                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        label="Назва сімʼї"
                        value={value}
                        onChangeText={onChange}
                        placeholder="Наприклад: Family Smith"
                        icon={(color) => (
                          <Feather name="home" size={18} color={color} />
                        )}
                        error={errors.name?.message}
                      />
                    )}
                  />

                  <Button
                    onPress={handleSubmit(handleCreateFamily)}
                    loading={createFamily.isPending}
                  >
                    <Typo className="text-white">Створити</Typo>
                  </Button>
                </>
              ) : (
                <>
                  {/* JOIN */}
                  <Typo variant="h2">Приєднатися</Typo>

                  <Input
                    label="Код запрошення"
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    placeholder="Введи код"
                    autoCapitalize="characters"
                    icon={(color) => (
                      <Feather name="key" size={18} color={color} />
                    )}
                    error={
                      inviteCode.length > 0 && inviteCode.length < 6
                        ? "Код занадто короткий"
                        : undefined
                    }
                  />

                  {/* <Button
                    onPress={handleJoinFamily}
                    loading={joinFamily.isPending}
                    disabled={!inviteCode.trim()}
                  >
                    <Typo className="text-white">Приєднатися</Typo>
                  </Button> */}
                </>
              )}
            </View>

            {/* SIGN OUT */}
            <Pressable onPress={signOut} className="self-center">
              <Typo className="text-muted">Вийти</Typo>
            </Pressable>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ModeButton({ active, label, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-1 items-center rounded-full py-3",
        active ? "bg-primary" : "bg-transparent"
      )}
    >
      <Typo className={active ? "text-white" : "text-muted"}>
        {label}
      </Typo>
    </Pressable>
  );
}