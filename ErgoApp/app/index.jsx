import { Text, View, ScrollView, Image } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../scripts/icons.js";
import { useEffect } from "react";

export default function Index() {
  return (
    <SafeAreaView className="h-full bg-[#EC2227]">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View
          className="w-full justify-center items-center h-full px-4"
          style={{ background: "linear-gradient(to bottom, #EC2227, #C62026)" }}
        >
          <Image
            source={icons.logo}
            className={"w-full}"}
            resizeMode="contain"
          ></Image>
          <Link href="/sign-in">Link</Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
