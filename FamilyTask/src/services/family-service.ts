import { supabase } from "../lib/supabase";
import { createInvite } from "./invite-service";


export type FamilyMemberProfile = {
  id: string;
  name: string;
  email: string | null;
  avatar_emoji: string | null;
  avatar_url: string | null;
  xp: number | null;
  streak: number | null;
};

export type FamilyMember = {
  id: string;
  role: string;
  created_at: string;
  profiles: FamilyMemberProfile;
};

export async function updateFamilyName(familyId: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('families')
    .update({ name })
    .eq('id', familyId);

  if (error) throw error;
}


export async function createFamilyService({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) {
  const { data: family, error } = await supabase
    .from("families")
    .insert({ name, created_by: userId })
    .select()
    .single();

  if (error || !family) {
    throw new Error(error?.message);
  }

  const invite = await createInvite({ userId, familyId: family.id });

  return { family, inviteCode: invite.invite_code };
}

export async function uploadFamilyAvatar(familyId: string, fileUri: string) {
  const fileName = `${Date.now()}.jpg`;
  const filePath = `${familyId}/${fileName}`;

  const response = await fetch(fileUri);
  const arrayBuffer = await response.arrayBuffer();


  if (!arrayBuffer.byteLength) {
    throw new Error("Empty image buffer (iOS issue)");
  }

  const { error } = await supabase.storage
    .from("family-avatars")
    .upload(filePath, arrayBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("family-avatars")
    .getPublicUrl(filePath);
  const { error: updateError } = await supabase
    .from("families")
    .update({ avatar_url: data.publicUrl })
    .eq("id", familyId);

  if (updateError) throw updateError;

  return data.publicUrl;
}

export async function joinFamilyService({
  code,
  userId,
}: {
  code: string;
  userId: string;
}) {
  const { data: invite, error: inviteError } = await supabase
    .from("invites")
    .select("family_id")
    .eq("invite_code", code)
    .eq("status", "pending")
    .single();
  if (inviteError || !invite) {
    throw new Error("Not found family");
  }

  const { error: memberError } = await supabase.from("family_members").insert({
    family_id: invite.family_id,
    user_id: userId,
    role: "MEMBER",
  });

  if (memberError) {
    throw new Error(memberError.message);
  }

  return invite;
}

export type CurrentFamily = {
  family_id: string;
  role: string;
  families: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
} | null;

export async function getCurrentFamily(userId: string): Promise<CurrentFamily> {
  const { data, error } = await supabase
    .from("family_members")
    .select(
      `
      family_id,
      role,
      families (
        id,
        name,
        avatar_url
      )
    `
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.log("getCurrentFamily error:", error);
    return null;
  }

  return data as CurrentFamily;
}

export async function getFamilyMembers(
  familyId: string
): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from("family_members")
    .select(
      `
      id,
      role,
      created_at,
      profiles (
        id,
        name,
        email,
        avatar_emoji,
        avatar_url,
        xp,
        streak
      )
    `
    )
    .eq("family_id", familyId);

  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as FamilyMember[];
}

export async function updateMemberRole(
  memberId: string,
  role: 'ADMIN' | 'MEMBER'
) {
  const { data, error } = await supabase
      .from('family_members')
      .update({ role })
      .eq('id', memberId)
      .select()
      .single();

  if (error) throw error;

  return data;
}

export async function removeFamilyMember(memberId: string) {
  const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', memberId);

  if (error) throw error;

  return true;
}

export async function getFamilyLeaderboard(
  familyId: string,
  period: "week" | "month" | "all"
) {
  const { data, error } = await supabase.rpc("get_family_leaderboard", {
    p_family_id: familyId,
    p_period: period,
  });
  if (error) throw new Error(error.message);

  return data ?? [];
}
