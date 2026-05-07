import React, { useRef, useState } from "react";
import {
    TextInput,
    View,
    TextInputProps,
    Animated,
    TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { cn } from "@/src/utils/cn";
import { Typo } from "./Typo";
import { colors } from "@/src/utils/colors";

import { useEffect } from "react"; 

type Props = TextInputProps & {
    label?: string;
    error?: string | boolean | null;
    secureTextEntry?: boolean;
    icon?: (color: string) => React.ReactNode;
};

export function Input({
    label,
    error,
    secureTextEntry,
    className,
    icon,
    ...props
}: Props) {
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(!!secureTextEntry);
    const shakeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (error) {
            triggerShake();
        }
    }, [error]);

    function triggerShake() {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 6, duration: 40, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
        ]).start();
    }

    const iconColor = error
        ? colors.danger
        : focused
            ? colors.primary
            : colors.muted;

    return (
        <Animated.View
            style={{ transform: [{ translateX: shakeAnim }] }}
            className={cn("gap-1", className)}
        >
            {label && (
                <Typo className="text-text font-medium ml-1 mb-1">
                    {label}
                </Typo>
            )}

            <View
                className={cn(
                    "flex-row items-center px-5 h-14 rounded-full border bg-white",
                    focused ? "border-primary" : "border-border",
                    error ? "border-danger shadow-sm" : "" 
                )}
            >
                {icon && <View className="mr-2">{icon(iconColor)}</View>}
                
                <TextInput
                    className="flex-1 text-text"
                    style={{ fontFamily: "Nunito-Regular", fontSize: 14 }}
                    placeholderTextColor={colors.light}
                    secureTextEntry={hidden}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    {...props}
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setHidden((p) => !p)}
                        className="p-2 -mr-2"
                    >
                        <Feather
                            name={hidden ? "eye-off" : "eye"}
                            size={18}
                            color={error ? colors.danger : (focused ? colors.primary : colors.muted)}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {typeof error === "string" && (
                <Typo className="text-danger text-xs ml-4 mt-1">
                    {error}
                </Typo>
            )}
        </Animated.View>
    );
}