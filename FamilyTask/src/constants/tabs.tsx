import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { ISegmentTabs } from "../types/task";

export const TABS = [
    {
        label: 'Головна',
        icon: (color: string) => <Feather name="home" size={18} color={color} />,
        href: '/(protected)/(tabs)/home',
    },
    {
        label: 'Задачі',
        icon: (color: string) => <FontAwesome5 name="tasks" size={18} color={color} />,
        href: '/(protected)/(tabs)/tasks',
    },
    {
        label: 'Додати',
        icon: (color: string) => <Feather name="plus" size={18} color={color} />,
        href: '/(protected)/(tabs)/create-task',
    },
    {
        label: 'Сімʼя',
        icon: (color: string) => <Feather name="users" size={18} color={color} />,
        href: '/(protected)/(tabs)/family',
    },
    {
        label: 'Профіль',
        icon: (color: string) => <Feather name="user" size={18} color={color} />,
        href: '/(protected)/(tabs)/profile',
    },
];


export const TABS_TASK: ISegmentTabs[] = [
    { key: "my", label: "My" },
    { key: "all", label: "All" },
    { key: "done", label: "Done" },
  ];
