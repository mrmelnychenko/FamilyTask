import { useCurrentFamily, useUpdateFamilyName } from "@/src/hooks/queries/useFamily";
import { useAuth } from "@/src/hooks/useAuth";
import { useState } from "react";
import { View } from "react-native";
import { Input } from "../Input";
import { Button } from "../Button";
import { Typo } from "../Typo";
import { useAppToast } from "@/src/hooks/useToast";

export function FamilyEditName() {
    const { user } = useAuth();
    const { data: currentFamily } = useCurrentFamily(user?.id);
    const { mutate: updateName, isPending } = useUpdateFamilyName();
    const { success, error } = useAppToast();

    const originalName = currentFamily?.families?.name ?? '';
    const [familyName, setFamilyName] = useState(originalName);

    const hasChanges = familyName.trim() !== originalName;

    const handleSave = () => {
        if (!currentFamily?.family_id || !familyName.trim()) return;
        updateName(
            { familyId: currentFamily.family_id, name: familyName.trim() },
            {
                onSuccess: () => {
                    success({
                        title: 'Saved',
                        message: 'Family name updated successfully',
                    });
                },
                onError: () => {
                    error({
                        title: 'Error',
                        message: 'Failed to update family name',
                    });
                },
            }
        );
    };

    return (
        <View className="bg-white p-4 rounded-3xl shadow-sm border border-primary-light w-full gap-4">
            <Input
                label="Family name"
                value={familyName}
                onChangeText={setFamilyName}
                placeholder="Enter family name"
            />
            <Button onPress={handleSave} loading={isPending} disabled={!hasChanges}>
                <Typo variant="h3" className="text-white font-semibold">
                    Save changes
                </Typo>
            </Button>
        </View>
    );
}