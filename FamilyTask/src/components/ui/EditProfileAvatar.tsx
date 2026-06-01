import { ActivityIndicator, Pressable, View } from "react-native";
import { Avatar } from "./Avatar";
import * as ImagePicker from "expo-image-picker";
import { useProfile, useUpdateAvatar } from "@/src/hooks/queries/useProfile";
import { useAuth } from "@/src/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/src/utils/colors";
import { useAppToast } from "@/src/hooks/useToast";



export function EditProfileAvatar() {
  const { user } = useAuth()
  const { data: profile } = useProfile(user?.id)
  const { mutate: updateAvatar, isPending } = useUpdateAvatar();
  const { success, error } = useAppToast();

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
      updateAvatar(
        {
          userId: profile.id,
          fileUri: result.assets[0].uri,
        },
        {
          onSuccess: () => {
            success({
              title: "Updated",
              message: "Avatar updated successfully",
            });
          },
          onError: (err: any) => {
            error({
              title: "Error",
              message: err?.message ?? "Failed to update avatar",
            });
          },
        }
      );
    }
  };

  return (
    <View className="items-center">
      <Pressable className="relative" onPress={handlePickImage} disabled={isPending}>

        <View className="p-1 rounded-full bg-primary">
          <View className="p-1 rounded-full bg-white">
            <Avatar size={120} name={profile.name} avatarUrl={profile.avatar_url} />
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