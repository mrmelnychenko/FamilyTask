import { View } from 'react-native';
import { Typo } from './Typo';
import { BG_COLORS, colors } from '@/src/utils/colors';
import { Image } from 'expo-image';

interface IAvatar {
  name?: string | null;
  avatarUrl?: string | null;
  size?: number;
}

function getColorByName(name: string): string {
  const index = name.charCodeAt(0) % BG_COLORS.length;
  return BG_COLORS[index];
}

export function Avatar({ name, avatarUrl, size = 40 }: IAvatar) {
  const letter = name?.trim()?.[0]?.toUpperCase() ?? '?';
  const bgColor = name ? getColorByName(name) : colors.primary;
  const fontSize = size * 0.4;

  if (avatarUrl) {
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
        <Image
          source={{ uri: avatarUrl }} 
          style={{ width: size, height: size }}
          contentFit="cover"
          transition={200}
        />
      </View>
    );
  }

  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }}
      className="items-center justify-center"
    >
      <Typo style={{ fontSize, fontWeight: '700', color: colors.white }}>
        {letter}
      </Typo>
    </View>
  );
}