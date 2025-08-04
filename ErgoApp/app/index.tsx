import { Text, View, ScrollView, Image } from "react-native";
import { Link, router } from "expo-router";
import icons from "../scripts/icons";
import { useEffect, useContext } from "react";
import { useUser } from "../contexts/UserContext";
import { useDatabaseSync } from "../hooks/useDatabaseSync";
import { resetExpoDb } from "../database/resetExpoDb";

export default function Index() {
  const { resetSyncMetadata } = useDatabaseSync();
  const { isLoggedIn } = useUser();

  useEffect(() => {
    setTimeout(async () => {
      router.replace("/versionChoice");
    }, 2200);
  }, [isLoggedIn]);

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
