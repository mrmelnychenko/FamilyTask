import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { LANGUAGE_STORAGE_KEY } from "../constants/language";
import i18n from "@/i18next";
import { useAuth } from "./useAuth";
import { useProfile } from "./queries/useProfile";

export function useLanguageBootstrap() {
    const { user } = useAuth();
    const { data: profile } = useProfile(user?.id);
  
    const [ready, setReady] = useState(false);
  
    useEffect(() => {
      let mounted = true;
  
      async function init() {
        try {
          // 1. загрузка локального языка
          const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  
          if (savedLanguage) {
            await i18n.changeLanguage(savedLanguage);
          }
  
          // 2. синк с профилем (если есть)
          if (profile?.language && profile.language !== i18n.language) {
            await i18n.changeLanguage(profile.language);
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, profile.language);
          }
        } finally {
          if (mounted) setReady(true);
        }
      }
  
      init();
  
      return () => {
        mounted = false;
      };
    }, [profile?.language]);
  
    return ready;
  }