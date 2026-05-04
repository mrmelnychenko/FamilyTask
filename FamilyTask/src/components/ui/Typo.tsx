import React from "react";
import { Text as RNText, TextProps } from "react-native";

type Variant = "h1" | "h2" | "body" | "label" | "points";

type Props = TextProps & {
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  h1: "text-[24px] font-nunito-bold text-text",
  h2: "text-[18px] font-nunito-bold text-text",
  body: "text-[14px] font-nunito text-muted",
  label: "text-[11px] font-nunito-bold text-light",
  points: "text-[12px] font-nunito-bold text-white",
};

export function Typo({
  variant = "body",
  className,
  children,
  ...props
}: Props) {
  return (
    <RNText
      {...props}
      className={`${variants[variant]} ${className ?? ""}`}
    >
      {children}
    </RNText>
  );
}