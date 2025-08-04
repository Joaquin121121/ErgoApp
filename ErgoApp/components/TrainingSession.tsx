import { View, Text, Image } from "react-native";
import React, { useContext, useEffect } from "react";
import Icon from "./Icon";
import OutlinedButton from "./OutlinedButton";
import TonalButton from "./TonalButton";
import { VideoView, useVideoPlayer } from "expo-video";

import icons from "../scripts/icons";
import { RelativePathString, router } from "expo-router";
import { Athlete } from "../types/Athletes";
import { useUser } from "../contexts/UserContext";
import { Session } from "../types/trainingPlan";

const TrainingSession = ({ session }: { session: Session }) => {
  const videoSource =
    "https://github.com/Joaquin121121/ErgoCharacters/raw/refs/heads/main/chica%20se%20estira.mp4";

  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });

  return (
    <View className="shadow-sm w-[90vw] bg-white rounded-2xl mt-2">
      <Text className="text-2xl  self-center mt-4 mb-2">{session.name}</Text>
      <View className="w-[95%] flex flex-row justify-between items-center mt-4">
        <View className="w-[45%] h-[180px]">
          <VideoView
            player={player}
            style={{
              width: "90%",
              height: "90%",
              pointerEvents: "none",
            }}
          />
        </View>
        <View className="w-[55%] h-[180px] flex justify-around">
          <View className="flex flex-row items-center">
            <Icon icon="heart" size={32}></Icon>
            <Text className="font-pregular text-sm text-darkGray ml-2">
              {"Prevención de\nlesiones"}
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <Icon icon="dumbbellRed" size={32}></Icon>
            <Text className="font-pregular text-sm text-darkGray ml-2">
              Aumento de masa muscular
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <Icon icon="stonks" size={32}></Icon>
            <Text className="font-pregular text-sm text-darkGray ml-2">
              Aceleración de metabolismo
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-8 flex flex-row w-full justify-around mb-4">
        <OutlinedButton
          customIcon="plan"
          title="Ver Plan"
          containerStyles="w-[40%]"
          onPress={() => {
            router.push(
              `/viewPlan?sessionId=${session.id}` as RelativePathString
            );
          }}
        />
        <TonalButton
          customIcon="dumbbell"
          title="Entrenar"
          containerStyles="w-[40%]"
          onPress={() => {
            router.push(
              `/prePoll?sessionId=${session.id}` as RelativePathString
            );
          }}
        />
      </View>
    </View>
  );
};

export default TrainingSession;
