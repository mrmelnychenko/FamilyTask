import React, { useState } from 'react';
import { Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/src/utils/colors';
import { Typo } from '../ui/Typo';
import { useAppToast } from '@/src/hooks/useToast';

interface IInviteCopyButton {
    inviteCode: string
}

export function InviteCopyButton({ inviteCode }: IInviteCopyButton) {
    const { success } = useAppToast()
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(inviteCode);

        setCopied(true);

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        success({
            title: 'Copied',
            message: 'Invite code copied to clipboard',
        });
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <Pressable
            onPress={handleCopy}
            android_ripple={{ color: colors.white }}
            className="flex-row items-center justify-between bg-white/20 border-2 border-white/40 px-4 py-3 rounded-full"
        >
            <Typo variant='h3' className='text-white' numberOfLines={1}>
                {copied ? 'Copied!' : inviteCode}
            </Typo>

            <Feather
                name={copied ? 'check' : 'copy'}
                size={16}
                color={colors.white}
            />
        </Pressable>
    );
}