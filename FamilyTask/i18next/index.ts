import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./locales/en.json";
import uk from "./locales/uk.json";
import de from "./locales/de.json";


const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? 'ja';
i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    en: { translation: en },
    de: { translation: de },
  },
  lng: deviceLanguage,   // Use device language as default
  fallbackLng: 'en',     // Fallback to Japanese if unsupported
  interpolation: {
    escapeValue: false,  // Required for React / React Native
  },
});
export default i18n;
