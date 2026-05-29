import React from 'react';
import { Pressable, View } from 'react-native';
import { Avatar } from './Avatar';
import { useCurrentFamily } from '@/src/hooks/queries/useFamily';
import { useAuth } from '@/src/hooks/useAuth';
import { Typo } from './Typo';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/src/utils/colors';
import { useRouter } from 'expo-router';
import { useProfile } from '@/src/hooks/queries/useProfile';
import { useCurrentFamilyRole } from '@/src/hooks/useRole';

export function TeamHeader() {
    const { user } = useAuth();
    const { data: currentFamily } = useCurrentFamily(user?.id);
    const { data: profile } = useProfile(user?.id);
    const router = useRouter();
    const { isAdmin } = useCurrentFamilyRole();
    return (
        <View className="items-center gap-3 mt-6 mb-2">

            <View className="p-1 rounded-full border-2 border-primary/30">
                <Avatar
                    isBig
                    avatarUrl={currentFamily?.families.avatar_url}
                    name={currentFamily?.families.name}
                    size={100}
                />
            </View>

            <View className="items-center gap-1">
                <Typo variant='h2'>
                    {currentFamily?.families.name}
                </Typo>
            </View>

            {
                isAdmin && <Pressable
                    onPress={() => router.push('/family/manage')}
                    className="flex-row items-center gap-2 bg-primary px-4 py-2 rounded-full active:opacity-70"
                    style={{
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 8,
                        elevation: 4,
                    }}
                >
                    <MaterialIcons name="settings" size={18} color={colors.primaryLight} />
                    <Typo variant='body' className='text-white font-semibold'>Settings</Typo>
                </Pressable>
            }


        </View>
    );
}