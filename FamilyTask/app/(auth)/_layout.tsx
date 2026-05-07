import { colors } from '@/src/utils/colors';
import { Stack } from 'expo-router';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <SafeAreaView className="flex-1">
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
          >
            <Stack.Screen name="login"/>
            <Stack.Screen name="register"/>
          </Stack>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}