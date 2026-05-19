import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Avatar } from "../Avatar";
import { useAuth } from "@/src/hooks/useAuth";
import { useProfile } from "@/src/hooks/queries/useProfile";
import { cn } from "@/src/utils/cn";
import { colors } from "@/src/utils/colors";

export function AppHeader() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const hasUnreadNotifications = true; 

  return (
    <View 
      className="flex-row items-center justify-between px-5 py-4 bg-primary  border-b border-black/5"
    >
      <Avatar avatarUrl={profile.avatar_url} name={profile?.name} />

      <Pressable 
        className={cn(
          "w-10 h-10 items-center justify-center rounded-full transition-all active:scale-95",
          "bg-white/80 border border-white/40 shadow-sm"
        )}
        onPress={() => {
        }}
      >
        <Feather 
          name="bell" 
          size={20} 
          color={colors.black}
        />

        {hasUnreadNotifications && (
          <View 
            className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-danger border-2 border-white"
          />
        )}
      </Pressable>
    </View>
  );
}