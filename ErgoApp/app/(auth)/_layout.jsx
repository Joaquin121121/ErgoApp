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
            headerBackTitleVisible: false,
          }}
        />

        <StatusBar></StatusBar>
      </Stack>
    </>
  );
};

export default AuthLayout;
