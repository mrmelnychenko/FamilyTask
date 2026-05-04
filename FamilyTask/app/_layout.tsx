import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} /> 
      <Stack.Screen name="register" options={{ title: 'Реєстрація' }} />
      <Stack.Screen name="home" options={{ title: 'Головна' }} />
    </Stack>
  );
}