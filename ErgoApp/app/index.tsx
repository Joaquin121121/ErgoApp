import { Text, View, ScrollView, Image } from "react-native";
import { Link, router } from "expo-router";
import icons from "../scripts/icons.js";
import { useEffect, useContext } from "react";
import { useUser } from "../contexts/UserContext";
import { useDatabaseSync } from "../hooks/useDatabaseSync.js";

export default function Index() {
  useEffect(() => {
    setTimeout(async () => {
      router.replace("/versionChoice");
    }, 2200);
  }, []);

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
