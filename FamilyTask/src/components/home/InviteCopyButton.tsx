import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/src/utils/colors';
import { Typo } from '../ui/Typo';
import { useAppToast } from '@/src/hooks/useToast';

interface IInviteCopyButton {
    inviteCode: string
}

export function InviteCopyButton({inviteCode}: IInviteCopyButton) {
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
            className="flex-row items-center rounded-2xl border border-primary-light bg-white/10 px-4 py-2.5"
        >
            {/* FIXED WIDTH TEXT WRAPPER */}
            <View style={{ width: 110 }}>
                <Typo variant='body' className='text-white'
                    numberOfLines={1}
                >
                    {copied ? 'Copied' : inviteCode}
                </Typo>
            </View>

            <Feather
                name={copied ? 'check' : 'copy'}
                size={13}
                color={colors.white}
            />
        </Pressable>
    );
}