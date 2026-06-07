import { View, Pressable } from 'react-native';
import { Href, router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typo } from './Typo';
import { colors } from '@/src/utils/colors';
import { TABS } from '@/src/constants/tabs';
import { BlurView } from 'expo-blur';


export function TabsNavigation() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
 
  return (
    <View
      pointerEvents="box-none"
      className="absolute bottom-0 left-0 right-0 px-4 z-0"
      style={{
        paddingBottom: insets.bottom > 0 ? insets.bottom * 0.6 : 8,
      }}
    >
      <BlurView
        intensity={60}
        tint="light"
        className="overflow-hidden rounded-full"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View className="flex-row px-2 py-2">
          {TABS.map((tab) => {
            const active = pathname.includes(
              tab.href.split('/').pop()!
            );

            const color = active
              ? colors.white
              : colors.muted;

            return (
              <Pressable
                key={tab.href}
                onPress={() =>
                  router.replace(tab.href as Href)
                }
                className="flex-1 items-center gap-1 rounded-full py-2"
                style={{
                  backgroundColor: active
                    ? colors.primary
                    : 'transparent',
                }}
              >
                {tab.icon(color)}

                <Typo
                  variant="label"
                  style={{ color }}
                >
                  {tab.label}
                </Typo>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}