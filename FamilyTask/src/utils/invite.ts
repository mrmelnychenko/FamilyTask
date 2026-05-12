import { customAlphabet } from 'nanoid';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';


const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const generateInviteCode = (): string => {
    const generate = customAlphabet(alphabet, 8);
    return generate();
};


export const handleCopy = async (inviteCode: string) => {
  await Clipboard.setStringAsync(inviteCode);

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};