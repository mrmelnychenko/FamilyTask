import { Language } from "../types/language";

export const LANGUAGE_STORAGE_KEY = "app_language";

export const LANGUAGES: { key: Language; label: string; flag: string }[] = [
    { key: "ukrainian", label: "Ukrainian", flag: "https://flagcdn.com/w320/ua.png" },
    { key: "english",  label: "English",   flag: "https://flagcdn.com/w320/gb.png" },
    { key: "german",   label: "German",    flag: "https://flagcdn.com/w320/de.png" },
];

export const LANG_TO_CODE: Record<Language, string> = {
    ukrainian: "uk",
    english:   "en",
    german:    "de",
};
