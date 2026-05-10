import { colors } from "@/src/utils/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";



export function ArrowBack() {
    const canGoBack = router.canGoBack();
    return (
      <>
        {canGoBack && (
          <Pressable
            onPress={() => router.back()}
            className="absolute top-8 left-7 z-10 w-10 shadow-md h-10 rounded-xl bg-white border border-border items-center justify-center"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <MaterialIcons name="keyboard-arrow-left" size={20} color={colors.text} />
          </Pressable>
        )}
      </>
    );
  }