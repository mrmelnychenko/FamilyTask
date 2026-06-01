import { ScrollView, View } from "react-native"
import { ProfileTop } from "../components/profile/ProfileTop"
import { ProfileActionButton } from "../components/profile/ProfileActionButton"


export function ProfileScreen() {
    
    return (
        <View className="flex-1">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, }}
                showsVerticalScrollIndicator={false}

            >
                <ProfileTop />
                <ProfileActionButton />
            </ScrollView>
        </View>
    )
}