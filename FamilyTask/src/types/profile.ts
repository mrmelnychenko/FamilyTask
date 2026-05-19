export interface IProfile {
    id: string;
    email: string | null;
    name: string | null;
    avatar_emoji: string;
    avatar_url: string | null;
    role: "OWNER" | "ADMIN" | "MEMBER";
    xp: number;
    streak: number;
    created_at: string;
  };
