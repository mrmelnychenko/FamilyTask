import { supabase } from "../lib/supabase";
import { createInvite } from "./invite-service";

export type FamilyMemberProfile = {
  id: string;
  name: string | null;
  email: string | null;
  avatar_emoji: string | null;
  xp: number | null;
  streak: number | null;
};

export type FamilyMember = {
  id: string;
  role: string | null;
  created_at: string;
  profiles: FamilyMemberProfile | FamilyMemberProfile[] | null;
};

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
    throw new Error("Сім'ю з таким кодом не знайдено");
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

export async function getCurrentFamily(userId: string) {
  const { data, error } = await supabase
    .from("family_members")
    .select(
      `
      family_id,
      role,
      families (
        id,
        name
      )
    `
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.log("getCurrentFamily error:", error);
    return null;
  }

  return data;
}


export async function getFamilyMembers(
  familyId: string
): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from("family_members")
    .select(`
      id,
      role,
      created_at,
      profiles (
        id,
        name,
        email,
        avatar_emoji,
        xp,
        streak
      )
    `)
    .eq("family_id", familyId);

  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as FamilyMember[];
}
