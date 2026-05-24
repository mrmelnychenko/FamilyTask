import { Platform } from "react-native";

import { supabase } from "@/src/lib/supabase";

type SavePushTokenParams = {
  userId: string;
  token: string;
};

export async function savePushToken({ userId, token }: SavePushTokenParams) {
  if (Platform.OS !== "ios" && Platform.OS !== "android") return;

  const { error } = await supabase.from("push_tokens").upsert(
    {
      user_id: userId,
      token,
      platform: Platform.OS,
      enabled: true,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "token" }
  );

  if (error) throw error;
}

export async function disablePushToken(token: string) {
  const { error } = await supabase
    .from("push_tokens")
    .update({
      enabled: false,
      updated_at: new Date().toISOString(),
    })
    .eq("token", token);

  if (error) throw error;
}
