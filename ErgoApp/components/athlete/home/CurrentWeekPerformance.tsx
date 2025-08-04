import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useUser } from "../../../contexts/UserContext";
import { Athlete } from "../../../types/Athletes";
import { useCalendar } from "../../../contexts/CalendarContext";
import { getCurrentWeekIndex } from "../../../scripts/calendarData";
import { getCurrentWeekRange } from "../../../utils/utils";
import { VideoView, useVideoPlayer } from "expo-video";

const CurrentWeekPerformance = () => {
  const { userData } = useUser();
  const athleteData = userData as Athlete | null;
  const { calendarData } = useCalendar();

  const videoSource =
    "https://github.com/Joaquin121121/ErgoCharacters/raw/refs/heads/main/musculoso%20pose%20largo.mp4";

  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });

  const currentWeekRange = getCurrentWeekRange();
  const currentWeekData =
    calendarData?.[currentWeekRange as keyof typeof calendarData];

  const completedSessionsNumber = Object.values(currentWeekData || {}).reduce(
    (acc: number, day: any) => acc + (day.completed ? 1 : 0),
    0
  );
  const totalSessionsNumber = athleteData?.currentTrainingPlan?.sessions.reduce(
    (acc: number, session) => acc + session.days.length,
    0
  );

  useEffect(() => {
    const interval = setInterval(() => {
      player.currentTime = 0;
      player.play();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="shadow-sm relative w-[85vw] overflow-hidden self-center h-40 bg-white rounded-2xl flex flex-row items-center ">
      <Text className="text-blue text-3xl font-semibold ml-4">
        {completedSessionsNumber}/{totalSessionsNumber}
      </Text>
      <Text className="text-blue text-lg font-medium w-1/3 ml-8 -mr-4">
        Sesiones completadas
      </Text>
      <VideoView
        player={player}
        style={{
          width: 140,
          height: 140,
          position: "absolute",
          right: -15,
          pointerEvents: "none",
        }}
      />
    </View>
  );
};

export default CurrentWeekPerformance;
