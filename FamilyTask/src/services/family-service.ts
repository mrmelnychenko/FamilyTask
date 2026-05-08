import { supabase } from "../lib/supabase";

export async function createFamilyService({
  name,
  userId,
}: {
  name: string;
  userId: string;
}) {
  const { data: family, error } = await supabase
    .from("families")
    .insert({
      name,
      created_by: userId,
    })
    .select()
    .single();
  if (error || !family) {
    throw new Error(error?.message);
  }
console.log(error, '1')
console.log(family, '2')
  return family;
}

// type Invite = {
//   family_id: string;
//   email: string | null;
//   status: string | null;
// };

// export async function joinFamilyService(params: {
//   inviteCode: string;
//   userId: string;
//   email?: string | null;
// }) {
//   const { data: invite, error } = await supabase
//     .from("invites")
//     .select("family_id, email, status")
//     .eq("invite_code", params.inviteCode)
//     .maybeSingle<Invite>();

//   if (error || !invite) {
//     throw new Error("INVITE_NOT_FOUND");
//   }

//   if (invite.status && invite.status !== "pending") {
//     throw new Error("INVITE_NOT_ACTIVE");
//   }

//   if (
//     invite.email &&
//     params.email &&
//     invite.email.toLowerCase() !== params.email.toLowerCase()
//   ) {
//     throw new Error("EMAIL_MISMATCH");
//   }

//   const { error: profileError } = await supabase
//     .from("profiles")
//     .update({ family_id: invite.family_id })
//     .eq("id", params.userId);

//   if (profileError) throw new Error("PROFILE_UPDATE_FAILED");

//   await supabase
//     .from("invites")
//     .update({ status: "accepted" })
//     .eq("invite_code", params.inviteCode);

//   return invite;
// }




export async function getCurrentFamily(userId: string) {
  const { data, error } = await supabase
    .from("family_members")
    .select(`
      family_id,
      role,
      families (
        id,
        name
      )
    `)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.log("getCurrentFamily error:", error);
    return null;
  }

  return data;
}