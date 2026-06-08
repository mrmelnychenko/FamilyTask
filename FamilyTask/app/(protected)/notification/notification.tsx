import { ScreenLayout } from "@/src/components/ui/layout/ScreenLayout";
import { NotificationItem } from "@/src/constants/notification";
import { useMarkNotificationAsRead, useNotifications } from "@/src/hooks/queries/useNotification";
import { useAuth } from "@/src/hooks/useAuth";
import { colors } from "@/src/utils/colors";
import { Href, Stack, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

export default function NotificationScreen() {
    const { user } = useAuth()
    const { from } = useLocalSearchParams<{ from?: string }>();
    const { data: notifications = [], isLoading } =
        useNotifications(user?.id)
    console.log(notifications)
    const { mutate: markAsRead } =
        useMarkNotificationAsRead(user?.id!)

    if (isLoading) {
        return <Text>Loading...</Text>
    }

    if (isLoading) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScreenLayout
                scrollable={false}
                style={{ backgroundColor: colors.primaryLight }}
                showBack
                backHref={(from || "/(protected)/(tabs)/home") as Href}
                title="Notification"
            >
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                    renderItem={({ item }) => (
                        <Pressable onPress={() => markAsRead(item.id)}>
                            <NotificationItem notification={item} />
                        </Pressable>
                    )}
                />
            </ScreenLayout>
        </>
    );
}


