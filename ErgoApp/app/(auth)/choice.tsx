import { View, Text } from "react-native";
import React from "react";
import Choice from "../../components/Choice";
import { router, useLocalSearchParams } from "expo-router";
import { ContextKey } from "../../contexts/contextUtils";

const choice = () => {
  const { category, title, context } = useLocalSearchParams() as {
    category: string;
    title: string;
    context: ContextKey;
  };
  return <Choice category={category} title={title} context={context} />;
};

export default choice;
