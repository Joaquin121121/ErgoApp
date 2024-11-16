import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../scripts/firebase"; // Asegúrate de que la ruta sea correcta

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
    version: "athlete",
  });

  const [version, setVersion] = useState("athlete");

  // Primero carga el usuario local
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
    setVersion(user.version || version);
  }, []);

  // Guarda el usuario cuando cambia
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
    setVersion(user.version || version);
  }, [user]);

  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    if (auth) {
      // Verifica que auth existe
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        console.log("Auth state changed:", firebaseUser);
        setAuthUser(firebaseUser);
      });

      return () => unsubscribe();
    }
  }, []);

  // Y modifica el Provider para incluir authUser
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
