import { supabase } from "../lib/supabase";
import { IInvite } from "../types/invite";
import { generateInviteCode } from "../utils/invite";

interface ICreateInvite {
  userId: string;
  familyId: string;
}

interface IRegenerateInvite {
  familyId: string;
}


export async function createInvite({
  userId,
  familyId,
}: ICreateInvite): Promise<IInvite> {
  const inviteCode = generateInviteCode();
  const { data, error } = await supabase
    .from("invites")
    .insert({
      family_id: familyId,
      invite_code: inviteCode,
      created_by: userId,
    })
    .select()
    .single();
  if (error) throw error;

  return data;
}

export async function regenerateNewInviteCode({
  familyId,
}: IRegenerateInvite): Promise<IInvite> {
  const inviteCode = generateInviteCode();
  const { data, error } = await supabase
    .from("invites")
    .update({
      invite_code: inviteCode,
    })
    .eq("family_id", familyId)
    .select()
    .maybeSingle();
  if (error) throw error;

  if (!data) {
    throw new Error("Invite not found");
  }

  return data;
}

export async function getActiveFamilyInvite(
  familyId: string
): Promise<IInvite | null> {
  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .eq("family_id", familyId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}
