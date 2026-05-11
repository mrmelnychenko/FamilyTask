import { View } from 'react-native';
import { colors } from '@/src/utils/colors';
import { Typo } from '../Typo';
import { Avatar } from '../Avatar';
import { useAuth } from '@/src/hooks/useAuth';
import { useProfile } from '@/src/hooks/queries/useProfile';

export function AppHeader() {
    const { user } = useAuth();
    const { data: profile } = useProfile(user?.id);
    return (
        <View className="flex-row items-center justify-between px-5 py-3" style={{
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 4,
            backgroundColor: '#DDB7FF'
          }}>
            {/* LEFT */}
            <Avatar name={profile?.name}/>

            {/* RIGHT */}
            <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                    <Typo variant="label" style={{ color: colors.streak }}>🔥</Typo>
                    <Typo variant="label" style={{ color: colors.streak }}>{7}</Typo>
                </View>

                <View className="flex-row items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <Typo variant="label" style={{ color: colors.gold }}>⭐</Typo>
                    <Typo variant="label" style={{ color: colors.gold }}>{150}xp</Typo>
                </View>
            </View>
        </View>
    );
}