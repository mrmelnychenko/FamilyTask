import { Redirect, Slot } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';
import { useTaskReminderSync } from '@/src/hooks/useTaskReminderSync';
import { usePushTokenSync } from '@/src/hooks/usePushTokenSync';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  usePushTokenSync(user?.id);
  useTaskReminderSync(user?.id);

  if (loading) return <LoadingScreen />;
  if (!user) return <Redirect href="/login" />;

  return (
      <Slot />
  )
}
