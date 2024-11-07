import { View, Text } from "react-native";
import React from "react";
import IndexDisplay from "./IndexDisplay";

const ProgressDisplay = () => {
  return (
    <View className="w-80 h-[280] rounded-2xl shadow-sm self-center bg-white">
      <Text className="font-plight text-sm text-darkGray self-center mt-2 mb-4">
        7 de julio 2024 - 7 de agosto 2024
      </Text>
      <View className="flex flex-row h-[80%] w-full">
        <View className="w-1/2 h-full"></View>
        <View className="w-1/2 h-full flex items-end pr-4 justify-between">
          <IndexDisplay name="RSI" currentValue={5} pastValue={4} />
          <IndexDisplay name="JJS" currentValue={8.2} pastValue={8.5} />
          <IndexDisplay name="DDJ" currentValue={7} pastValue={11} />
        </View>
      </View>
    </View>
  );
};

export default ProgressDisplay;
