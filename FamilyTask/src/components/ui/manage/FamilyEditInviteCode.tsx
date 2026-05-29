import { useCurrentFamily } from "@/src/hooks/queries/useFamily"
import { useFamilyInvite, useRegenerateNewInviteCode } from "@/src/hooks/queries/useInvite"
import { useAuth } from "@/src/hooks/useAuth"
import { View } from "react-native"
import { Typo } from "../Typo"
import { Button } from "../Button"
import { useAppToast } from "@/src/hooks/useToast"
import { useState } from "react"
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Feather } from "@expo/vector-icons"
import { colors } from "@/src/utils/colors"

export function FamilyEditInviteCode() {
    const { user } = useAuth();

    const { data: currentFamily } = useCurrentFamily(user?.id);

    const { data: inviteCode } = useFamilyInvite(
        currentFamily?.family_id
    );

    const { mutate: regenerateInviteMutation, isPending } =
        useRegenerateNewInviteCode();

    const { success } = useAppToast();

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(
            inviteCode?.invite_code ?? ""
        );

        setCopied(true);

        Haptics.impactAsync(
            Haptics.ImpactFeedbackStyle.Medium
        );

        success({
            title: "Copied",
            message: "Invite code copied to clipboard",
        });

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const handleRegenerate = () => {
        if (!currentFamily?.family_id) return;

        regenerateInviteMutation(
            {
                familyId: currentFamily.family_id,
            },
            {
                onSuccess: () => {
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success
                    );

                    success({
                        title: "Updated",
                        message: "Invite code regenerated",
                    });
                },
            }
        );
    };

    return (
        <View className="bg-white p-4 rounded-3xl items-center shadow-sm border border-primary-light flex flex-col gap-4">
            <View className="flex justify-center items-center p-10 bg-primary-light w-full rounded-3xl border-4 border-dashed border-primary">
                <Typo variant="h2" className="text-primary">
                    {inviteCode?.invite_code}
                </Typo>
            </View>

            <View>
                <Typo variant="body" className="text-center">
                    Share this code to invite new members to your family team.
                </Typo>
            </View>

            <View className="flex-row gap-3 w-full">
                <Button
                    className="flex-1"
                    onPress={handleCopy}
                >
                    <Feather
                        name={copied ? "check" : "copy"}
                        size={16}
                        color={colors.white}
                    />

                    <Typo
                        variant="h3"
                        className="text-white"
                        numberOfLines={1}
                    >
                        Copy
                    </Typo>
                </Button>

                <Button
                    variant="secondary"
                    className="flex-1 border border-text"
                    onPress={handleRegenerate}
                    disabled={isPending}
                >
                    <Feather
                        name="refresh-cw"
                        size={16}
                        color={colors.text}
                    />

                    <Typo
                        variant="h3"
                        className="text-text"
                        numberOfLines={1}
                    >
                        Regenerate
                    </Typo>
                </Button>
            </View>
        </View>
    );
}