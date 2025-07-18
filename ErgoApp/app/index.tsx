import { Text, View, ScrollView, Image } from "react-native";
import { Link, router } from "expo-router";
import icons from "../scripts/icons.js";
import { useEffect, useContext } from "react";
import { useUser } from "../contexts/UserContext";

export default function Index() {
  const { version, isLoading } = useUser();

  useEffect(() => {
    setTimeout(async () => {
      console.log("Version: ", version);
      if (!isLoading) {
        // Only navigate when loading is complete
        router.replace(
          `${
            version === "coach"
              ? "/coachHome"
              : version === "athlete"
              ? "/home"
              : "/versionChoice"
          }`
        );
      }
    }, 2200);
  }, [version, isLoading]); // Add version and isLoading to dependency array

  return (
    <View style={{ height: "100%" }}>
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
