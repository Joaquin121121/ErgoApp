// app/_layout.jsx

import { StyleSheet, Text, View } from "react-native";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { UserProvider } from "../contexts/UserContext";

SplashScreen.preventAutoHideAsync();

export default function _layout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
    if (!fontsLoaded && !error) null;
  }, [fontsLoaded, error]);

  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="myProfile"
          options={{
            headerShown: true,
            headerTitle: "",
            headerBackTitle: " ",
            headerStyle: {
              backgroundColor: "#F5F5F5",
            },
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="prePoll"
          options={{
            headerShown: true,
            headerTitle: "",
            headerBackTitle: " ",
            headerStyle: {
              backgroundColor: "#F5F5F5",
            },
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="viewPlan"
          options={{
            headerShown: true,
            headerTitle: "",
            headerBackTitle: " ",
            headerStyle: {
              backgroundColor: "#F5F5F5",
            },
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="success"
          options={{
            headerShown: true,
            headerTitle: "",
            headerBackTitle: " ",
            headerStyle: {
              backgroundColor: "#F5F5F5",
            },
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="statGraph"
          options={{
            headerShown: true,
            headerTitle: "",
            headerBackTitle: " ",
            headerStyle: {
              backgroundColor: "#F5F5F5",
            },
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
      </Stack>
    </UserProvider>
  );
}
