import { colors } from "@/src/utils/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";



export function ArrowBack() {
    const canGoBack = router.canGoBack();
    return (
        <>
            {canGoBack && (<View className="absolute top-0 left-0 right-0 z-10 px-4 pt-2">

                <MaterialIcons
                    onPress={() => router.back()}
                    name="keyboard-arrow-left"
                    size={32}
                    color={colors.black}
                />
            </View>)}
        </>
    )
}