import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import '../globals.css';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/src/lib/queryClient";
import { useAuth } from '@/src/hooks/useAuth';
import { AuthProvider } from '@/src/providers/AuthProvider';
import "@/src/lib/querySetup";
import Toast from 'react-native-toast-message';
import { RootSiblingParent } from 'react-native-root-siblings';
import { toastConfig } from '@/src/components/toast/ToastConfig';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Nunito-Regular': require('../assets/fonts/Nunito-Regular.ttf'),
    'Nunito-Bold': require('../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-ExtraBold': require('../assets/fonts/Nunito-ExtraBold.ttf'),
  });


  if (!loaded && !error) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <RootSiblingParent>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>



              <RootLayoutNav />
              <Toast config={toastConfig} />
              
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </AuthProvider>
      </RootSiblingParent>
    </QueryClientProvider>
  );
}