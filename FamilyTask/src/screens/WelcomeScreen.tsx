import { Href, Redirect, router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Typo } from '../components/ui/Typo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GuestHeader } from '../components/ui/header/GuestHeader';
import { TargetIcon } from '../components/icons/TargetIcon';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { Box } from '../components/ui/Box';
import { cn } from '../utils/cn';
import { colors } from '../utils/colors';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';


export const features = [
  {
    icon: <Feather name='check-circle' size={22} color={colors.primary} />,
    bg: "bg-primary-light",
    title: "Сімейні задачі",
    desc: "Розподіляйте завдання між усіма членами родини",
  },
  {
    icon: <Octicons name='zap' size={22} color={colors.gold} />,
    bg: "bg-gold-bg",
    title: "XP та нагороди",
    desc: "Заробляйте поінти за кожне виконане завдання",
  },
  {
    icon: <Octicons name='trophy' size={22} color={colors.pink} />,
    bg: "bg-pink-bg",
    title: "Лідерборд",
    desc: "Змагайтесь усією сім'єю — хто найкращий?",
  },
  {
    icon: <Octicons name='flame' size={22} color={colors.streak} />,
    bg: "bg-streak-bg",
    title: "Streak-серії",
    desc: "Підтримуйте серію та отримуйте бонуси",
  },
];

export function WelcomeScreen() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Redirect href="/home" />;
  }
  
  return (
    <SafeAreaView className='flex-1 bg-background'>

        <GuestHeader />
        <ScrollView 
         contentContainerStyle={{ flexGrow: 1 }}
         showsVerticalScrollIndicator={false}
         >

          <View className='flex-1 items-center justify-center gap-2 px-4 pt-6'>
            <TargetIcon />
            <Typo variant='h2' className='text-center'>
              Cімейний планнер з іграми
            </Typo>
            <Typo variant='body' className='text-light text-center'>
              Перетворіть домашні справи на захопливу пригоду для всієї родини. Задачі, XP, бейджі та лідерборд!
            </Typo>
          </View>
          <View className="flex-row flex-wrap justify-between px-4 mt-6">
            {features.map((el) => (
              <Box
                key={el.title}
                className="w-[48%] flex gap-2 bg-white mb-3 p-2 rounded-xl"
              >
                <View className={cn(`${el.bg} self-start rounded-md p-2`)}>
                  {el.icon}
                </View>
                <Typo variant='h3'>
                  {el.title}
                </Typo>
                <Typo variant='label' className='text-light'>
                  {el.desc}
                </Typo>
              </Box>
            ))
            }
          </View>
          <View className='px-4 mt-6 pb-10 gap-4'>
            <Button onPress={() => router.push('/register' as Href)}>
              <Typo variant='h3' className='text-white'>
                Почати
              </Typo>
            </Button>
            <Button className='border border-border bg-transparent' onPress={() => router.push('/login' as Href)}>
              <Typo variant='h3' className='text-muted'>
                Вже маю акаунт — Увійти
              </Typo>
            </Button>
          </View>
        </ScrollView>
    </SafeAreaView >
  );
}
