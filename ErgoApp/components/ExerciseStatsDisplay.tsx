import { View, Text } from "react-native";
import React from "react";
import IndexDisplay from "./IndexDisplay";
import { useUser } from "../contexts/UserContext";
import { Athlete } from "../types/Athletes";
import { StudyType } from "../types/Studies";
import { getTestStatsSummary } from "../utils/utils";

const ExerciseStatsDisplay = () => {
  const { userData } = useUser();
  const athleteData = userData as Athlete;

  const stats = getTestStatsSummary(athleteData.completedStudies);

  return (
    <View className="w-[85vw] h-[300] rounded-2xl shadow-sm self-center bg-white">
      <Text className="font-plight text-sm text-darkGray self-center mt-2 mb-4">
        Toca los atributos para ver más información
      </Text>
      <View className="flex flex-row h-[80%] w-full">
        <View className="w-1/2 h-full flex items-end pr-4 justify-between">
          {stats.slice(0, 3).map((e) => (
            <IndexDisplay name={e} />
          ))}
        </View>
        <View className="w-1/2 h-full flex items-end pr-4 justify-between">
          {stats.slice(3, 6).map((e) => (
            <IndexDisplay name={e} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default ExerciseStatsDisplay;
