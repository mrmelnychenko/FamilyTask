import { createContext, useCallback, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthProfile = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_emoji: string | null;
  role: string | null;
  family_id: string | null;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    try {
      setProfileLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, name, avatar_emoji, role, family_id")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        setProfile(null);
        return;
      }

      setProfile(data);
    } finally {
      setProfileLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    refreshProfile();
  }, [refreshProfile, session?.user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  const value: AuthContextType = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    profileLoading,
    refreshProfile,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
