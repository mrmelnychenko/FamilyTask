import { View, Pressable } from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/src/utils/colors";
import { Typo } from "@/src/components/ui/Typo";
import { Button } from "@/src/components/ui/Button";

type Language = "uk" | "en"  | "de";

const LANGUAGES = [
    { value: "uk", label: "Ukrainian", icon: "🇺🇦" },
    { value: "en", label: "English", icon: "🇬🇧" },
    { value: "de", label: "German", icon: "🇩🇪" },
] as const;

export function LanguageSettings() {
    const [selected, setSelected] = useState<Language>("en");

    return (
        <View className="flex-1 justify-between">
            {/* HEADER */}
            <View className="gap-2">
                <Typo variant="h1">Language</Typo>

                <Typo className="text-muted">
                    Choose interface language for your family
                </Typo>
            </View>

            {/* LIST */}
            <View className="gap-3 mt-6">
                {LANGUAGES.map((lang) => {
                    const isActive = selected === lang.value;

                    return (
                        <Pressable
                            key={lang.value}
                            onPress={() => setSelected(lang.value)}
                            className={`flex-row items-center justify-between p-4 rounded-2xl border ${
                                isActive
                                    ? "border-primary bg-primary-light"
                                    : "border-border bg-white"
                            }`}
                        >
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 items-center justify-center">
                                    <Typo>{lang.icon}</Typo>
                                </View>

                                <Typo className="text-text font-semibold">
                                    {lang.label}
                                </Typo>
                            </View>

                            <View
                                className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                                    isActive
                                        ? "border-primary"
                                        : "border-border"
                                }`}
                            >
                                {isActive && (
                                    <View className="w-2.5 h-2.5 bg-primary rounded-full" />
                                )}
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            {/* SAVE BUTTON */}
            <View className="pt-6">
                <Button
                    variant="primary"
                    onPress={() => {
                        console.log("save language:", selected);
                    }}
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
        </View>
    );
}