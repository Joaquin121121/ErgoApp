// app/_layout.jsx

import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { UserProvider } from "../contexts/UserContext";
import { CalendarProvider } from "../contexts/CalendarContext";
import ChatHeader from "../oldVersion/ChatHeader";
import { initializeDatabase } from "../database/init";
import { SyncProvider } from "../contexts/SyncContext";
import { BlurProvider } from "../contexts/BlurContext";

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
  }, [fontsLoaded, error]);

  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <SyncProvider>
      <UserProvider>
        <CalendarProvider>
          <BlurProvider>
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
                  headerTitle: "",
                  headerShown: true,
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="prePoll"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="viewPlan"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="success"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="statGraph"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
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
                }}
              />
              <Stack.Screen
                name="addClass"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="setClassTime"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="setClassTime2"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="newClassSummary"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="coachViewPlan"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="planSummary"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="athleteInfo"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="trainingSolution"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="studies"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="studyDetails"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="dayInfo"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="loadStudy"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="screeningInfo"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="screeningParameters"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="screening"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="exerciseSearch"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="testInfo"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="wellnessPage"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="testInfoDisplay"
                options={{
                  headerShown: true,
                  headerTitle: "",
                  headerBackTitle: "\np",
                  headerStyle: {
                    backgroundColor: "#F5F5F5",
                  },
                  headerShadowVisible: false,
                }}
              />
            </Stack>
          </BlurProvider>
        </CalendarProvider>
      </UserProvider>
    </SyncProvider>
  );
}
