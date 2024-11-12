import { View, Text } from "react-native";
import React from "react";
import IndexDisplay from "./IndexDisplay";
import { router } from "expo-router";

const ProgressDisplay = () => {
  const progressStats = ["RSI", "DSI", "CMJ"];
  return (
    <View className="w-[85vw] h-[300] rounded-2xl shadow-sm self-center bg-white">
      <Text className="font-plight text-sm text-darkGray self-center mt-2 mb-4">
        Toca los atributos para ver más información
      </Text>
      <View className="flex flex-row h-[70%] w-full">
        <View className="w-1/2 h-full"></View>
        <View className="w-1/2 h-full flex items-end pr-4 justify-between">
          {progressStats.map((e) => (
            <IndexDisplay name={e} />
          ))}
        </View>
      </View>
      <Text className="font-plight text-sm text-darkGray self-center mt-4 ">
        7 de julio 2024 - 10 de noviembre 2024
      </Text>
    </View>
  );
};

export default ProgressDisplay;
