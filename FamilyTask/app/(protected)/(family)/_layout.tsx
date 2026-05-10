import { LoadingScreen } from "@/src/components/ui/LoadingScreen";
import { useCurrentFamily } from "@/src/hooks/queries/useFamily";
import { useAuth } from "@/src/hooks/useAuth";
import { Redirect, Slot } from "expo-router";

export default function FamilyLayout() {
    const { user } = useAuth();
    const { data: familyMember, isLoading } = useCurrentFamily(user?.id);
    if (isLoading) return <LoadingScreen />;

    if (familyMember?.family_id) {
        return <Redirect href="/home" />;
    }

    return <Slot />

}