import { colors } from "@/src/utils/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import { Pressable, View } from "react-native";
import { Typo } from "./Typo";



export function ArrowBack({ href, title }: { href?: Href; title?: string }) {
  const canGoBack = router.canGoBack();

  return (
    <View style={{
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3, 
  }}
  className="w-full flex-row items-center px-4 py-3 bg-white border-b border-border/40">
    
    <View className="w-10 items-start">
        {canGoBack && (
            <Pressable
                onPress={() => href ? router.push(href) : router.back()}
                className="p-2 rounded-full active:bg-primary/10 -ml-2"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
                <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
            </Pressable>
        )}
    </View>

    {title && (
        <Typo variant="h3" className="flex-1 text-center text-primary">
            {title}
        </Typo>
    )}

    <View className="w-10" />

</View>
  );
}