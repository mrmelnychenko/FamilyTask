import { View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialIcons } from "@expo/vector-icons";

import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Typo } from "@/src/components/ui/Typo";

import { useAppToast } from "@/src/hooks/useToast";


import { colors } from "@/src/utils/colors";
import { useChangePassword } from "@/src/hooks/queries/useProfile";
import { ChangePasswordFormData, changePasswordSchema } from "@/src/schemas/password.schema";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getErrorPasswordMessage } from "@/src/utils/password-error";
import { useEffect, useState } from "react";

export function ChangePasswordForm() {
    const { success, error: toastError } = useAppToast();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { mutate: changePasswordMutation, isPending } =
        useChangePassword();

    const insets = useSafeAreaInsets();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: ChangePasswordFormData) => {
        changePasswordMutation(data.newPassword, {
            onSuccess: () => {
                success({
                    title: "Success",
                    message: "Password changed successfully",
                });

                reset();
            },

            onError: (err: any) => {
                const msg = getErrorPasswordMessage(err);

                toastError({
                    title: "Error",
                    message: msg,
                });

                setErrorMsg(msg);
            },
        });
    };

    useEffect(() => {
        if (!errorMsg) return;

        setErrorMsg(null);
    }, [watch("newPassword"), watch("confirmPassword")]);

    return (
        <View className="flex-1 justify-between">
            {/* TOP CONTENT */}
            <View className="gap-6">
                {/* TITLE */}
                <View className="items-center gap-1">
                    <Typo variant="h1" className="text-center">
                        Change Password
                    </Typo>

                    <Typo className="text-muted text-center px-6">
                        Use a strong password for better security
                    </Typo>
                </View>

                {/* NEW PASSWORD */}
                <Controller
                    control={control}
                    name="newPassword"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="New Password"
                            placeholder="Enter new password"
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry
                            error={errors.newPassword?.message}
                            icon={(color) => (
                                <MaterialIcons
                                    name="lock"
                                    size={20}
                                    color={color}
                                />
                            )}
                        />
                    )}
                />

                {/* CONFIRM PASSWORD */}
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Confirm Password"
                            placeholder="Repeat new password"
                            value={value}
                            onChangeText={onChange}
                            secureTextEntry
                            error={errors.confirmPassword?.message}
                            icon={(color) => (
                                <MaterialIcons
                                    name="lock-outline"
                                    size={20}
                                    color={color}
                                />
                            )}
                        />
                    )}
                />
            </View>
            {errorMsg && (
                <View className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200">
                    <Typo className="text-red-600 text-sm">
                        {errorMsg}
                    </Typo>
                </View>
            )}
            {/* BOTTOM ACTION BUTTON */}
            <View
                style={{
                    paddingBottom: insets.bottom,
                }}
                className="pt-6"
            >
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
                        {isDirty ? "Change Password" : "No Changes"}
                    </Typo>
                </Button>
            </View>
        </View>
    );
}