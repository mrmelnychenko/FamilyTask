import { Redirect, Slot} from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { LoadingScreen } from '@/src/components/ui/LoadingScreen';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Redirect href="/login" />;

  return <Slot />;
}