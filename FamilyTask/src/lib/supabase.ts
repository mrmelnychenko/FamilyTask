import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store'
import { Platform } from 'react-native'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const storage = {
  getItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await getItemAsync(key);
    } catch {
      return null;
    }
  },

  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
        return;
      }
      await setItemAsync(key, value);
    } catch {}
  },

  removeItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
      }
      await deleteItemAsync(key);
    } catch {}
  },
};

export const supabase = createClient(
  supabaseUrl ?? '',
  supabasePublishableKey ?? '',
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)