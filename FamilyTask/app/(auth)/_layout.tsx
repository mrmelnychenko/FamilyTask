import { LoadingScreen } from '@/src/components/ui/LoadingScreen';
import { useAuth } from '@/src/hooks/useAuth';
import { colors } from '@/src/utils/colors';
import { Redirect, Stack } from 'expo-router';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

export default function AuthLayout() {
  const { user, loading} = useAuth();
  
  if (loading) return <LoadingScreen />; 

  return (
    // <SafeAreaView className="flex-1">
      <View className="flex-1">

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          />
        </KeyboardAvoidingView>
      </View>
    // </SafeAreaView>
  );
}