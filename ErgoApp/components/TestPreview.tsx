import { View, Text } from "react-native";
import React, { useEffect } from "react";
import {
  CMJResult,
  CompletedStudy,
  MultipleDropJumpResult,
  MultipleJumpsResult,
  StudyType,
} from "../types/Studies";
import { VideoView, useVideoPlayer } from "expo-video";
import { criterionLookup } from "../types/Studies";
import {
  calculatePercentageDifference,
  formatDateDDMMYYYY,
} from "../utils/utils";
import TonalButton from "./TonalButton";

const TestPreview = ({
  tests,
  onPress,
}: {
  tests: { key: StudyType; data: CompletedStudy[] };
  onPress: () => void;
}) => {
  const videoSource =
    "https://github.com/Joaquin121121/ErgoCharacters/raw/refs/heads/main/chica%20sentadillas.mp4";

  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });

  const getDiff = () => {
    const lastElementIndex = tests.data.length - 1;
    const type1 = tests.data[0].results.type;
    const type2 = tests.data[lastElementIndex].results.type;
    if (type1 !== type2) return;

    switch (type1) {
      case "cmj":
      case "squatJump":
      case "abalakov":
        const basicDiff =
          tests.data.length > 1
            ? calculatePercentageDifference(
                (tests.data[0].results as CMJResult).avgHeightReached,
                (tests.data[lastElementIndex].results as CMJResult)
                  .avgHeightReached
              )
            : {
                content: "",
                icon: "",
                iconColor: "",
              };
        return (
          <>
            <Text className="text-tertiary text-lg">Altura Promedio: </Text>
            <Text className="text-secondary  text-lg">
              {tests.data[0].results.avgHeightReached.toFixed(2)} cm
            </Text>
            {tests.data.length > 1 ? (
              <Text style={{ color: basicDiff.iconColor }}>
                {basicDiff.icon} {basicDiff.content}
              </Text>
            ) : (
              ""
            )}
            <Text className="text-tertiary text-lg mt-4">
              Ultimo Test:{" "}
              <Text className="text-secondary  text-lg">
                {formatDateDDMMYYYY(new Date(tests.data[0].date))}
              </Text>
            </Text>
          </>
        );
      case "multipleDropJump":
        const multipleDropJumpMaxHeightDiff =
          tests.data.length > 1
            ? calculatePercentageDifference(
                (tests.data[0].results as MultipleDropJumpResult)
                  .maxAvgHeightReached,
                (tests.data[lastElementIndex].results as MultipleDropJumpResult)
                  .maxAvgHeightReached
              )
            : {
                content: "",
                icon: "",
                iconColor: "",
              };

        return (
          <>
            <Text className="text-tertiary text-lg">
              Maxima Altura Alcanzada:{" "}
              <Text className="text-secondary  text-lg">
                {tests.data[0].results.maxAvgHeightReached}
              </Text>
              {tests.data.length > 1 ? (
                <Text
                  style={{ color: multipleDropJumpMaxHeightDiff.iconColor }}
                >
                  {multipleDropJumpMaxHeightDiff.icon}{" "}
                  {multipleDropJumpMaxHeightDiff.content}
                </Text>
              ) : (
                ""
              )}
            </Text>
            <Text className="text-tertiary text-lg mt-4">
              Altura con mayor rendimiento:{" "}
              <Text className="text-secondary  text-lg">
                {Number(tests.data[0].results.bestHeight).toFixed(2)}
              </Text>
              cm
            </Text>
            <Text className="text-tertiary text-lg mt-4">
              Ultimo Test:{" "}
              <Text className="text-secondary  text-lg">
                {formatDateDDMMYYYY(new Date(tests.data[0].date))}
              </Text>
            </Text>
          </>
        );
      case "multipleJumps":
        const multipleJumpsDiff =
          tests.data.length > 1
            ? calculatePercentageDifference(
                (tests.data[0].results as MultipleJumpsResult).avgHeightReached,
                (tests.data[lastElementIndex].results as MultipleJumpsResult)
                  .avgHeightReached
              )
            : {
                content: "",
                icon: "",
                iconColor: "",
              };
        return (
          <>
            <Text className="text-tertiary text-lg">
              Altura Promedio:{" "}
              <Text className="text-secondary  text-lg">
                {tests.data[0].results.avgHeightReached}
              </Text>
              {tests.data.length > 1 ? (
                <Text style={{ color: multipleJumpsDiff.iconColor }}>
                  {multipleJumpsDiff.icon} {multipleJumpsDiff.content}
                </Text>
              ) : (
                ""
              )}
            </Text>
            <Text className="text-tertiary text-lg mt-4">
              Ultimo Test:{" "}
              <Text className="text-secondary  text-lg">
                {formatDateDDMMYYYY(new Date(tests.data[0].date))}
              </Text>
            </Text>
          </>
        );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      player.currentTime = 0;
      player.play();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="w-[85vw] h-[300] rounded-2xl shadow-sm self-center bg-white flex flex-row relative overflow-hidden">
      <VideoView
        player={player}
        style={{
          pointerEvents: "none",
          width: "35%",
        }}
      />
      <View className="flex items-center w-[65%] mt-8">
        <Text className="text-2xl text-secondary  mb-4">
          {tests.data[0].studyInfo.name}
        </Text>
        <View className="h-1/2">{getDiff()}</View>
        <TonalButton
          title="Ver Test"
          onPress={onPress}
          customIcon="planWhite"
          containerStyles="w-4/5 "
        />
      </View>
    </View>
  );
};

export default TestPreview;
