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

  // Generate test data
  const testCompletedStudies: CompletedStudy[] = [
    // CMJ tests
    {
      id: "cmj1",
      studyInfo: {
        name: "CMJ Test",
        description: "Counter Movement Jump Test",
        preview: { equipment: ["force plate"] },
      },
      date: new Date("2024-01-15"),
      results: {
        type: "cmj",
        times: [],
        avgFlightTime: 0.5,
        avgHeightReached: 45.2,
        takeoffFoot: "both",
        sensitivity: 0.01,
        load: 0,
        loadUnit: "kg",
      } as CMJResult,
    },
    {
      id: "cmj2",
      studyInfo: {
        name: "CMJ Test",
        description: "Counter Movement Jump Test",
        preview: { equipment: ["force plate"] },
      },
      date: new Date("2024-01-10"),
      results: {
        type: "cmj",
        times: [],
        avgFlightTime: 0.48,
        avgHeightReached: 43.1,
        takeoffFoot: "both",
        sensitivity: 0.01,
        load: 0,
        loadUnit: "kg",
      } as CMJResult,
    },
    // SquatJump tests (same day as CMJ)
    {
      id: "sj1",
      studyInfo: {
        name: "Squat Jump Test",
        description: "Squat Jump Test",
        preview: { equipment: ["force plate"] },
      },
      date: new Date("2024-01-15"),
      results: {
        type: "squatJump",
        times: [],
        avgFlightTime: 0.52,
        avgHeightReached: 42.8,
        takeoffFoot: "both",
        sensitivity: 0.01,
        load: 0,
        loadUnit: "kg",
      } as SquatJumpResult,
    },
    {
      id: "sj2",
      studyInfo: {
        name: "Squat Jump Test",
        description: "Squat Jump Test",
        preview: { equipment: ["force plate"] },
      },
      date: new Date("2024-01-10"),
      results: {
        type: "squatJump",
        times: [],
        avgFlightTime: 0.5,
        avgHeightReached: 41.2,
        takeoffFoot: "both",
        sensitivity: 0.01,
        load: 0,
        loadUnit: "kg",
      } as SquatJumpResult,
    },
    // MultipleJumps tests
    {
      id: "mj1",
      studyInfo: {
        name: "Multiple Jumps Test",
        description: "Multiple Jumps Test",
        preview: { equipment: ["force plate"] },
      },
      date: new Date("2024-01-20"),
      results: {
        type: "multipleJumps",
        times: [],
        avgFlightTime: 0.45,
        avgHeightReached: 38.5,
        avgFloorTime: 0.15,
        avgStiffness: 12.5,
        avgPerformance: 85.2,
        performanceDrop: 8.5,
        takeoffFoot: "both",
        sensitivity: 0.01,
        criteria: "numberOfJumps",
        criteriaValue: 5,
      } as MultipleJumpsResult,
    },
    {
      id: "mj2",
      studyInfo: {
        name: "Multiple Jumps Test",
        description: "Multiple Jumps Test",
        preview: { equipment: ["force plate"] },
      },
      date: new Date("2024-01-12"),
      results: {
        type: "multipleJumps",
        times: [],
        avgFlightTime: 0.43,
        avgHeightReached: 37.2,
        avgFloorTime: 0.16,
        avgStiffness: 11.8,
        avgPerformance: 82.1,
        performanceDrop: 10.2,
        takeoffFoot: "both",
        sensitivity: 0.01,
        criteria: "numberOfJumps",
        criteriaValue: 5,
      } as MultipleJumpsResult,
    },
    // MultipleDropJump tests
    {
      id: "mdj1",
      studyInfo: {
        name: "Multiple Drop Jump Test",
        description: "Multiple Drop Jump Test",
        preview: { equipment: ["force plate"] },
      },
      date: new Date("2024-01-18"),
      results: {
        type: "multipleDropJump",
        dropJumps: [],
        heightUnit: "cm",
        maxAvgHeightReached: 52.3,
        takeoffFoot: "both",
        bestHeight: "52.3",
      } as MultipleDropJumpResult,
    },
    {
      id: "mdj2",
      studyInfo: {
        name: "Multiple Drop Jump Test",
        description: "Multiple Drop Jump Test",
        preview: { equipment: ["force plate"] },
      },
      date: new Date("2024-01-08"),
      results: {
        type: "multipleDropJump",
        dropJumps: [],
        heightUnit: "cm",
        maxAvgHeightReached: 49.8,
        takeoffFoot: "both",
        bestHeight: "49.8",
      } as MultipleDropJumpResult,
    },
    // Abalakov tests
    {
      id: "ab1",
      studyInfo: {
        name: "Abalakov Test",
        description: "Abalakov Test",
        preview: { equipment: ["force plate"] },
      },
      date: new Date("2024-01-22"),
      results: {
        type: "abalakov",
        times: [],
        avgFlightTime: 0.55,
        avgHeightReached: 48.7,
        takeoffFoot: "both",
        sensitivity: 0.01,
        load: 0,
        loadUnit: "kg",
      } as AbalakovResult,
    },
  ];

  // Test the function with our test data
  const testStats = getTestStatsSummary(testCompletedStudies).slice(0, 3);
  console.log("TestStatsSummary Result:", JSON.stringify(testStats, null, 2));

  return (
    <View className="w-[85vw] h-[300] rounded-2xl shadow-sm self-center bg-white">
      <Text className="font-plight text-sm text-darkGray self-center mt-2 mb-4">
        Toca los atributos para ver más información
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
                testDisplayNames[e.testType as keyof typeof testDisplayNames]
              }
              key={e.testType}
              currentValue={e.currentValue}
              percentageDiff={e.percentageChange || undefined}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default TestStatsDisplay;
