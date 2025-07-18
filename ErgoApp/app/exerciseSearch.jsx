import { View, Text } from "react-native";
import React from "react";
import Search from "../components/Search";
import { useLocalSearchParams } from "expo-router";

const exerciseSearch = () => {
  const { currentStudy } = useLocalSearchParams();
  return <Search currentStudy={currentStudy} field="movimiento" />;
};

export default exerciseSearch;
