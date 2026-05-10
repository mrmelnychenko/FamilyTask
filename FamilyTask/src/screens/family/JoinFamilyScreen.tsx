import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Typo } from "@/src/components/ui/Typo";
import { Hero } from "@/src/components/ui/header/Hero";
import { ScreenLayout } from "@/src/components/ui/layout/ScreenLayout";
import { useJoinFamily } from "@/src/hooks/queries/useFamily";
import { useAuth } from "@/src/hooks/useAuth";
import { JoinFamilyForm, joinFamilySchema } from "@/src/schemas/family.schema";
import { colors } from "@/src/utils/colors";
import { getJoinFamilyError } from "@/src/utils/family-error";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

export function JoinFamilyScreen() {
    const { user } = useAuth();
  const joinFamily = useJoinFamily();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinFamilyForm>({
    resolver: zodResolver(joinFamilySchema),
    defaultValues: { code: '' },
  });

  async function handleJoinFamily(data: JoinFamilyForm) {
    if (!user) return;
    setError(null);
    try {
      await joinFamily.mutateAsync({
        code: data.code.trim().toUpperCase(),
        userId: user.id,
      });
      router.replace('/home');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(getJoinFamilyError(message));
    }
  }

  return (
    <ScreenLayout showBack>
      <View className="flex-1 justify-center py-12">

        {/* FORM */}
        <View className="gap-6 rounded-3xl bg-white p-6 shadow-sm">
          <Hero
            title="Приєднатись до сім'ї"
            subtitle="Введи код запрошення від твоєї родини"
            icon={<Feather  name="key" size={48} color={colors.white}/>}
          />

          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Код сім'ї"
                value={value}
                onChangeText={(text) => onChange(text.toUpperCase())}
                placeholder="_ _ _ _ _ _ _ _"
                icon={(color) => <Feather name="key" size={18} color={color} />}
                error={errors.code?.message}
                autoCapitalize="characters"
                maxLength={8}
              />
            )}
          />

          {/* Hint */}
          <View
            className="rounded-xl p-4 bg-primary-light border border-primary">
            <Typo variant="label" className="text-center text-primary">
              💡 Попроси батьків надіслати код з налаштувань
            </Typo>
          </View>

          {error && (
            <View className="rounded-2xl bg-red-50 p-4">
              <Typo variant="body" className="text-red-500">
                ⚠ {error}
              </Typo>
            </View>
          )}

          <Button
            onPress={handleSubmit(handleJoinFamily)}
            loading={joinFamily.isPending}
          >
            <Typo variant="h3" className="text-white">
              Приєднатись
            </Typo>
          </Button>
        </View>

      </View>
    </ScreenLayout>
  )
}