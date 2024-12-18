import { View, Text } from "react-native";
import React from "react";
import Choice from "../../components/Choice";
import { router, useLocalSearchParams } from "expo-router";

const choice = () => {
  const { category, title, context } = useLocalSearchParams();
  return <Choice category={category} title={title} context={context} />;
};

export default choice;
