import { customAlphabet } from 'nanoid';

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const generateInviteCode = (): string => {
  const generate = customAlphabet(alphabet, 8);
  return generate();
};