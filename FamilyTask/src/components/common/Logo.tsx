import { View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Typo } from "../ui/Typo";

export function Logo() {
    return (
        <View className="flex-row items-center gap-2">
            <View className="w-10 h-10 rounded-2xl items-center justify-center bg-primary">
              <AntDesign name="home" size={20} color="white" />
            </View>
            <Typo variant="h2">
              Family
              <Typo variant="h2" className="text-primary">Task</Typo>
            </Typo>
        </View>
    )
}