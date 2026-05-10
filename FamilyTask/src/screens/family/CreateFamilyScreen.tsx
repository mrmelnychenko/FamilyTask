import { FamilyIcon } from "@/src/components/icons/FamilyIcon";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Typo } from "@/src/components/ui/Typo";
import { Hero } from "@/src/components/ui/header/Hero";
import { ScreenLayout } from "@/src/components/ui/layout/ScreenLayout";
import { useCreateFamily } from "@/src/hooks/queries/useFamily";
import { useAuth } from "@/src/hooks/useAuth";
import { CreateFamilyForm, createFamilySchema } from "@/src/schemas/family.schema";
import { getFamilyError } from "@/src/utils/family-error";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

export function CreateFamilyScreen() {
    const { user } = useAuth();
    const createFamily = useCreateFamily();
    const [error, setError] = useState<string | null>(null);
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateFamilyForm>({
        resolver: zodResolver(createFamilySchema),
        defaultValues: {
            name: '',
        },
    });
    async function handleCreateFamily(data: CreateFamilyForm) {
        if (!user) return;

        setError(null);

        try {
            await createFamily.mutateAsync({
                name: data.name.trim(),
                userId: user.id,
            });

            router.replace('/home');
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unknown error occurred';

            setError(getFamilyError(message));
        }
    }

    return (
        <ScreenLayout showBack>
            <View className="flex-1 justify-center py-8">
                {/* HERO */}
                {/* FORM */}
                <View className="gap-6 rounded-3xl bg-white p-6 shadow-sm">
                    <Hero
                        title="Створення сім'ї"
                        subtitle="Налаштуй свій сімейний простір"
                        icon={<FamilyIcon />}
                    />
                    
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
                                    <Feather
                                        name="home"
                                        size={18}
                                        color={color}
                                    />
                                )}
                                error={errors.name?.message}
                            />
                        )}
                    />

                    {error && (
                        <View className="rounded-2xl bg-red-50 p-4">
                            <Typo variant="body" className="text-red-500">
                                {error}
                            </Typo>
                        </View>
                    )}

                    <Button
                        onPress={handleSubmit(handleCreateFamily)}
                        loading={createFamily.isPending}
                    >
                        <Typo variant="h3" className="text-white">
                            Створити сімʼю
                        </Typo>
                    </Button>
                </View>
            </View>
        </ScreenLayout>
    );
}