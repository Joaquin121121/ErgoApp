import { Text, View, ScrollView, Image } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../scripts/icons.js";
import { useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import UserContext from "../contexts/UserContext.jsx";

export default function Index() {
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    setTimeout(() => {
      router.replace("sign-in");
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
    <ScrollView contentContainerStyle={{ height: "100%" }}>
      <View className="w-full flex justify-center items-center h-full px-4 bg-secondary">
        <Image
          source={icons.splash}
          resizeMode="contain"
          style={{ width: "100%" }}
        ></Image>
      </View>
    </ScrollView>
  );
}
