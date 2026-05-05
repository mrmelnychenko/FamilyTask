import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Redirect, Stack, useSegments } from 'expo-router';
import '../globals.css';
import { useAuth } from '@/src/hooks/useAuth';
import { AuthProvider } from '@/src/providers/AuthProvider';
import { ActivityIndicator, View } from 'react-native';




function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const inAuthGroup = segments[0] === '(auth)';
  const inProtectedGroup = segments[0] === '(protected)';

  if (!session && inProtectedGroup) {
    return <Redirect href="/login" />;
  }

  if (session && inAuthGroup) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index"/> 
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(protected)" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Nunito-Regular': require('../assets/fonts/Nunito-Regular.ttf'),
    'Nunito-Bold': require('../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-ExtraBold': require('../assets/fonts/Nunito-ExtraBold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
