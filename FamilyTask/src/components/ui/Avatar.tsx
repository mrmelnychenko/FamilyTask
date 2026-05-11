import { View } from 'react-native';
import { Typo } from './Typo';
import { colors } from '@/src/utils/colors';
import { Image } from 'react-native';

interface IAvatar {
  name?: string | null;
  uri?: string | null;
  size?: number;
}

const BG_COLORS = [
    colors.primary,
    colors.pink,
    colors.warning,
    colors.success,
    colors.blue,
    colors.gold,
    colors.danger,
    colors.primaryDark,
    colors.cyan,
  ];

function getColorByName(name: string): string {
  const index = name.charCodeAt(0) % BG_COLORS.length;
  return BG_COLORS[index];
}

export function Avatar({ name, uri, size = 40 }: IAvatar) {
  const letter = name?.trim()?.[0]?.toUpperCase() ?? '?';
  const bgColor = name ? getColorByName(name) : colors.primary;
  const fontSize = size * 0.4;

  if (uri) {
    return (
      <View style={{ width: size, height: size, borderRadius: size / 2 , overflow: 'hidden' }}>
        <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
      }}
      className="items-center justify-center"
    >
      <Typo style={{ fontSize, fontWeight: '700', color: colors.white }}>
        {letter}
      </Typo>
    </View>
  );
}