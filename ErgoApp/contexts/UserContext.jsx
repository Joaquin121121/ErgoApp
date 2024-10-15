import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // React Native storage

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
  });

  // Load the stored user from AsyncStorage when the component mounts
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  // Store the user in AsyncStorage whenever it changes
  useEffect(() => {
    const storeUser = async () => {
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem("user");
      }
    };
    storeUser();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
