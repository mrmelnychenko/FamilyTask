import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { Typo } from '../components/ui/Typo';

export function WelcomeScreen() {
  return (
    <View className="flex-1 bg-background justify-center px-5">
      <View className="bg-card rounded-2xl p-6 border-2 border-primary-light shadow-lg">
        <View className="items-center mb-6">
          <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-4">
            <Text className="text-white text-3xl">★</Text>
          </View>

          <Typo variant="h1">FamilyTask</Typo>
          <Typo variant="body">Сімейний планнер</Typo>
        </View>

        <View className="items-center mb-6">
          <Text className="text-5xl mb-4">🎯</Text>

          <Typo variant="h2">Плануй разом</Typo>

          <View className="mt-2">
            <Typo variant="body">
              Задачі для всієї сімʼї в одному місці
            </Typo>
          </View>
        </View>

        <Button
          title="Почати"
          onPress={() => router.push('/register')}
        />

        <TouchableOpacity
          className="mt-5 items-center"
          onPress={() => router.push('/login')}
        >
          <Typo variant="body">Вже є акаунт?</Typo>
        </TouchableOpacity>
      </View>
    </View>
  );
}