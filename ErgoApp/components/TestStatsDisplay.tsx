import { View, Text } from "react-native";
import React from "react";
import IndexDisplay from "./IndexDisplay";
import { router } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  StudyType,
  CompletedStudy,
  CMJResult,
  SquatJumpResult,
  MultipleJumpsResult,
  MultipleDropJumpResult,
  AbalakovResult,
  testDisplayNames,
} from "../types/Studies";
import { getTestStatsSummary } from "../utils/utils";
import { Athlete } from "../types/Athletes";
import { useUser } from "../contexts/UserContext";
import { TestValueHistory } from "../types/trainingPlan";

const TestStatsDisplay = () => {
  const { userData } = useUser();
  const athleteData = userData as Athlete;

  const videoSource =
    "https://github.com/Joaquin121121/ErgoCharacters/raw/refs/heads/main/chica%20celu%20foto.mp4";

  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });

  const testCompletedStudies = athleteData.completedStudies.filter(
    (study) => study.results.type !== "custom" && study.results.type !== "bosco"
  );

  // Test the function with our test data
  const testStats = getTestStatsSummary(testCompletedStudies).slice(0, 3);

  return (
    <View className="w-[85vw] h-[300] rounded-2xl shadow-sm self-center bg-white">
      <Text className="font-plight text-sm text-darkGray self-center mt-2 mb-4">
        Toca los tests para ver más información
      </Text>
      <View className="flex flex-row h-[80%] w-full">
        <View className="w-2/5 h-full">
          <VideoView
            player={player}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <View className="w-3/5 h-full flex items-end pr-4 justify-between">
          {testStats.map((e) => (
            <IndexDisplay
              name={
                e.valueType === "height"
                  ? testDisplayNames[
                      e.testType as keyof typeof testDisplayNames
                    ]
                  : e.valueType
              }
              key={e.testType + e.valueType}
              currentValue={e.currentValue}
              percentageDiff={e.percentageChange || undefined}
              onPress={() => {
                router.push(
                  `/testInfoDisplay?testType=${e.testType}&valueType=${e.valueType}`
                );
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default TestStatsDisplay;
