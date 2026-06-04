import { Switch as RNSwitch, View } from "react-native";
import { Typo } from "./Typo";
import { colors } from "@/src/utils/colors";

type Props = {
    value: boolean;
    onValueChange: (value: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
};

export function Switch({
    value,
    onValueChange,
    label,
    description,
    disabled,
}: Props) {
    return (
        <View className="flex-row justify-between items-center p-4 bg-white border border-border rounded-2xl">
            {/* LEFT SIDE */}
            <View className="flex-1 pr-3">
                {label && (
                    <Typo className="font-medium text-text">
                        {label}
                    </Typo>
                )}

                {description && (
                    <Typo className="text-muted text-xs mt-0.5">
                        {description}
                    </Typo>
                )}
            </View>

            {/* SWITCH */}
            <RNSwitch
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
                trackColor={{
                    false: colors.border,
                    true: colors.primary,
                }}
                thumbColor={value ? colors.white : colors.white}
            />
        </View>
    );
}