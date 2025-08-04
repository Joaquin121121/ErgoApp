import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import Icon from "./Icon";
import { router, RelativePathString } from "expo-router";
import { DayData, inverseDayTranslations } from "../scripts/calendarData";

const Day = ({
  day,
  dayData,
  currentWeekIndex,
  weekKey,
  dayKey,
}: {
  day: string;
  dayData: DayData;
  currentWeekIndex: number;
  weekKey: string;
  dayKey: string;
}) => {
  const sessionName = dayData.sessionName || "Descanso";
  const isRestDay = !dayData.sessionName;

  // Determine which icon to show based on completion status
  const getStatusIcon = () => {
    if (dayData.completed) {
      return "check"; // Completed session
    }

    // Check if the day has passed by comparing the week date and current date
    const today = new Date();
    const [startDate] = weekKey.split("-");
    const [day, month, year] = startDate.split("/").map(Number);
    const weekStart = new Date(year, month - 1, day);

    // Calculate the specific day within the week
    const dayOrder = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const dayIndex = dayOrder.indexOf(dayKey.toLowerCase());
    const specificDay = new Date(weekStart);
    specificDay.setDate(specificDay.getDate() + dayIndex);

    if (specificDay < today && !dayData.completed) {
      return "fail"; // Day has passed and session wasn't completed
    }

    return "schedule"; // Future session or today's session not yet completed
  };

  const statusIcon = getStatusIcon();

  const onPress = () => {
    if (!isRestDay) {
      router.push(
        `dayInfo?currentWeekIndex=${weekKey}&&day=${
          inverseDayTranslations[day as keyof typeof inverseDayTranslations]
        }` as RelativePathString
      );
    }
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={isRestDay}>
      <View className="w-[110px] h-full shadow-sm bg-white rounded-2xl flex items-center justify-center p-3">
        <View className="flex items-center justify-between h-full">
          {/* Day name in Spanish */}
          <Text className="text-darkGray text-sm font-plight">{day}</Text>

          {/* Session name */}
          <Text
            className={`text-16 text-center ${
              isRestDay ? "font-pregular" : "text-secondary font-pmedium"
            }`}
          >
            {sessionName}
          </Text>

          {/* Status icon */}
          {
            <View className="mt-2">
              {isRestDay ? (
                <View className="w-7 h-7" />
              ) : (
                <Icon icon={statusIcon} size={28} />
              )}
            </View>
          }
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Day;
