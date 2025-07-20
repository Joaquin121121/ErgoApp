import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{ headerShown: false, title: "" }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#F5F5F5",
            },
            headerShadowVisible: false,
            headerBackTitle: "\nt",
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="choice"
          options={{
            title: "",
            headerShadowVisible: false,
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="targets"
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#F5F5F5",
            },
            headerShadowVisible: false,
            headerBackTitle: "\nt",

            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="injury-history"
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#F5F5F5",
            },
            headerShadowVisible: false,
            headerBackTitle: "\nt",

            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="sign-up-2"
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#F5F5F5",
            },
            headerShadowVisible: false,
            headerBackTitle: "\nt",

            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="versionChoice"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="coach-sign-up"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="coach-add-athletes"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="athlete-coach-link"
          options={{
            headerShown: false,
          }}
        />
        <StatusBar></StatusBar>
      </Stack>
    </>
  );
};

export default AuthLayout;
