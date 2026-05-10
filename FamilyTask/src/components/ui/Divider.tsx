import { View } from "react-native";
import { Typo } from "./Typo";

interface IDivider {
  text: string
}

export function Divider({text}: IDivider) {
    return (
        <View className="flex-row items-center gap-3 my-5">
        <View className="flex-1 h-[1px] bg-light" />
        <Typo
          variant="label"
          className="uppercase text-light"
        >
          {text}
        </Typo>
        <View className="flex-1 h-[1px] bg-light" />
      </View>
    )
}