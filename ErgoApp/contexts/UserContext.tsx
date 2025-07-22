import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { User, Role } from "../types/User";
import { Athlete, initialAthlete } from "../types/Athletes";
import { Coach, initialCoach } from "../types/Coach";
import {
  getAthleteDataAsUser,
  setAthleteDataAsUser,
} from "../parsers/athleteDataParser";
import { useDatabaseSync } from "../hooks/useDatabaseSync";

const initialUserState: User = {
  email: "",
};

interface UserContextType {
  user: User;
  role: Role;
  setRole: React.Dispatch<React.SetStateAction<Role>>;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  login: (
    email: string,
    password: string
  ) => Promise<{ error: any } | undefined>;
  signup: (email: string, password: string) => Promise<{ error: any }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<{ error: any }>;
  loading: boolean;
  isLoggedIn: boolean;
  userData: Coach | Athlete | null;
  setUserData: React.Dispatch<React.SetStateAction<Coach | Athlete | null>>;
  linkAthleteToCoach: (
    athleteId: string
  ) => Promise<"success" | "nonExistent" | "alreadyRegistered">;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(initialUserState);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>("athlete");
  const [userData, setUserData] = useState<Coach | Athlete | null>(null);
  const { pushRecord } = useDatabaseSync();

  // Map Supabase user to our User type
  const mapSupabaseUser = (supabaseUser: any): User => {
    if (!supabaseUser) return initialUserState;

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      phone: supabaseUser.phone || "",
      created_at: supabaseUser.created_at,
      updated_at: supabaseUser.updated_at,
      last_sign_in_at: supabaseUser.last_sign_in_at,
      confirmed_at:
        supabaseUser.confirmed_at || supabaseUser.email_confirmed_at,
      is_confirmed: !!supabaseUser.email_confirmed_at,
      role: supabaseUser.role,
      user_metadata: supabaseUser.user_metadata,
      app_metadata: supabaseUser.app_metadata,
    };
  };

  const linkAthleteToCoach = async (
    athleteId: string
  ): Promise<"success" | "nonExistent" | "alreadyRegistered"> => {
    try {
      // First, check if athlete exists
      const { data: athlete, error: fetchError } = await supabase
        .from("athlete")
        .select(
          "id, email, name, discipline, institution, category, gender, comments"
        )
        .eq("id", athleteId)
        .single();

      if (fetchError || !athlete) {
        return "nonExistent";
      }

      // Check if athlete already has an email
      if (athlete.email) {
        return "alreadyRegistered";
      }

      // If athlete exists with email NULL, set user data and return success
      const newAthlete: Athlete = {
        ...athlete,
        birthDate: new Date(),
        country: "",
        state: "",
        height: "",
        heightUnit: "cm",
        weight: "",
        weightUnit: "kgs",
        completedStudies: [],
      };
      setUserData(newAthlete);
      return "success";
    } catch (error) {
      console.error("Error in linkAthleteToCoach:", error);
      return "nonExistent";
    }
  };

  // Check for active session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      try {
        // Check for active session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setIsLoggedIn(false);
        } else if (data.session) {
          const { user: supabaseUser } = data.session;
          setUser(mapSupabaseUser(supabaseUser));
          const athlete = await getAthleteDataAsUser(supabaseUser.email || "");
          if (athlete) {
            setUserData(athlete);
          }

          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state change:", event);

        if (event === "SIGNED_OUT") {
          setIsLoggedIn(false);
          setUser(initialUserState);
          setUserData(null);
        } else if (session && session.user) {
          setUser(mapSupabaseUser(session.user));
          setIsLoggedIn(true);
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          // Session was refreshed, user remains logged in
          setUser(mapSupabaseUser(session.user));
          setIsLoggedIn(true);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  // Handle role changes
  useEffect(() => {
    if (!isLoggedIn) {
      if (role === "athlete") {
        setUserData(initialAthlete);
      } else {
        setUserData(initialCoach);
      }
    }
  }, [role, isLoggedIn]);

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      const athleteData: Athlete | null = await getAthleteDataAsUser(email);
      if (athleteData) {
        setAthleteDataAsUser(athleteData, pushRecord);
        setUserData(athleteData);
      }

      if (error) {
        return { error };
      }
    } catch (error) {
      return { error };
    }
  };

  // Sign up with email and password
  const signup = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (!error && userData) {
        const athleteData = userData as Athlete;
        const { data, error: insertError } = await supabase
          .from("athlete")
          .update({
            email: email,
            name: athleteData.name,
            birth_date: athleteData.birthDate,
            height: athleteData.height,
            height_unit: athleteData.heightUnit,
            weight: athleteData.weight,
            weight_unit: athleteData.weightUnit,
            country: athleteData.country,
            state: athleteData.state,
          })
          .eq("id", athleteData.id);

        console.log("athleteInsertionData:", data);
        if (insertError) {
          return { error: insertError };
        }
      }

      return { error };
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

  // Login with Google OAuth
  const loginWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUser(initialUserState);
      setUserData(null);
      return { error };
    } catch (error) {
      console.error("Error during logout:", error);
      return { error };
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        role,
        setRole,
        setUser,
        login,
        signup,
        loginWithGoogle,
        logout,
        loading,
        isLoggedIn,
        userData,
        setUserData,
        linkAthleteToCoach,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
