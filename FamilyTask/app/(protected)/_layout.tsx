import { Redirect, Slot } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';
import { useNotificationsRealtime } from '@/src/hooks/useNotification';


export default function ProtectedLayout() {
  const { user, loading } = useAuth()

  useNotificationsRealtime(user?.id)

  if (loading) return <LoadingScreen />
  if (!user) return <Redirect href="/login" />

  return <Slot />
}