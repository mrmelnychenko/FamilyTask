import { colors } from "@/src/utils/colors";
import { Pressable, View } from "react-native";
import { Typo } from "../ui/Typo";
import { MaterialIcons } from "@expo/vector-icons";
import { Input } from "../ui/Input";
import { Controller, useForm } from "react-hook-form";
import { UpdateProfileFormData, updateProfileSchema } from "@/src/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/src/hooks/useAuth";
import { useProfile, useUpdateProfile } from "@/src/hooks/queries/useProfile";
import { Button } from "../ui/Button";
import { useEffect } from "react";
import { useAppToast } from "@/src/hooks/useToast";
import { useRouter } from "expo-router";

export function ProfileEditInformation() {
    const { user } = useAuth();
    const { data: profile } = useProfile(user?.id);
    const router = useRouter();

    const { success } = useAppToast()
    const { mutate: updateProfileMutation, isPending } =
        useUpdateProfile();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    });

    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name ?? "",
                email: profile.email ?? "",
            });
        }
    }, [profile, reset]);

    const onSubmit = (data: UpdateProfileFormData) => {
        if (!profile) return;

        updateProfileMutation(
            {
                userId: profile.id,
                name: data.name,
                email: data.email,
            },
            {
                onSuccess: () => {
                    success({
                        title: "Updated",
                        message: "Profile updated successfully",
                    });
                },
            }
        );
    };
    return (
        <View className="gap-6">
            {/* PERSONAL INFO */}
            <View className="gap-3">
                <Typo variant="h3" className="text-muted ml-1">
                    Personal Info
                </Typo>

                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Name"
                            value={value}
                            onChangeText={onChange}
                            error={errors.name?.message}
                            icon={(color) => (
                                <MaterialIcons
                                    name="person"
                                    size={20}
                                    color={color}
                                />
                            )}
                        />
                    )}
                />
            </View>

            {/* SECURITY */}
            <View className="gap-3">
                <Typo variant="h3" className="text-muted ml-1">
                    Account Security
                </Typo>

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Email"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email?.message}
                            icon={(color) => (
                                <MaterialIcons
                                    name="mail"
                                    size={20}
                                    color={color}
                                />
                            )}
                        />
                    )}
                />

                <Pressable
                    className="flex-row items-center justify-between bg-white border border-border rounded-2xl p-4 active:opacity-70"
                    onPress={() => router.push("/profile/password")}
                >
                    <View className="flex-row items-center gap-3">
                        <MaterialIcons
                            name="lock"
                            size={22}
                            color={colors.primary}
                        />

                        <Typo variant="h3">
                            Change Password
                        </Typo>
                    </View>

                    <MaterialIcons
                        name="chevron-right"
                        size={22}
                        color={colors.muted}
                    />
                </Pressable>
            </View>

            <Button
                loading={isPending}
                disabled={!isDirty}
                onPress={handleSubmit(onSubmit)}
            >
                <MaterialIcons
                    name="save"
                    size={20}
                    color={colors.white}
                />

                <Typo className="text-white font-bold">
                    Save Changes
                </Typo>
            </Button>
        </View>
    );
}