import { Text as RNText, TextProps } from "react-native";
import { cn } from "@/src/utils/cn";

type Variant = "h1" | "h2" | "h3" | "body" | "label" | "points";

type Props = TextProps & {
  variant?: Variant;
  className?: string;
};

const variantClasses: Record<Variant, string> = {
  h1: "text-[32px] font-extrabold",
  h2: "text-[24px] font-bold",
  h3: "text-[16px] font-bold",
  body: "text-[14px] font-normal",
  label: "text-[11px] font-bold",
  points: "text-[12px] font-bold",
};

export function Typo({
  variant = "body",
  className,
  children,
  ...props
}: Props) {
  return (
    <RNText {...props} className={cn("text-text", variantClasses[variant], className)}>
      {children}
    </RNText>
  );
}