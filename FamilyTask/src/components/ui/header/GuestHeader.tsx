import { View } from "react-native";
import { Typo } from "../Typo";
import { Button } from "../Button";
import { router } from "expo-router";
import { Logo } from "../../common/Logo";

export function GuestHeader() {
    return (
        <View className="flex-row items-center justify-between px-4 py-3">
          <Logo />
          <Button className="bg-transparent" onPress={() => router.push('/login')}>
            <Typo variant="h2" className="text-primary">
                Увійти
            </Typo>
          </Button>
        </View>
    )
}