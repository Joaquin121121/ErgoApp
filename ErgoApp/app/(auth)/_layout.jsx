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
        <Stack.Screen name="sign-up" options={{ title: "" }} />
        <Stack.Screen name="choice" />
        <Stack.Screen name="sign-up-2" options={{ title: "" }} />
        <StatusBar></StatusBar>
      </Stack>
    </>
  );
};

export default AuthLayout;