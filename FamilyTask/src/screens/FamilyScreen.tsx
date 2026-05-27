import { ScrollView, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useCurrentFamily } from "../hooks/queries/useFamily";
import { TeamHeader } from "../components/ui/TeamHeader";
import { SquadMembers } from "../components/ui/SquadMembers";
import { InviteCard } from "../components/ui/InviteCard";



export function FamilyScreen() {
    const { user } = useAuth()
    const { data: currentFamily } = useCurrentFamily(user?.id)
    return (
        <View className="flex-1">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, }}
                showsVerticalScrollIndicator={false}
            >
                
                <TeamHeader />
                <SquadMembers />
                <InviteCard />
            </ScrollView>
        </View>
    )
}