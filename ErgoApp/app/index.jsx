import { Text, View, ScrollView, Image } from "react-native";
import { Link, router } from "expo-router";
import icons from "../scripts/icons.js";
import { useEffect, useContext } from "react";
import UserContext from "../contexts/UserContext.jsx";
import { auth } from "../scripts/firebase.js";
export default function Index() {
  const { user, setUser, version } = useContext(UserContext);
  useEffect(() => {
    setTimeout(() => {
      router.replace(
        `${
          version === "coach"
            ? "coachHome"
            : version === "athlete"
            ? "home"
            : "versionChoice"
        }`
      );
    }, 2000);
    setUser({
      ...user,
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
    });
  }, []);
  return (
    <View contentContainerStyle={{ height: "100%" }}>
      <View className="w-full flex justify-center items-center h-full px-4 bg-secondary">
        <Image
          source={icons.splash}
          resizeMode="contain"
          style={{ width: "100%" }}
        ></Image>
      </View>
    </View>
  );
}
