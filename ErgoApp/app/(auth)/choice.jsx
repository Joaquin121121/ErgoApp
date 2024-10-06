import { View, Text } from "react-native";
import React from "react";
import Choice from "../../components/Choice";
import { router, useLocalSearchParams } from "expo-router";

const choice = () => {
  const { options, title } = useLocalSearchParams();
  const parsedOptions = options.split(",");
  return <Choice options={parsedOptions} title={title} />;
};

export default choice;
