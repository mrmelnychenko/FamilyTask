import { Redirect, Stack, usePathname } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/src/hooks/useAuth';

export default function ProtectedLayout() {
  const { session, loading, profile, profileLoading } = useAuth();
  const pathname = usePathname();
  const isFamilySetup = pathname === '/family-setup';

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  if (profileLoading && !isFamilySetup) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  if (!profile?.family_id && !isFamilySetup) {
    return <Redirect href="/family-setup" />;
  }

  if (profile?.family_id && isFamilySetup) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="create-task" />
      <Stack.Screen name="family-setup" />
    </Stack>
  );
}
