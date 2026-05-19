import { ActivityIndicator, Pressable, View } from "react-native";
import { Avatar } from "./Avatar";
import * as ImagePicker from "expo-image-picker";
import { useUpdateAvatar } from "@/src/hooks/queries/useProfile";
import { IProfile } from "@/src/types/profile";

interface IEditProfileAvatar {
    profile: IProfile
}

export function EditProfileAvatar({ profile }: IEditProfileAvatar) {
    const { mutate: updateAvatar, isPending } = useUpdateAvatar();
    const handlePickImage = async () => {
      
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
  
     
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images", 
        allowsEditing: true, 
        aspect: [1, 1],      
        quality: 0.5,        
      });
  
      if (!result.canceled && result.assets[0]?.uri) {
        updateAvatar({
          userId: profile.id,
          fileUri: result.assets[0].uri,
        });
      }
    };
  
    return (
      <Pressable 
        onPress={handlePickImage} 
        disabled={isPending}
        className="relative active:opacity-80"
      >
        <Avatar 
          name={profile?.name} 
          avatarUrl={profile?.avatar_url} 
          size={90} 
        />
  
        {isPending && (
          <View className="absolute inset-0 bg-black/40 rounded-full items-center justify-center">
            <ActivityIndicator color="#white" />
          </View>
        )}
      </Pressable>
    );
  }