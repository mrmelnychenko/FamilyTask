import { ScreenLayout } from "@/src/components/ui/layout/ScreenLayout";
import { colors } from "@/src/utils/colors";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ManageScreen() {
    const insets = useSafeAreaInsets();
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScreenLayout
                style={{ paddingTop: insets.top, backgroundColor: colors.primaryLight }}
                showBack
                backHref="/(protected)/(tabs)/family"
                title={"Family Settings"}
                >

            </ScreenLayout>
        </>
    );
}