import i18n from "@/i18next";
import { Button } from "@/src/components/ui/Button";
import { Typo } from "@/src/components/ui/Typo";
import { ScreenLayout } from "@/src/components/ui/layout/ScreenLayout";
import { LANGUAGES, LANG_TO_CODE } from "@/src/constants/language";
import { useUpdateLanguage } from "@/src/hooks/queries/useLanguage";
import { useProfile } from "@/src/hooks/queries/useProfile";
import { useAuth } from "@/src/hooks/useAuth";
import { Language } from "@/src/types/language";
import { colors } from "@/src/utils/colors";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable } from "react-native";
import { View } from "react-native";


export default function LanguageScreen() {
    const { mutate, isPending, isError } = useUpdateLanguage();
    const { t, i18n } = useTranslation();

    const { user } = useAuth();
    const { data: profile } = useProfile(user?.id);

    const [selected, setSelected] = useState<Language>("english");

    useEffect(() => {
        if (!profile?.language) return;

        const langKey = (Object.entries(LANG_TO_CODE).find(
            ([, code]) => code === profile.language
        )?.[0] ?? "english") as Language;

        setSelected(langKey);
    }, [profile?.language]);

    // 2. сохранить язык
    const handleSave = () => {
        mutate(selected, {
            onSuccess: (code) => {
                i18n.changeLanguage(code);
            },
        });
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <ScreenLayout
                style={{ backgroundColor: colors.primaryLight }}
                showBack
                backHref="/profile/settings"
                title={t("settings.language")}
            >
                <View className="flex-1 gap-6">

                    {/* HEADER */}
                    <View className="gap-1 items-center">
                        <Typo variant="h1">
                            {t("settings.chooseLanguage")}
                        </Typo>
                    </View>

                    {/* LIST */}
                    <View className="gap-3">
                        {LANGUAGES.map((lang) => {
                            const isActive = selected === lang.key;

                            return (
                                <Pressable
                                    key={lang.key}
                                    onPress={() => setSelected(lang.key)}
                                    className={`flex-row items-center justify-between p-4 rounded-2xl border-2 ${
                                        isActive
                                            ? "border-primary bg-primary/5"
                                            : "border-border bg-white"
                                    }`}
                                >
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-10 h-10 rounded-full overflow-hidden border border-border">
                                            <Image
                                                source={{ uri: lang.flag }}
                                                className="w-full h-full"
                                            />
                                        </View>

                                        <Typo className="font-semibold">
                                            {t(
                                                `languages.${LANG_TO_CODE[lang.key]}`
                                            )}
                                        </Typo>
                                    </View>

                                    <View
                                        className={`w-5 h-5 rounded-full border-2 ${
                                            isActive
                                                ? "border-primary bg-primary"
                                                : "border-border"
                                        }`}
                                    />
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* ERROR */}
                    {isError && (
                        <Typo className="text-red-500 text-center text-sm">
                            {t("common.error")}
                        </Typo>
                    )}

                    {/* SAVE */}
                    <View className="mt-auto">
                        <Button
                            onPress={handleSave}
                            disabled={isPending}
                        >
                            <Typo className="text-white font-bold">
                                {isPending
                                    ? t("common.loading")
                                    : t("common.save")}
                            </Typo>
                        </Button>
                    </View>

                </View>
            </ScreenLayout>
        </>
    );
}