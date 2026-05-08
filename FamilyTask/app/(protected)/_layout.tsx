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
  
    const hasFamily = !!familyMember?.family_id;
  
    const isLoadingState = loading || isLoading;
  
    if (isLoadingState) {
      return <LoadingScreen />;
    }
  
    if (!user) {
      return <Redirect href="/login" />;
    }
  
    // no family → force setup
    if (!hasFamily && !isFamilySetup) {
      return <Redirect href="/family-setup" />;
    }
  
    // has family → block setup screen
    if (hasFamily && isFamilySetup) {
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