import { LoadingScreen } from "@/src/components/ui/LoadingScreen";
import { TabsNavigation } from "@/src/components/ui/TabsNavigation";
import { AppHeader } from "@/src/components/ui/header/AppHeader";
import { useCurrentFamily } from "@/src/hooks/queries/useFamily";
import { useProfile } from "@/src/hooks/queries/useProfile";
import { useAuth } from "@/src/hooks/useAuth";
import { colors } from "@/src/utils/colors";
import { Href, Redirect, Tabs} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
    const { user } = useAuth();
    const { data: familyMember, isLoading } = useCurrentFamily(user?.id);
    const { isLoading: isProfileLoading } = useProfile(user?.id);

    if (isLoading || isProfileLoading) return <LoadingScreen />;
    if (!familyMember?.family_id) {
        return <Redirect href={"/(protected)/(family)" as Href} />;
    }

    return (
        <SafeAreaView className="flex-1 ">
                <AppHeader />
                <Tabs
                    screenOptions={{
                        headerShown: false,
                        tabBarStyle: { display: 'none' },
                        sceneStyle: {
                            backgroundColor: colors.primaryLight,
                          },
                    }}
                >
                    <Tabs.Screen name="home" />
                    <Tabs.Screen name="tasks" />
                    <Tabs.Screen name="add" />
                    <Tabs.Screen name="family" />
                    <Tabs.Screen name="profile" />
                </Tabs>
                <TabsNavigation />
        </SafeAreaView>
    );
}

