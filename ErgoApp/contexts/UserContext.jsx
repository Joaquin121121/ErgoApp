import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../scripts/firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
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
    registryDate: new Date().toISOString().split("T")[0],
    version: "",
  });

  const [version, setVersion] = useState("");

  // Load both user and version from storage
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
          setVersion(storedVersion);
        } else if (storedUser) {
          // Fallback to user.version if no separate version is stored
          const parsedUser = JSON.parse(storedUser);
          setVersion(parsedUser.version || "athlete");
        }
      } catch (error) {
        console.error("Error loading data:", error);
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
        } else {
          await AsyncStorage.removeItem("user");
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
        if (version) {
          await AsyncStorage.setItem("version", version);
        } else {
          await AsyncStorage.removeItem("version");
        }
      } catch (error) {
        console.error("Error storing version:", error);
      }
    };
    storeVersion();
  }, [version]);

  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        console.log("Auth state changed:", firebaseUser);
        setAuthUser(firebaseUser);
      });

      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    const updateUserInFirestore = async () => {
      try {
        if (auth?.currentUser && user) {
          const userRef = doc(db, "userdata", auth.currentUser.uid);
          await setDoc(userRef, user, { merge: true });
        }
      } catch (error) {
        console.error("Error updating user in Firestore:", error);
      }
    };

    updateUserInFirestore();
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        authUser,
        isAuthenticated: !!authUser,
        version,
        setVersion,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
