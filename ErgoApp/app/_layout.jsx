// app/_layout.jsx

import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { UserProvider } from "../contexts/UserContext";
import { CoachProvider } from "../contexts/CoachContext";
import ChatHeader from "../components/ChatHeader";
import { ChatProvider } from "../contexts/ChatContext";
import { ClassProvider } from "../contexts/ClassContext";
import { CurrentClassProvider } from "../contexts/CurrentClassContext";

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
      <CoachProvider>
        <ChatProvider>
          <ClassProvider>
            <CurrentClassProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(coach-tabs)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="myProfile"
                  options={{
                    headerShown: true,
                    headerTitle: " ",
                    headerBackTitle: "\n",
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
                    headerBackTitle: "",
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
                    headerBackTitle: "",
                    headerStyle: {
                      backgroundColor: "#F5F5F5",
                    },
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="chat"
                  options={{
                    headerShown: true,
                    headerTitle: () => <ChatHeader />,
                    headerBackTitle: "\np",
                    headerStyle: {
                      backgroundColor: "white",
                    },
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="addClass"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerBackTitle: "",
                    headerStyle: {
                      backgroundColor: "#F5F5F5",
                    },
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="setClassTime"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerBackTitle: "",
                    headerStyle: {
                      backgroundColor: "#F5F5F5",
                    },
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="setClassTime2"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerBackTitle: "",
                    headerStyle: {
                      backgroundColor: "#F5F5F5",
                    },
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="newClassSummary"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerBackTitle: "",
                    headerStyle: {
                      backgroundColor: "#F5F5F5",
                    },
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="coachViewPlan"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerBackTitle: "",
                    headerStyle: {
                      backgroundColor: "#F5F5F5",
                    },
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="planSummary"
                  options={{
                    headerShown: true,
                    headerTitle: "",
                    headerBackTitle: "",
                    headerStyle: {
                      backgroundColor: "#F5F5F5",
                    },
                    headerShadowVisible: false,
                    headerBackTitleVisible: false,
                  }}
                />
              </Stack>
            </CurrentClassProvider>
          </ClassProvider>
        </ChatProvider>
      </CoachProvider>
    </UserProvider>
  );
}
