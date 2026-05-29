import { ScreenLayout } from "@/src/components/ui/layout/ScreenLayout";
import { FamilyEditAvatar } from "@/src/components/ui/manage/FamilyEditAvatar";
import { FamilyEditInviteCode } from "@/src/components/ui/manage/FamilyEditInviteCode";
import { FamilyEditName } from "@/src/components/ui/manage/FamilyEditName";
import { FamilyMembersEdit } from "@/src/components/ui/manage/FamilyMembersEdit";
import { MemberActionBottomHost } from "@/src/components/ui/manage/MemberActionButton";
import { useCurrentFamilyRole } from "@/src/hooks/useRole";
import { colors } from "@/src/utils/colors";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";


export default function ManageScreen() {
    const { isAdmin } = useCurrentFamilyRole()
    if (!isAdmin) return <Redirect href="/(protected)/(tabs)/family" />
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScreenLayout
                style={{ backgroundColor: colors.primaryLight }}
                showBack
                backHref="/(protected)/(tabs)/family"
                title={"Family Settings"}
            >
                <View className="flex-1 flex-col gap-4">
                    <FamilyEditAvatar />
                    <FamilyEditName />
                    <FamilyEditInviteCode />
                    <FamilyMembersEdit />

                </View>

                
            </ScreenLayout>
            <MemberActionBottomHost />
        </>
    );
}