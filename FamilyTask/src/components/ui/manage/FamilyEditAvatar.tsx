import { ActivityIndicator, Pressable, View } from "react-native";
import { Avatar } from "../Avatar";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/src/utils/colors";
import { useCurrentFamily, useUpdateFamilyAvatar } from "@/src/hooks/queries/useFamily";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/src/hooks/useAuth";

export function FamilyEditAvatar() {
    const {user} = useAuth()
    const { data: currentFamily } = useCurrentFamily(user?.id);
    const { mutate: updateAvatar, isPending } = useUpdateFamilyAvatar();
    
    const handlePickImage = async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (!permissionResult.granted) {
        alert("Permission to access camera roll is required!");
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
  
      if (!result.canceled && result.assets[0]?.uri && currentFamily?.family_id) {
        updateAvatar({
          familyId: currentFamily.family_id,
          fileUri: result.assets[0].uri,
        });
      }
    };
  
    return (
      <View className="bg-white p-4 rounded-3xl items-center shadow-sm border border-primary-light">
        <Pressable className="relative" onPress={handlePickImage} disabled={isPending}>
  
          <View className="p-1 rounded-full bg-primary">
            <View className="p-1 rounded-full bg-white">
              <Avatar size={120} name={currentFamily?.families.name} avatarUrl={currentFamily?.families?.avatar_url} />
            </View>
          </View>
  
          <View className="absolute bottom-1 right-1 bg-primary p-2 rounded-full shadow-md border-2 border-white">
            {isPending
              ? <ActivityIndicator size={14} color={colors.white} />
              : <Feather name="edit-2" size={14} color={colors.white} />
            }
          </View>
  
        </Pressable>
      </View>
    );
  }