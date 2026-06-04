import { View, Pressable } from "react-native";
import { Stack, router } from "expo-router";
import { ScreenLayout } from "@/src/components/ui/layout/ScreenLayout";
import { Typo } from "@/src/components/ui/Typo";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/src/utils/colors";

export default function SettingsScreen() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <ScreenLayout
                style={{ backgroundColor: colors.primaryLight }}
                showBack
                backHref="/(protected)/(tabs)/profile"
                title="Account Settings"
            >
                <View className="gap-6">
                    {/* SECTION TITLE */}
                    <Typo variant="h3" className="text-muted px-1">
                        General
                    </Typo>

                    {/* SETTINGS CARD */}
                    <View className="bg-white border border-border rounded-2xl overflow-hidden">
                        {/* LANGUAGE */}
                        <Pressable
                            onPress={() => router.push("/profile/settings/language")}
                            className="flex-row items-center justify-between p-4"
                        >
                            <View className="flex-row items-center gap-3">
                                <MaterialIcons
                                    name="language"
                                    size={20}
                                    color={colors.muted}
                                />
                                <Typo>Language</Typo>
                            </View>

                            <View className="flex-row items-center gap-1">
                                <Typo className="text-muted text-xs">
                                    English
                                </Typo>
                                <MaterialIcons
                                    name="chevron-right"
                                    size={20}
                                    color={colors.muted}
                                />
                            </View>
                        </Pressable>

                        {/* THEME */}
                        <Pressable
                            onPress={() => router.push("/profile/settings/theme")}
                            className="flex-row items-center justify-between p-4 border-t border-border"
                        >
                            <View className="flex-row items-center gap-3">
                                <MaterialIcons
                                    name="dark-mode"
                                    size={20}
                                    color={colors.muted}
                                />
                                <Typo>Theme</Typo>
                            </View>

                            <View className="flex-row items-center gap-1">
                                <Typo className="text-muted text-xs">
                                    System
                                </Typo>
                                <MaterialIcons
                                    name="chevron-right"
                                    size={20}
                                    color={colors.muted}
                                />
                            </View>
                        </Pressable>
                    </View>
                </View>
            </ScreenLayout>
        </>
    );
}