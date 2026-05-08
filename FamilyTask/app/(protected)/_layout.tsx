import { Redirect, Stack, usePathname } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { useCurrentFamily } from '@/src/hooks/queries/useFamily';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  const { data: familyMember, isLoading } =
    useCurrentFamily(user?.id);

  const pathname = usePathname();
  const isFamilySetup = pathname === "/family-setup";

  const isNoFamily = familyMember === null;
  const isHasFamily = !!familyMember;

  const isReady = !loading && !isLoading;

  // 1. auth loading
  if (!isReady) {
    return <LoadingScreen />;
  }

  // 2. no auth
  if (!user) {
    return <Redirect href="/login" />;
  }

  // 3. no family → setup
  if (isNoFamily && !isFamilySetup) {
    return <Redirect href="/family-setup" />;
  }

  // 4. has family → prevent setup screen
  if (isHasFamily && isFamilySetup) {
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