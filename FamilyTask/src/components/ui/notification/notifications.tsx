import { Feather, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Typo } from "../Typo";
import { Avatar } from "../Avatar";
import { INotification } from "@/src/types/notification";
import { colors } from "@/src/utils/colors";
import { TASK_CATEGORIES } from "@/src/constants/tasks";
import { getPriorityStyle } from "@/src/utils/priority-color";
import { format } from "date-fns";

export function BaseNotification({
    icon,
    color = "bg-gray-200",
    children,
}: {
    icon: React.ReactNode;
    color?: string;
    children: React.ReactNode;
}) {
    return (
        <View className="p-3 bg-white rounded-xl border border-border flex-row gap-3">
            <View className={`w-10 h-10 rounded-full items-center justify-center ${color}`}>
                {icon}
            </View>

            <View className="flex-1">
                {children}
            </View>
        </View>
    );
}
export function TaskAssignedNotification({ n }: { n: INotification }) {
    const actor = n.actor;
    const task = n.task;

    const taskCategory = TASK_CATEGORIES.find(
        (cat) => cat.key === task?.category
    );
    const priorityStyle = getPriorityStyle(task?.priority);

    const exactTime = task?.created_at
        ? format(new Date(task.created_at), "HH:mm")
        : "";

    return (
        <BaseNotification
            color="bg-blue-500"
            icon={
                <View className="w-9 h-9 items-center justify-center bg-blue-50 rounded-full">
                    <FontAwesome5
                        name="tasks"
                        size={16}
                        color={colors.blue}
                    />
                </View>
            }
        >
            {/* HEADER ROW */}
            <View className="flex-row justify-between items-start">
                <Typo variant="h3">
                    {n.title}
                </Typo>

                {/* XP TOP RIGHT */}
                {!!task?.xp_reward && (
                    <View className="bg-green-100 px-2 py-1 rounded-md">
                        <Typo variant="points" className="text-green-700">
                            ⭐ {task.xp_reward} XP
                        </Typo>
                    </View>
                )}
            </View>

            {/* ACTOR + TASK TEXT */}
            <Typo variant="body" className="mt-1">
                <Typo className="font-bold">
                    {actor?.name ?? "Someone"}
                </Typo>{" "}
                You have new task {" "}
                <Typo className="font-bold text-primary">
                    "{task?.title}"
                </Typo>
            </Typo>

            {/* BOTTOM ROW (TAGS + CREATOR INFO) */}
            <View className="flex-row justify-between items-end mt-3 gap-2">
                {/* LEFT SIDE: TAGS */}
                <View className="flex-row flex-wrap gap-2 items-center flex-1">
                    {/* CATEGORY TAG */}
                    {taskCategory && (
                        <View className="px-2 py-1 rounded-md bg-primary/10 border border-primary/20 flex-row items-center gap-1">
                            <MaterialIcons
                                name={taskCategory.icon}
                                size={14}
                                color={colors.primary}
                            />
                            <Typo variant="label" className="text-primary">
                                {taskCategory.label}
                            </Typo>
                        </View>
                    )}

                    {/* PRIORITY TAG */}
                    {task?.priority && (
                        <View
                            className="px-2 py-1 rounded-md"
                            style={{ backgroundColor: priorityStyle?.bg }}
                        >
                            <Typo
                                variant="label"
                                style={{ color: priorityStyle?.text }}
                                className="uppercase"
                            >
                                {task.priority}
                            </Typo>
                        </View>
                    )}

                    {/* RECURRENCE TAG */}
                    {task?.is_recurring && task?.recurrence && (
                        <View className="px-2 py-1 rounded-md bg-warningBg border border-warning/20 flex-row items-center gap-1">
                            <Ionicons
                                name="refresh"
                                size={13}
                                color={colors.warning}
                            />
                            <Typo variant="label" className="text-warning uppercase">
                                {task.recurrence}
                            </Typo>
                        </View>
                    )}
                </View>

                {/* RIGHT SIDE: CREATOR AVATAR + EXACT TIME */}
                <View className="flex-row items-center gap-1.5 self-end">
                    {exactTime && (
                        <Typo variant="label" className="text-muted text-[11px] font-medium">
                            {exactTime}
                        </Typo>
                    )}
                    <Typo variant="label" className="text-muted text-[11px] font-medium">
                        from {actor.name}
                    </Typo>
                    <Avatar
                        name={actor?.name}
                        avatarUrl={actor?.avatar_url}
                        size={20}
                    />
                </View>
            </View>
        </BaseNotification>
    );
}

export function TaskCompletedNotification({ n }: { n: Notification }) {
    return (
        <BaseNotification
            color="bg-green-500"
            icon={<Feather name="check-circle" size={18} color="white" />}
        >
            <Typo variant="h3">{n.title}</Typo>
            <Typo variant="body">{n.body}</Typo>
        </BaseNotification>
    );
}
export function TaskCompletedForCreatorNotification({ n }: { n: Notification }) {
    return (
        <BaseNotification
            color="bg-yellow-500"
            icon={<Feather name="star" size={18} color="white" />}
        >
            <Typo variant="h3">{n.title}</Typo>

            <Typo variant="body">{n.body}</Typo>

            {/* {!!n.task.xp_reward && (
                <Typo variant="points" className="text-green-600">
                    +{n.task.xp_reward} XP
                </Typo>
            )} */}
        </BaseNotification>
    );
}
export function TaskOverdueNotification({ n }: { n: Notification }) {
    return (
        <BaseNotification
            color="bg-red-500"
            icon={<Feather name="alert-triangle" size={18} color="white" />}
        >
            <Typo variant="h3" className="text-red-600">
                {n.title}
            </Typo>

            <Typo variant="body">{n.body}</Typo>
        </BaseNotification>
    );
}
export function FamilyMemberJoinedNotification({ n }: { n: Notification }) {
    return (
        <BaseNotification
            color="bg-purple-500"
            icon={<Feather name="user-plus" size={18} color="white" />}
        >
            <Typo variant="h3">{n.title}</Typo>
            <Typo variant="body">{n.body}</Typo>
        </BaseNotification>
    );
}
export function FamilyWelcomeNotification({ n }: { n: Notification }) {
    return (
        <BaseNotification
            color="bg-indigo-500"
            icon={<Feather name="heart" size={18} color="white" />}
        >
            <Typo variant="h3">{n.title}</Typo>
            <Typo variant="body">{n.body}</Typo>
        </BaseNotification>
    );
}
export function FamilyCreatedNotification({ n }: { n: Notification }) {
    return (
        <BaseNotification
            color="bg-blue-600"
            icon={<Feather name="home" size={18} color="white" />}
        >
            <Typo variant="h3">{n.title}</Typo>
            <Typo variant="body">{n.body}</Typo>
        </BaseNotification>
    );
}
export function RoleChangedNotification({ n }: { n: Notification }) {
    return (
        <BaseNotification
            color="bg-orange-500"
            icon={<Feather name="shield" size={18} color="white" />}
        >
            <Typo variant="h3">{n.title}</Typo>
            <Typo variant="body">{n.body}</Typo>
        </BaseNotification>
    );
}
export function DefaultNotification({ n }: { n: Notification }) {
    return (
        <BaseNotification
            color="bg-gray-400"
            icon={<Feather name="bell" size={18} color="white" />}
        >
            <Typo variant="h3">{n.title}</Typo>
            <Typo variant="body">{n.body}</Typo>
        </BaseNotification>
    );
}