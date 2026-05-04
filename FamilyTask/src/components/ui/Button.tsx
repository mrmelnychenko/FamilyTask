import { Pressable, Text, ActivityIndicator } from "react-native";
type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: ButtonVariant;
};
export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        px-6 py-3 rounded-2xl items-center justify-center
        ${variant === "primary" ? "bg-primary" : "bg-primary-dark"}
        ${disabled ? "opacity-50" : ""}
      `}
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
        <Text className="text-white font-nunito-bold text-base">
          {title}
        </Text>
      )}
    </Pressable>
  );
}