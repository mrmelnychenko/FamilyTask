import { EditProfileAvatar } from "@/src/components/ui/EditProfileAvatar";
import { ScreenLayout } from "@/src/components/ui/layout/ScreenLayout";
import { colors } from "@/src/utils/colors";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function ManageProfileScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScreenLayout
                style={{ backgroundColor: colors.primaryLight }}
                showBack
                backHref="/(protected)/(tabs)/profile"
                title={"Profile Settings"}
            >
                <View className="flex-1 flex-col gap-4">
                    <EditProfileAvatar />

                </View>

                
            </ScreenLayout>
        </>
    );
}