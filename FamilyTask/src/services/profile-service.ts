import { supabase } from "../lib/supabase";
import { File } from 'expo-file-system/next';

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}



export async function uploadAvatar(userId: string, fileUri: string): Promise<string> {
  const fileName = `${Date.now()}.jpg`;
  const filePath = `${userId}/${fileName}`;

  const file = new File(fileUri);
  const bytes = await file.bytes();

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, bytes, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: data.publicUrl })
    .eq("id", userId);

  if (updateError) throw updateError;

  return data.publicUrl;
}