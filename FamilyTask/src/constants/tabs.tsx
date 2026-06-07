import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { ISegmentTabs } from "../types/task";

export const TABS = [
    {
        label: 'Home',
        icon: (color: string) => <Feather name="home" size={18} color={color} />,
        href: '/(protected)/(tabs)/home',
    },
    {
        label: 'Tasks',
        icon: (color: string) => <FontAwesome5 name="tasks" size={18} color={color} />,
        href: '/(protected)/(tabs)/tasks',
    },
    {
        label: 'Add',
        icon: (color: string) => <Feather name="plus" size={18} color={color} />,
        href: '/(protected)/(tabs)/create-task',
    },
    {
        label: 'Family',
        icon: (color: string) => <Feather name="users" size={18} color={color} />,
        href: '/(protected)/(tabs)/family',
    },
    {
        label: 'Profile',
        icon: (color: string) => <Feather name="user" size={18} color={color} />,
        href: '/(protected)/(tabs)/profile',
    },
];


export const TABS_TASK: ISegmentTabs[] = [
    { key: "my", label: "My" },
    { key: "all", label: "All" },
    { key: "done", label: "Done" },
  ];