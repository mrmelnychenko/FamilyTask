import { cn } from "@/src/utils/cn";
import { ReactNode } from "react";
import { View } from "react-native";

interface IBox {
    className?: string,
    children: ReactNode,
}

export function Box({ className, children }: IBox) {
    return (
        <View className={cn("rounded-md bg-white p-3", className)}>
            {children}
        </View>
    )
}