import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { User, Role } from "../types/User";
import {
  Athlete,
  initialAthlete,
  WellnessData,
  SessionPerformanceData,
} from "../types/Athletes";
import { Coach, initialCoach } from "../types/Coach";

import { useDatabaseSync } from "../hooks/useDatabaseSync";
import {
  getAthleteAsUser,
  savePollResults as savePollResultsToDb,
  saveSessionPerformance as saveSessionPerformanceToDb,
  saveAthleteDataAsUser as saveAthleteDataAsUserToDb,
} from "../parsers/athleteDataParser";
import { Progression } from "../types/trainingPlan";
import { getCurrentDayName } from "../utils/utils";

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
  savePollResults: (
    athleteId: string,
    wellnessData: WellnessData
  ) => Promise<void>;
  saveSessionPerformance: (
    athleteId: string,
    sessionPerformance: SessionPerformanceData,
    exercises: any[]
  ) => Promise<void>;
  saveAthleteDataAsUser: (athleteData: Athlete) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(initialUserState);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>("athlete");
  const [userData, setUserData] = useState<Coach | Athlete | null>(null);
  const { pushRecord, fullScaleSync, resetSyncMetadata } = useDatabaseSync();

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
        weightUnit: "kg",
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
          const supabaseUser = mapSupabaseUser(session.user);
          setUser(supabaseUser);
          await resetSyncMetadata();
          await fullScaleSync(supabaseUser.email || "", "athlete");
          const athlete = await getAthleteAsUser(supabaseUser.email || "");
          console.log("athlete from getAthleteAsUser", athlete);
          console.log(
            "athlete current training plan: ",
            athlete?.currentTrainingPlan?.sessions[0].exercises
          );
          if (athlete) {
            setUserData(athlete);
          }
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

      if (error) {
        return { error: error.message };
      }

      return undefined; // Success case
    } catch (error) {
      return { error: "Error de conexión. Inténtalo de nuevo." };
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

  // Save poll results
  const savePollResults = async (
    athleteId: string,
    wellnessData: WellnessData
  ): Promise<void> => {
    try {
      console.log("Saving poll results for athlete:", athleteId);
      await savePollResultsToDb(athleteId, wellnessData, pushRecord);
      const updatedUserData = userData as Athlete;
      updatedUserData.wellnessData = [
        ...(updatedUserData.wellnessData || []),
        wellnessData,
      ];
      setUserData(updatedUserData);
    } catch (error) {
      console.error("Error saving poll results:", error);
      throw error;
    }
  };

  // Save session performance
  const saveSessionPerformance = async (
    athleteId: string,
    sessionPerformance: SessionPerformanceData,
    exercises: any[]
  ): Promise<void> => {
    // Extract progressions from exercises
    const progressions: Progression[] = exercises
      .map((ex) => ex.extendedProgression)
      .filter((prog) => prog !== undefined)
      .map((prog) => ({
        id: prog.id,
        series: prog.series,
        repetitions: prog.repetitions,
        effort: prog.effort,
        weight: prog.weight,
        weightUnit: prog.weightUnit,
        completed: prog.completed,
      }));
    const athleteData = userData as Athlete;
    const currentTrainingSession =
      athleteData?.currentTrainingPlan?.sessions.find(
        (session) => session.id === sessionPerformance.sessionId
      );

    const performancesForSessionAndWeekN =
      athleteData.sessionPerformanceData?.filter(
        (session) =>
          session.sessionId === sessionPerformance.sessionId &&
          session.week ===
            new Date(sessionPerformance.week).toISOString().split("T")[0]
      ).length || 0;

    if (!currentTrainingSession) return;
    const correspondingDayName =
      currentTrainingSession.days[
        Math.min(
          performancesForSessionAndWeekN,
          currentTrainingSession.days.length - 1
        )
      ];
    const today = getCurrentDayName();
    console.log("today: ", today);
    console.log("correspondingDayName: ", correspondingDayName);
    const alternativeDate =
      today !== correspondingDayName ? new Date() : undefined;
    const processedSessionPerformance: SessionPerformanceData = {
      ...sessionPerformance,
      week: new Date(sessionPerformance.week).toISOString().split("T")[0],
      sessionDayName: correspondingDayName,
      alternativeDate: alternativeDate?.toISOString().split("T")[0],
    };
    console.log("processedSessionPerformance: ", processedSessionPerformance);
    try {
      console.log("progressions:", progressions);
      await saveSessionPerformanceToDb(
        athleteId,
        processedSessionPerformance,
        progressions,
        pushRecord
      );

      // Update userData after successful database transaction
      if (userData && "id" in userData && userData.id === athleteId) {
        const updatedUserData = { ...userData } as Athlete;

        // Update currentTrainingPlan progressions
        if (updatedUserData.currentTrainingPlan) {
          const updatedPlan = { ...updatedUserData.currentTrainingPlan };

          // Update progressions in all sessions
          updatedPlan.sessions = updatedPlan.sessions.map((session) => ({
            ...session,
            exercises: session.exercises.map((exercise) => {
              if (exercise.type === "selectedExercise") {
                // Update progressions for selected exercises
                const updatedProgression = exercise.progression.map((prog) => {
                  const matchingProgression = progressions.find(
                    (p) => p.id === prog.id
                  );
                  return matchingProgression || prog;
                });
                return { ...exercise, progression: updatedProgression };
              } else if (exercise.type === "trainingBlock") {
                // Update progressions for exercises within training blocks
                const updatedSelectedExercises = exercise.selectedExercises.map(
                  (selectedExercise) => {
                    const updatedProgression = selectedExercise.progression.map(
                      (prog) => {
                        const matchingProgression = progressions.find(
                          (p) => p.id === prog.id
                        );
                        return matchingProgression || prog;
                      }
                    );
                    return {
                      ...selectedExercise,
                      progression: updatedProgression,
                    };
                  }
                );
                return {
                  ...exercise,
                  selectedExercises: updatedSelectedExercises,
                };
              }
              return exercise;
            }),
          }));

          updatedUserData.currentTrainingPlan = updatedPlan;
        }

        // Add session performance to sessionPerformanceData
        if (!updatedUserData.sessionPerformanceData) {
          updatedUserData.sessionPerformanceData = [];
        }

        updatedUserData.sessionPerformanceData.push(
          processedSessionPerformance
        );

        // Update the userData state
        console.log(
          "updatedUserData: ",
          updatedUserData.sessionPerformanceData
        );
        setUserData(updatedUserData);
      }
    } catch (error) {
      console.error("Error saving session performance:", error);
      throw error;
    }
  };

  // Save athlete data as user
  const saveAthleteDataAsUser = async (athleteData: Athlete): Promise<void> => {
    try {
      console.log("Saving athlete data for user:", athleteData);
      await saveAthleteDataAsUserToDb(athleteData, pushRecord);
      // Update the local userData state with the new data
      setUserData(athleteData);
    } catch (error) {
      console.error("Error saving athlete data:", error);
      throw error;
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
        savePollResults,
        saveSessionPerformance,
        saveAthleteDataAsUser,
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
