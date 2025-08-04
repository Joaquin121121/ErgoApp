import { View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { RelativePathString, useLocalSearchParams } from "expo-router";
import { useCalendar } from "../contexts/CalendarContext";
import OutlinedButton from "../components/OutlinedButton";
import ItemCard from "../components/ItemCard";
import { router } from "expo-router";
import { useUser } from "../contexts/UserContext";
import { Athlete } from "../types/Athletes";
import { getFormattedDate, countTotalExercises } from "../utils/utils";
import { VideoView, useVideoPlayer } from "expo-video";
import { dayTranslations } from "../scripts/calendarData";
import TonalButton from "../components/TonalButton";

const dayInfo = () => {
  const params = useLocalSearchParams();
  const currentWeekIndex = params.currentWeekIndex as string;
  const day = params.day as string;
  const { calendarData } = useCalendar();
  const { userData } = useUser();
  const athleteData = userData as Athlete;

  const videoSource =
    "https://github.com/Joaquin121121/ErgoCharacters/raw/refs/heads/main/musculoso%20no%20lo%20logra.mp4";

  const successVideoSource =
    "https://github.com/Joaquin121121/ErgoCharacters/raw/refs/heads/main/musculoso%20lo%20logra.mp4";

  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });

  const successPlayer = useVideoPlayer(successVideoSource, (player) => {
    player.play();
  });

  if (!calendarData || !currentWeekIndex || !day) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">No calendar data available</Text>
        <OutlinedButton
          inverse
          icon="arrow-left"
          title="Volver"
          containerStyles="self-center w-[40vw] mt-8"
          textStyles=""
          isLoading={false}
          onPress={() => router.back()}
        />
      </View>
    );
  }

  // Get the day data from calendarData
  const dayData =
    calendarData[currentWeekIndex]?.[
      day as keyof (typeof calendarData)[typeof currentWeekIndex]
    ];

  if (!dayData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">No data for this day</Text>
        <OutlinedButton
          inverse
          icon="arrow-left"
          title="Volver"
          containerStyles="self-center w-[40vw] mt-8"
          textStyles=""
          isLoading={false}
          onPress={() => router.back()}
        />
      </View>
    );
  }

  const formattedDate = getFormattedDate(day, currentWeekIndex);

  const relevantSession = athleteData.currentTrainingPlan?.sessions.find(
    (session) => session.id === dayData.sessionId
  );

  const totalExercises = relevantSession
    ? countTotalExercises(relevantSession)
    : 0;

  return (
    <ScrollView>
      <View className="p-4 bg-white rounded-2xl shadow-sm w-[90vw] self-center">
        <Text className="text-xl font-pregular mt-8 mb-6 self-center">
          <Text className="text-secondary">{relevantSession?.name}</Text>
          {" - "}
          {formattedDate}
        </Text>

        {dayData.completedExercises > 0 ? (
          <>
            <View className="relative w-full h-40 overflow-hidden rounded-2xl mb-4">
              <VideoView
                player={successPlayer}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </View>
            <ItemCard
              percentage={`${dayData.completedExercises}/${totalExercises}`}
              label="Ejercicios completados"
              color="blue"
            />
            <ItemCard
              percentage={`${dayData.performance || 0}/${
                dayData.completedExercises || 0
              }`}
              label="Ejercicios con progreso"
              color="green"
            />

            {/* Back Button */}
            <OutlinedButton
              inverse
              icon="arrow-left"
              title="Volver"
              containerStyles="self-center w-[40vw] mt-8"
              onPress={() => router.back()}
            />
          </>
        ) : (
          <>
            <View className="relative w-full h-40 overflow-hidden rounded-2xl">
              <VideoView
                player={player}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </View>
            <Text className="text-16 w-full text-center mt-12 px-4">
              No has podido completar tu entrenamiento del{" "}
              {dayTranslations[day as keyof typeof dayTranslations]}
            </Text>
            <Text className="text-16 w-full text-center text-secondary mt-2">
              Deseas Recuperarlo?
            </Text>
            <TonalButton
              title="Entrenar"
              customIcon="dumbbell"
              onPress={() => {
                router.replace(
                  `viewPlan?doExercises=true&sessionId=${dayData.sessionId}` as RelativePathString
                );
              }}
              containerStyles="self-center w-[40vw] mt-8"
            />
            <OutlinedButton
              title="Volver"
              onPress={() => router.back()}
              containerStyles="self-center w-[40vw] my-8"
              inverse
              icon="arrow-left"
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default dayInfo;
