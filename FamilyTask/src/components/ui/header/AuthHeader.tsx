import { View } from "react-native";
import { Typo } from "../Typo";
import AntDesign from "@expo/vector-icons/AntDesign";


interface IAuthHeader {
    title: string
    text: string
}

export function AuthHeader({ title, text }: IAuthHeader) {
    return (
      <View className="px-5 pt-2">
  
        <View className="items-center mt-6 gap-3">
  
          <View className="w-16 h-16 rounded-2xl items-center justify-center bg-primary">
            <AntDesign name="home" size={32} color="white" />
          </View>
  
          <Typo variant="h1" className="text-center">
            {title}
          </Typo>
  
          <Typo variant="h3" className="text-muted text-center">
            {text}
          </Typo>
  
        </View>
      </View>
    );
  }