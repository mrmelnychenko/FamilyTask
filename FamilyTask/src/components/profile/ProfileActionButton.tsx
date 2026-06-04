import { colors } from "@/src/utils/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Typo } from "../ui/Typo";
import { Button } from "../ui/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/hooks/useAuth";

export function ProfileActionButton() {
    const router = useRouter();
    const { signOut } = useAuth();

    const handleEdit = () => {
        router.push("/profile/account/manage");
    };
    const handleSettings = () => {
        router.push("/profile/settings" as any);
    };

    const handleLogout = async () => {
        await signOut();
        router.replace("/(auth)/login");
    };
    return (
        <View className="flex flex-col gap-3 pt-4">
            <Button variant="primary" onPress={handleEdit}>
                <MaterialIcons name="edit" size={20} color={colors.white} />
                <Typo className="text-white font-bold">
                    Edit Profile
                </Typo>
            </Button>
            <Button variant="primary" onPress={handleSettings}>
                <MaterialIcons name="settings" size={20} color={colors.white} />
                <Typo className="text-white font-bold">
                    Settings Account
                </Typo>
            </Button>

            <Button variant="danger" onPress={handleLogout}>
                <MaterialIcons name="logout" size={20} color={colors.white} />
                <Typo className="text-white font-bold">
                    Logout
                </Typo>
            </Button>
        </View>
    )
}