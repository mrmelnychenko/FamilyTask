import { Language } from "../types/language";
import { supabase } from "../lib/supabase";
import { LANGUAGE_STORAGE_KEY, LANG_TO_CODE } from "../constants/language";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function updateLanguage(language: Language) {
    const code = LANG_TO_CODE[language];

    await AsyncStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        code
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return code;
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            language: code,
        })
        .eq("id", user.id);

    if (error) {
        throw error;
    }

    return code;
}