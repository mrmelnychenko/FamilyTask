import { useCurrentFamily, useFamilyMembers } from "@/src/hooks/queries/useFamily"
import { useAuth } from "@/src/hooks/useAuth"
import { FlatList, Pressable, View } from "react-native"
import { Typo } from "../ui/Typo"
import { cn } from "@/src/utils/cn"
import { Avatar } from "../ui/Avatar"
import { useState } from "react"

export function StoryList({ onSelectMembers }: { onSelectMembers?: (ids: string[]) => void }) {
    const { user } = useAuth();
    const { data: family } = useCurrentFamily(user?.id);
    const { data: familyMembers } = useFamilyMembers(family?.family_id);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
    const toggleMember = (id: string) => {
      const next = selectedIds.includes(id)
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id];
  
      setSelectedIds(next);
      onSelectMembers?.(next);
    };
  
    const selectAll = () => {
      setSelectedIds([]);
      onSelectMembers?.([]);
    };
  
    const isAllSelected = selectedIds.length === 0;
    const allItem = { id: "all", profiles: { name: "All", avatar_url: null } };
    const data = [allItem, ...(familyMembers ?? [])];
  
    return (
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-4 px-4 pb-4"
        renderItem={({ item }) => {
          const isAll = item.id === "all";
          const isActive = isAll ? isAllSelected : selectedIds.includes(item.id);
  
          return (
            <Pressable
              className="items-center gap-1"
              onPress={() => (isAll ? selectAll() : toggleMember(item.id))}
            >
              <View className={cn(
                "w-14 h-14 rounded-full items-center justify-center",
                isActive ? "border-4 border-primary" : "border-2 border-outline opacity-50"
              )}>
                {isAll ? (
                  <Typo className="font-bold text-lg">All</Typo>
                ) : (
                  <Avatar
                    size={50}
                    avatarUrl={item.profiles?.avatar_url}
                    name={item.profiles?.name}
                  />
                )}
  
                {isActive && !isAll && (
                  <View className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5 border-2 border-background">
                    <Typo className="text-[10px] text-white">✓</Typo>
                  </View>
                )}
              </View>
  
              <Typo className={cn(
                "text-[12px] font-bold",
                isActive ? "text-primary" : "text-muted"
              )}>
                {item.profiles?.name}
              </Typo>
            </Pressable>
          );
        }}
      />
    );
  }