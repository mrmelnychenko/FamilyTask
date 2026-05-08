import { supabase } from "../lib/supabase";

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
}

// export async function createProfile(user: any) {
//   const fallbackName =
//     user.user_metadata?.name?.trim() || user.email?.split("@")[0] || "New User";

//   const { data, error } = await supabase
//     .from("profiles")
//     .insert({
//       id: user.id,
//       email: user.email,
//       name: fallbackName,
//       avatar_emoji: "😊",
//       role: "MEMBER",
//     })
//     .select("*")
//     .single();

//   if (error) throw error;
//   return data;
// }
