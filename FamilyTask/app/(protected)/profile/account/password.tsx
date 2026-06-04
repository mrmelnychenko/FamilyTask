import { ChangePasswordForm } from "@/src/components/profile/ChangePasswordForm";
import { ScreenLayout } from "@/src/components/ui/layout/ScreenLayout";
import { colors } from "@/src/utils/colors";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function PasswordProfileScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScreenLayout
                style={{ backgroundColor: colors.primaryLight }}
                showBack
                backHref="/profile/account/manage"
                title={"Change Password"}
            >
                <View className="flex-1 flex-col gap-4">
                    <ChangePasswordForm />
                </View>


            </ScreenLayout>
        </>
    );
}