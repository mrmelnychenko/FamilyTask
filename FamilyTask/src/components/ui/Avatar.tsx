import { View } from 'react-native';
import { Typo } from './Typo';
import { BG_COLORS, colors } from '@/src/utils/colors';
import { Image } from 'expo-image';

interface IAvatar {
  name?: string | null;
  avatarUrl?: string | null;
  size?: number;
  isBig?: boolean;
}

function getColorByName(name: string): string {
  const index = name.charCodeAt(0) % BG_COLORS.length;
  return BG_COLORS[index];
}



export function Avatar({ isBig, name, avatarUrl, size = 48 }: IAvatar) {
  const letter = name?.trim()?.[0]?.toUpperCase() ?? '?';
  const bgColor = name ? getColorByName(name) : colors.primary;

  const actualSize = isBig ? 100 : size;
  const fontSize = actualSize * 0.4;

  const bigStyle = isBig ? {
    borderWidth: 5,
    borderColor: colors.success,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  } : {};

  if (avatarUrl) {
    return (
      <View style={[
        { width: actualSize, height: actualSize, borderRadius: actualSize / 2 },
        isBig && { alignSelf: 'center' },
        bigStyle,
      ]}>
        <View style={{ width: '100%', height: '100%', borderRadius: actualSize / 2, overflow: 'hidden' }}>
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: actualSize, height: actualSize }}
            contentFit="cover"
            transition={200}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        { width: actualSize, height: actualSize, borderRadius: actualSize / 2, backgroundColor: bgColor },
        isBig && { alignSelf: 'center' },
        bigStyle,
      ]}
      className="items-center justify-center"
    >
      <Typo style={{ fontSize, fontWeight: '700', color: colors.white }}>
        {letter}
      </Typo>
    </View>
  );
}