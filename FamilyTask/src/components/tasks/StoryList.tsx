import { useCurrentFamily, useFamilyMembers } from "@/src/hooks/queries/useFamily"
import { useAuth } from "@/src/hooks/useAuth"
import { FlatList, Pressable, View } from "react-native"
import { Typo } from "../ui/Typo"
import { cn } from "@/src/utils/cn"
import { Avatar } from "../ui/Avatar"
import { useEffect, useMemo, useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import { useAppToast } from "@/src/hooks/useToast"

export function StoryList({
  onSelectMembers,
}: {
  onSelectMembers?: (ids: string[]) => void;
}) {
  const { user } = useAuth();

  const { data: family } = useCurrentFamily(user?.id);
  const { data: familyMembers } = useFamilyMembers(family?.family_id);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toast = useAppToast();

 
  
  const sortedMembers = useMemo(() => {
    if (!familyMembers) return [];
    return [...familyMembers].sort((a, b) => {
      if (a.profiles?.id === user?.id) return -1;
      if (b.profiles?.id === user?.id) return 1;
      return 0;
    });
  }, [familyMembers, user?.id]);

  useEffect(() => {
    if (!user?.id) return;
  
    setSelectedIds([user.id]);
    onSelectMembers?.([user.id]);
  }, [user?.id]);

  const toggleMember = (id: string) => {
    if (selectedIds.includes(id)) {
      
      if (selectedIds.length === 1){
        toast.info({
          title: "Selection required",
          message: "At least one member must be selected",
        });
        return;
      }
  
      const next = selectedIds.filter((i) => i !== id);
  
      setSelectedIds(next);
      onSelectMembers?.(next);
  
      return;
    }
  
    const next = [...selectedIds, id];
  
    setSelectedIds(next);
    onSelectMembers?.(next);
  };
  return (
    <FlatList
      data={sortedMembers}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerClassName="gap-4 px-4 pb-4"
      renderItem={({ item }) => {
        const memberId = item.profiles?.id;
      
        if (!memberId) return null;
      
        const isActive = selectedIds.includes(memberId);
      
        return (
          <Pressable
            className="items-center gap-1"
            onPress={() => toggleMember(memberId)}
          >
            <View
              className={cn(
                "w-14 h-14 rounded-full items-center justify-center",
                isActive
                  ? "border-4 border-primary"
                  : "border-2 border-outline opacity-60"
              )}
            >
              <Avatar
                size={50}
                avatarUrl={item.profiles?.avatar_url}
                name={item.profiles?.name}
              />
      
              {isActive && (
                <View className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border-2 border-background">
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
              )}
            </View>
      
            <Typo
              className={cn(
                "text-[12px] font-bold",
                isActive ? "text-primary" : "text-muted"
              )}
            >
              {item.profiles?.name}
            </Typo>
          </Pressable>
        );
      }}
    />
  );
}