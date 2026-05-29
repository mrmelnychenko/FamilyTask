import { useCurrentFamily, useFamilyMembers } from "@/src/hooks/queries/useFamily";
import { useAuth } from "@/src/hooks/useAuth";
import { FlatList, Pressable, View } from "react-native";
import { Avatar } from "../Avatar";
import { Typo } from "../Typo";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/src/utils/colors";
import { getRoleStyle } from "@/src/utils/family-settings";
import { useCurrentFamilyRole } from "@/src/hooks/useRole";
import { useState } from "react";
import { useMemberSheet } from "@/src/store/store";


export function FamilyMembersEdit() {
    const { user } = useAuth();
    const { data: currentFamily } = useCurrentFamily(user?.id);
    const { data: members } = useFamilyMembers(currentFamily?.family_id);
    const { isAdmin, isOwner } = useCurrentFamilyRole();
    const { open } = useMemberSheet();



    return (
        <>
            <View className="bg-white p-4 rounded-3xl shadow-sm border border-primary-light">
                <FlatList
                    data={members}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                        const isMe = item.profiles.id === user?.id;
                        return (
                            <View className="px-2">
                                <View className={`flex-row items-center justify-between px-3 py-4 rounded-2xl ${isMe ? "bg-primary-light/40" : ""}`}>
                                    <View className="flex-row items-center gap-3">
                                        <Avatar size={64} name={item.profiles.name} avatarUrl={item.profiles.avatar_url} />
                                        <View className="gap-1">
                                            <View className="flex-row items-center gap-2">
                                                <Typo variant="h2" className="text-text">
                                                    {item.profiles.name}
                                                </Typo>
                                                {isMe && (
                                                    <View className="px-2 py-0.5 rounded-full bg-primary">
                                                        <Typo className="text-white text-xs">You</Typo>
                                                    </View>
                                                )}
                                            </View>
                                            <View className={`self-start px-2 py-0.5 rounded-full ${getRoleStyle(item.role)}`}>
                                                <Typo className="text-xs uppercase tracking-wider">
                                                    {item.role}
                                                </Typo>
                                            </View>
                                        </View>
                                    </View>
                                    {(isAdmin || isOwner) && !isMe && (
                                        <Pressable
                                            className="p-2 rounded-full active:bg-primary-light"
                                            onPress={() => open(item)}
                                        >
                                            <MaterialIcons name="more-vert" size={20} color={colors.black} />
                                        </Pressable>
                                    )}
                                </View>
                                <View className="h-px bg-border mx-3" />
                            </View>
                        );
                    }}
                />
            </View>
        </>
    );
}