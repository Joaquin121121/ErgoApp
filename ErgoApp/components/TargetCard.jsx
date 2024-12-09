import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import { fractionToPercentage } from "../scripts/utils";

const TargetCard = ({ name, target, current, color }) => {
  const [dimensions, setDimensions] = useState(null);
  const [left, setLeft] = useState(0);

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  useEffect(() => {
    if (dimensions?.width) {
      setLeft(dimensions.width - 10);
    }
  }, [dimensions]);

  return (
    <View className="h-[30%] w-full rounded-2xl bg-white shadow-sm flex flex-row">
      <View className="w-3/5 h-full pl-2">
        <Text className="font-pregular text-xl mt-2">{name}</Text>
        <Text className="font-pregular text-sm text-darkGray mt-4">
          Objetivo:{" "}
          <Text className={`text-${color}`}>
            {target > 0 ? "+" : "-"}
            {target}%
          </Text>
        </Text>
      </View>
      <View className="w-2/5 h-full flex justify-center items-center pr-1">
        <Text className="text-darkGray font-pregular mb-2">Progreso</Text>
        <ProgressBar
          color={color}
          progress={(current / target) * 100}
          onLayout={handleLayout}
        />
        <Text
          className={`absolute bottom-1 font-plight text-${color} mt-1`}
          style={{ left: left }}
        >
          {fractionToPercentage(current, target)}
        </Text>
      </View>
    </View>
  );
};

export default TargetCard;
