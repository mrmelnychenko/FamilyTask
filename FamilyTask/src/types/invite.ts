export interface IInvite {
  id: string;
  family_id: string;
  email: string | null;
  role: "ADMIN" | "MEMBER" | null;
  status: "pending" | "accepted" | "cancelled";
  invite_code: string | null;
  created_by: string | null;
  created_at: string;
}
