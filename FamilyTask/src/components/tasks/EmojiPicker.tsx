import { Pressable, View } from "react-native";

import { Typo } from "@/src/components/ui/Typo";
import { cn } from "@/src/utils/cn";

const EMOJI_OPTIONS = ["✅", "🧹", "📚", "🍽️", "🧺", "🐶", "🛒", "🌱"];

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function EmojiPicker({ value, onChange }: Props) {
  return (
    <View className="rounded-2xl bg-white p-4 border border-border gap-3">
      <Typo variant="label" className="uppercase text-muted">
        Emoji
      </Typo>

      <View className="flex-row flex-wrap gap-2">
        {EMOJI_OPTIONS.map((option) => (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            className={cn(
              "h-12 w-12 items-center justify-center rounded-2xl border",
              value === option
                ? "border-primary bg-primary-light"
                : "border-border bg-white"
            )}
          >
            <Typo variant="h2">{option}</Typo>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
