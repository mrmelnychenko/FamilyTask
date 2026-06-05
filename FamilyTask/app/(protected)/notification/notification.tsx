import { ScreenLayout } from "@/src/components/ui/layout/ScreenLayout";
import { useMarkNotificationAsRead, useNotifications } from "@/src/hooks/queries/useNotification";
import { useAuth } from "@/src/hooks/useAuth";
import { useNotificationsRealtime } from "@/src/hooks/useNotification";
import { supabase } from "@/src/lib/supabase";
import { colors } from "@/src/utils/colors";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function NotificationScreen() {
    const { user } = useAuth()

    const { data: notifications = [], isLoading } =
        useNotifications(user?.id)

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
                style={{ backgroundColor: colors.primaryLight }}
                showBack
                backHref="/(protected)/(tabs)/family"
                title={"Notification"}
            >
                <View className="flex-1 flex-col gap-4">
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => markAsRead(item.id)}
                                style={{
                                    padding: 12,
                                    marginBottom: 10,
                                    backgroundColor: item.is_read ? "#eee" : "#fff",
                                    borderRadius: 12,
                                }}
                            >
                                <Text style={{ fontWeight: "bold" }}>
                                    {item.title}
                                </Text>
                                <Text>{item.body}</Text>
                            </Pressable>
                        )}
                    />
                </View>


            </ScreenLayout>
        </>
    );
}


