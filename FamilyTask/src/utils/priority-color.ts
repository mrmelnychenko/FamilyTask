import { TaskPriority } from "../types/task";
import { colors } from "./colors";

export function getPriorityStyle(priority: TaskPriority = "normal") {
    const styles = {
        low: {
            bg: colors.goldBg,
            text: colors.gold,
        },
        normal: {
            bg: colors.primaryLight,
            text: colors.primary,
        },
        high: {
            bg: colors.dangerBg,
            text: colors.danger,
        },
    };

    return styles[priority];
}