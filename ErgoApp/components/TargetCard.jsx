import { View, Text } from "react-native";
import React from "react";
import ProgressBar from "./ProgressBar";
import { fractionToPercentage } from "../scripts/utils";

const TargetCard = ({ name, target, current, color }) => {
  return (
    <View className="h-[30%] w-full rounded-2xl bg-white shadow-sm flex flex-row">
      <View className="w-3/5 h-full pl-2">
        <Text className="font-pregular text-xl">{name}</Text>
        <Text className="font-pregular text-sm text-darkGray mt-4">
          Objetivo:{" "}
          <Text className="text-secondary">
            {target > 0 ? "+" : "-"}
            {target}%
          </Text>
        </Text>
        <Text className="font-pregular text-sm text-darkGray mt-1">
          Actual:{" "}
          <Text className={`text-${color}`}>
            {current > 0 ? "+" : "-"}
            {current}%
          </Text>
        </Text>
      </View>
      <View className="w-2/5 h-full flex justify-center items-center pr-1">
        <Text className="text-darkGray font-pregular mb-2">Progreso</Text>
        <ProgressBar color={color} progress={(current / target) * 100} />
        <Text className={`font-plight text-${color} mt-1`}>
          {fractionToPercentage(current, target)}
        </Text>
      </View>
    </View>
  );
};

export default TargetCard;
