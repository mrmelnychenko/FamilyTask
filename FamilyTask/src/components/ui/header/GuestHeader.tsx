import AntDesign from "@expo/vector-icons/AntDesign";
import { View } from "react-native";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { router } from "expo-router";

export function GuestHeader() {
    return (
        <View className="flex-row items-center justify-between px-4 py-3">

          {/* LEFT */}
          <View className="flex-row items-center gap-2">

            {/* ICON */}
            <View className="w-10 h-10 rounded-2xl items-center justify-center bg-primary">
              <AntDesign name="home" size={20} color="white" />
            </View>

            {/* TITLE */}
            <Typo variant="h2">
              Family
              <Typo variant="h2" className="text-primary">Task</Typo>
            </Typo>
          </View>

          {/* RIGHT BUTTON */}
          <Button className="bg-transparent" onPress={() => router.push('/login')}>
            <Typo variant="h2" className="text-primary">
                Увійти
            </Typo>
          </Button>

        </View>
    )
}