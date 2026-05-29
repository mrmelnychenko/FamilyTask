import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typo } from "../Typo";
import { MaterialIcons } from "@expo/vector-icons";
import { useMemberSheet } from "@/src/store/store";
import { colors } from "@/src/utils/colors";
import { useRemoveMember, useUpdateMemberRole } from "@/src/hooks/queries/useFamily";
import { Avatar } from "../Avatar";
import { useAppToast } from "@/src/hooks/useToast";

export function MemberActionBottomHost() {
    const { visible, member, close } = useMemberSheet();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const insets = useSafeAreaInsets();

    const snapPoints = useMemo(() => ['40%'], []);

    const updateRole = useUpdateMemberRole();
    const removeMember = useRemoveMember();

    const { success, error } = useAppToast();

    // BACKDROP
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.4}
                pressBehavior="close"
            />
        ),
        []
    );

    useEffect(() => {
        if (visible && member) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [visible, member]);

    const handleChangeRole = () => {
        if (!member) return;
        const newRole = member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN';

        updateRole.mutate(
            {
                memberId: member.id,
                role: newRole,
            },
            {
                onSuccess: () => {
                    success({
                        title: "Updated",
                        message:
                            newRole === "ADMIN"
                                ? "Member promoted to admin"
                                : "Admin rights removed",
                    });
                    close();
                },
                onError: () => {
                    error({
                        title: "Error",
                        message: "Failed to update role",
                    });
                },
            }
        );
    };

    const handleRemove = () => {
        if (!member) return;
        removeMember.mutate(member.id, {
            onSuccess: () => {
                success({
                    title: "Removed",
                    message: "Member removed from family",
                });
                close();
            },
            onError: () => {
                error({
                    title: "Error",
                    message: "Failed to remove member",
                });
            },
        });
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1} 
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={close}
            backdropComponent={renderBackdrop}
            topInset={insets.top}
            handleIndicatorStyle={{ backgroundColor: colors.cyanBg }}
            backgroundStyle={{ backgroundColor: colors.white }}
            enableDynamicSizing={false}
        >
                
                {/* HEADER */}
                <View className="px-5 py-3 flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                        <Avatar
                            size={40}
                            name={member?.profiles?.name || ""}
                            avatarUrl={member?.profiles?.avatar_url}
                        />

                        <View>
                            <Typo className="font-bold">
                                {member?.profiles?.name || ""}
                            </Typo>

                            <Typo className="text-xs uppercase text-secondary">
                                {member?.role || ""}
                            </Typo>
                        </View>
                    </View>

                    <Pressable onPress={close}>
                        <MaterialIcons
                            name="close"
                            size={20}
                            color={colors.text}
                        />
                    </Pressable>
                </View>

                {/* ACTIONS */}
                <View className="px-5 gap-3 mt-2">
                    <Pressable
                        onPress={handleChangeRole}
                        className="p-4 rounded-2xl bg-background active:opacity-70"
                    >
                        <Typo className="font-semibold">
                            {member?.role === 'ADMIN'
                                ? 'Downgrade to Member'
                                : 'Promote to Admin'}
                        </Typo>
                    </Pressable>

                    <Pressable
                        onPress={handleRemove}
                        className="p-4 rounded-2xl bg-background active:opacity-70"
                    >
                        <Typo className="text-danger font-semibold">
                            Remove member
                        </Typo>
                    </Pressable>
                </View>
        </BottomSheet>
    );
}
