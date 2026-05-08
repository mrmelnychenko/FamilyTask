import { colors } from "@/src/utils/colors";
import React from "react";
import { View, ActivityIndicator } from "react-native";

type Props = {
  color?: string;
};

export function LoadingScreen({ color = colors.primary }: Props) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
}