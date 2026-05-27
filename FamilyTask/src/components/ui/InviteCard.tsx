import { View, Text, Pressable, Share } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCurrentFamily } from '@/src/hooks/queries/useFamily';
import { useAuth } from '@/src/hooks/useAuth';
import { useFamilyInvite } from '@/src/hooks/queries/useInvite';
import { Typo } from './Typo';
import { colors } from '@/src/utils/colors';
import { InviteCopyButton } from '../home/InviteCopyButton';

export function InviteCard() {
    const { user } = useAuth()
    const { data: currentFamily } = useCurrentFamily(user?.id);
    const { data: invite, isLoading: isInviteLoading } = useFamilyInvite(
        currentFamily?.family_id
    );
    const handleShare = async () => {
        await Share.share({
            message: `Join ${currentFamily?.families.name}! Invite code: ${invite?.invite_code}`,
        });
    };

    return (
        <View className="bg-primary p-5 rounded-2xl mt-4 overflow-hidden">

            {/* Decor */}
            <Text className="absolute -bottom-4 -right-2 text-9xl opacity-20 rotate-12">🎉</Text>

            <View className="gap-3">
                <Typo variant='h3' className='text-white'>
                    Grow the {currentFamily?.families.name}!
                </Typo>
                <Typo className='text-white'>
                    Invite grandparents or siblings to join the quest and earn a{' '}
                    <Typo variant='h3' className='text-white'>Team Synergy Badge</Typo>
                    {' '}for everyone!
                </Typo>

                <View className="flex-col gap-3 pt-1">
                    {/* Invite code */}
                    <InviteCopyButton inviteCode={invite?.invite_code!}/>

                    {/* Share button */}
                    <Pressable
                        onPress={handleShare}
                        className="bg-white px-4 py-3 rounded-full flex-row items-center justify-center gap-2 active:opacity-70"
                    >
                        <MaterialIcons name="share" size={24} color={colors.primary} />
                        <Typo variant='h3'>
                            Share Code
                        </Typo>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}