export interface IProfile {
    id: string;
    email: string;
    name: string;
    avatar_emoji: string;
    avatar_url: string | null;
    role: "OWNER" | "ADMIN" | "MEMBER";
    xp: number;
    streak: number;
    created_at: string;
  };

  
export interface IUpdateProfile {
  userId: string;
  name: string;
  email: string;
}