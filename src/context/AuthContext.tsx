// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export interface UserProfile {
  id: string;
  role: "farmer" | "buyer";
  full_name: string;
  mobile: string;
  email?: string;
  profile_completed: boolean; 

}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user's role and name from the profiles table
  const fetchProfile = async (userId: string, userEmail?: string, userMetadata?: Record<string, any>) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (!error && data) {
      setProfile({
        ...data,
        email: userEmail,
        profile_completed: !!data.profile_completed,
      });
    } else if (userMetadata) {
      setProfile({
        id: userId,
        role: userMetadata.role || "farmer",
        full_name: userMetadata.full_name || userMetadata.name || "User",
        mobile: userMetadata.mobile || "",
        email: userEmail,
        profile_completed: false,
      });
    }
  } catch (err) {
    console.error("Error loading profile:", err);
  }
};

  useEffect(() => {
    // 1. Check active session on load
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to get session:", err);
        setLoading(false);
      });

    // 2. Listen for login / logout state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email, user.user_metadata);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAuthenticated: !!session,
        loading,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}