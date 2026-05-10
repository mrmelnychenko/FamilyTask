import { supabase } from "../lib/supabase";
import { IInvite } from "../types/invite";
import { generateInviteCode } from "../utils/invite";

interface ICreateInvite {
  userId: string;
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
