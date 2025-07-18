import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Athlete } from "../types/Athletes";
import { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";

interface UserContextProps {
  user: Athlete;
  setUser: (user: Athlete) => void;
  authUser: User | null;
  isAuthenticated: boolean;
  version: string | null;
  setVersion: (version: string) => void;
  resetUser: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextProps | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const initialUser: Athlete = {
    id: "",
    name: "",
    discipline: "Football",
    category: "Amateur",
    birthDate: new Date("01/01/1999"),
    height: "180",
    heightUnit: "cm",
    weight: "70",
    weightUnit: "kgs",
    gender: "M",
    country: "",
    state: "",
    email: "",
    password: "",
    institution: "",
    comments: "",
    completedStudies: [],
    currentTrainingPlan: undefined,
    wellnessData: [],
    sessionPerformanceData: [],
    calendar: [],
    character: "Roger",
    objectives: [],
    gamificationFeatures: {
      streak: 0,
      targetProgress: 0,
      currentLevel: "beginner",
    },
    notifications: [],
  };

  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);

  const resetUser = () => {
    setUser(initialUser);
  };

  // Load data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedUser, storedVersion] = await Promise.all([
          AsyncStorage.getItem("user"),
          AsyncStorage.getItem("version"),
        ]);

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }

        if (storedVersion) {
          console.log("Loaded version from storage:", storedVersion);
          setVersion(storedVersion);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save user when it changes
  useEffect(() => {
    const storeUser = async () => {
      try {
        if (user) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
          console.log("User data stored successfully");
        } else {
          await AsyncStorage.removeItem("user");
          console.log("User data removed from storage");
        }
      } catch (error) {
        console.error("Error storing user:", error);
      }
    };
    storeUser();
  }, [user]);

  // Save version when it changes
  useEffect(() => {
    const storeVersion = async () => {
      try {
        console.log("Attempting to store version:", version);
        if (version) {
          await AsyncStorage.setItem("version", version);
          console.log("Version stored successfully:", version);
        } else {
          await AsyncStorage.removeItem("version");
          console.log("Version removed from storage");
        }
      } catch (error) {
        console.error("Error storing version:", error);
      }
    };

    if (version !== null) {
      storeVersion();
    }
  }, [version]);

  // Handle Supabase auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", session?.user);
        setAuthUser(session?.user || null);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Sync user data with Supabase
  useEffect(() => {
    const updateUserInSupabase = async () => {
      try {
        if (authUser && user) {
          const { error } = await supabase.from("userdata").upsert({
            ...user,
            id: authUser.id,
          });
          if (error) throw error;
          console.log("User data synced with Supabase");
        }
      } catch (error) {
        console.error("Error updating user in Supabase:", error);
      }
    };

    updateUserInSupabase();
  }, [user, authUser]);

  // Custom method to update version with storage handling
  const updateVersion = async (newVersion: string) => {
    try {
      await AsyncStorage.setItem("version", newVersion);
      setVersion(newVersion);
      console.log("Version updated successfully:", newVersion);
      return true;
    } catch (error) {
      console.error("Error updating version:", error);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        authUser,
        isAuthenticated: !!authUser,
        version,
        setVersion: updateVersion,
        resetUser,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
