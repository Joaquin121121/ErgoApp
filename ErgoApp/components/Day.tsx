import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import Icon from "./Icon";
import { router, RelativePathString } from "expo-router";
import { calendarData, inverseDayTranslations } from "../scripts/calendarData";
import { Session } from "../types/trainingPlan";
import { StudyType } from "../types/Studies";
const Day = ({
  day,
  sessions,
  currentWeekIndex,
  studies,
}: {
  day: string;
  sessions: Session[];
  currentWeekIndex: number;
  studies: StudyType[];
}) => {
  const isRestDay = sessions?.[0]?.name === "restDay";

  const sortedWeeks = Object.keys(calendarData).sort((a, b) => {
    const [dayA] = a.split("-")[0].split("/").reverse();
    const [dayB] = b.split("-")[0].split("/").reverse();
    return parseInt(dayA) - parseInt(dayB);
  });

  const onPress = () => {
    if (sessions.length) {
      router.push(
        `dayInfo?currentWeekIndex=${sortedWeeks[currentWeekIndex]}&&day=${
          inverseDayTranslations[day as keyof typeof inverseDayTranslations]
        }` as RelativePathString
      );
    }
  };

  useEffect(() => {
    console.log(studies);
  }, []);

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="w-[110px] h-full shadow-sm bg-white rounded-2xl flex items-center"></View>
    </TouchableOpacity>
  );
};

export default Day;
