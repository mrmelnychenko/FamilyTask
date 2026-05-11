import { Feather, FontAwesome5 } from "@expo/vector-icons";

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
        href: '/(protected)/create-task',
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
