import { Pressable, ActivityIndicator, View } from "react-native";
import { cn } from "@/src/utils/cn";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
  className?: string;
};

export function Button({
  children,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  className,
}: ButtonProps) {
  const baseStyles =
    "flex-row items-center justify-center px-6 py-4 rounded-2xl";

  const variantStyles = {
    primary: "bg-primary",
    secondary: "bg-primary-dark",
    danger: "bg-red-500",
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variantStyles[variant],
        disabled && "opacity-50",
        className
      )}
      style={({ pressed }) => [
        pressed && { opacity: 0.8 },
        {
          shadowColor: "#A855F7",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <View className="flex-row items-center gap-2">
          {children}
        </View>
      )}
    </Pressable>
  );
}