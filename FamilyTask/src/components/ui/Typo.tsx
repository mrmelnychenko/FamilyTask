import { cn } from "@/src/utils/cn";
import React from "react";
import { Text as RNText, TextProps, StyleProp, TextStyle } from "react-native";

type Variant = "h1" | "h2" | "h3" | "body" | "label" | "points";

type Props = TextProps & {
  variant?: Variant;
  style?: StyleProp<TextStyle>;
};

const variants: Record<Variant, TextStyle> = {
  h1: {
    fontSize: 32,
    fontFamily: "Nunito-ExtraBold",
  },
  h2: {
    fontSize: 24,
    fontFamily: "Nunito-Bold",
  },
  h3: {
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
  body: {
    fontSize: 14,
    fontFamily: "Nunito-Regular",
  },
  label: {
    fontSize: 11,
    fontFamily: "Nunito-Bold",
  },
  points: {
    fontSize: 12,
    fontFamily: "Nunito-Bold",
  },
};

export function Typo({
  variant = "body",
  className,
  style,
  children,
  ...props
}: Props) {
  return (
    <RNText
      {...props}
      style={[variants[variant], style]}
      className={cn("text-text", className)}
    >
      {children}
    </RNText>
  );
}