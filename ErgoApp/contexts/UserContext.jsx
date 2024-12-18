import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../scripts/firebase";
import { doc, setDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const initialUser = {
    fullName: "",
    sport: "Football",
    category: "Amateur",
    birthDate: "01/01/1999",
    height: 180,
    heightUnit: "cm",
    weight: 70,
    weightUnit: "kg",
    email: "",
    password: "",
    gamificationFeatures: {
      streak: 0,
      targetProgress: 0,
      currentLevel: "beginner",
    },
    calendar: [],
    character: "Roger",
    targets: [],
    stats: [],
    notifications: [],
    coaches: {},
    registryDate: new Date().toISOString().split("T")[0],
    experienceLevel: 5,
    injuryHistory: [],
  };

  const [user, setUser] = useState(initialUser);
  const [isLoading, setIsLoading] = useState(true);
  const [version, setVersion] = useState(null);
  const [authUser, setAuthUser] = useState(null);

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

  // Handle Firebase auth state changes
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        console.log("Auth state changed:", firebaseUser);
        setAuthUser(firebaseUser);
      });

      return () => unsubscribe();
    }
  }, []);

  // Sync user data with Firestore
  useEffect(() => {
    const updateUserInFirestore = async () => {
      try {
        if (auth?.currentUser && user) {
          const userRef = doc(db, "userdata", auth.currentUser.uid);
          await setDoc(userRef, user, { merge: true });
          console.log("User data synced with Firestore");
        }
      } catch (error) {
        console.error("Error updating user in Firestore:", error);
      }
    };

    updateUserInFirestore();
  }, [user]);

  // Custom method to update version with storage handling
  const updateVersion = async (newVersion) => {
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

export default UserContext;
