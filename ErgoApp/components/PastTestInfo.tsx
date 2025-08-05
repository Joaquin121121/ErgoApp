import { View, Text } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatIsoToSpanishDate } from "../utils/utils";

interface PastTestInfoProps {
  latestTest: {
    date: string;
    results: {
      type: string;
      maxAvgHeightReached?: number;
      avgHeightReached?: number;
    };
  };
}

const PastTestInfo: React.FC<PastTestInfoProps> = ({ latestTest }) => {
  return (
    <View className="flex self-center mt-8 bg-white rounded-2xl shadow-sm p-4 w-[95vw]">
      <Text className="w-full text-center text-2xl mb-4 text-secondary font-pmedium">
        Ultimo Test
      </Text>
      <View className="flex flex-row items-center">
        <MaterialCommunityIcons name="calendar" size={32} color="#e81d23" />
        <Text className="text-xl ml-2">
          Realizado el{" "}
          <Text className="text-secondary">
            {formatIsoToSpanishDate(latestTest.date)}
          </Text>
        </Text>
      </View>
      <View className="flex flex-row items-center mt-4">
        <MaterialCommunityIcons name="trending-up" size={32} color="#e81d23" />
        <Text className="text-xl ml-2">
          {latestTest.results.type === "multipleDropJump" && "Máxima "}
          Altura de salto:{" "}
          <Text className="text-secondary">
            {latestTest.results.type === "multipleDropJump"
              ? latestTest.results.maxAvgHeightReached
              : latestTest.results.avgHeightReached?.toFixed(2)}{" "}
            cm
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default PastTestInfo;
