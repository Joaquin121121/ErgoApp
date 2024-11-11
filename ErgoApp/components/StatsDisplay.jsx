import { View, Text } from "react-native";
import React from "react";
import IndexDisplay from "./IndexDisplay";

const StatsDisplay = () => {
  const stats = [
    { name: "Explosividad", currentValue: 87, pastValue: 73 },
    { name: "Resistencia", currentValue: 65, pastValue: 82 },
    { name: "Fuerza", currentValue: 78, pastValue: 69 },
    { name: "Agilidad", currentValue: 85, pastValue: 77 },
    { name: "Salto", currentValue: 72, pastValue: 88 },
    { name: "Balance", currentValue: 90, pastValue: 64 },
  ];

  return (
    <View className="w-[85vw] h-[300] rounded-2xl shadow-sm self-center bg-white">
      <Text className="font-plight text-sm text-darkGray self-center mt-2 mb-4">
        Toca los atributos para ver más información
      </Text>
      <View className="flex flex-row h-[80%] w-full">
        <View className="w-1/2 h-full flex items-end pr-4 justify-between">
          {stats.slice(0, 3).map((e) => (
            <IndexDisplay
              name={e.name}
              currentValue={e.currentValue}
              pastValue={e.pastValue}
            />
          ))}
        </View>
        <View className="w-1/2 h-full flex items-end pr-4 justify-between">
          {stats.slice(3, 6).map((e) => (
            <IndexDisplay
              name={e.name}
              currentValue={e.currentValue}
              pastValue={e.pastValue}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default StatsDisplay;
