import { View } from "react-native";
import { Typo } from "../Typo";
import { ReactElement } from "react";

interface IHero {
    title: string
    subtitle: string
    icon: ReactElement
}

export function Hero({title, subtitle, icon}: IHero) {
    return (
        <View className="px-5 pt-2">
    
          <View className="items-center mt-6 gap-3">
    
            <View className="w-16 h-16 rounded-2xl items-center justify-center bg-primary">
              {icon}
            </View>
    
            <Typo variant="h1" className="text-center">
              {title}
            </Typo>
    
            <Typo variant="h3" className="text-muted text-center">
              {subtitle}
            </Typo>
    
          </View>
        </View>
      );
}