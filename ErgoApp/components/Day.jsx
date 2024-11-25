import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import Icon from "./Icon";
import { router } from "expo-router";
import { calendarData, inverseDayTranslations } from "../scripts/calendarData";
const Day = ({ day, sessions, coach, currentWeekIndex }) => {
  const isRestDay = sessions?.[0]?.name === "restDay";

  const sortedWeeks = Object.keys(calendarData).sort((a, b) => {
    const [dayA] = a.split("-")[0].split("/").reverse();
    const [dayB] = b.split("-")[0].split("/").reverse();
    return parseInt(dayA) - parseInt(dayB);
  });

  const onPress = () => {
    if (coach && sessions.length) {
      router.push(
        `dayInfo?currentWeekIndex=${sortedWeeks[currentWeekIndex]}&&day=${inverseDayTranslations[day]}`
      );
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="w-[110px] h-full shadow-sm bg-white rounded-2xl flex items-center">
        <Text className="font-plight text-darkGray mt-2">{day}</Text>
        <Text
          className={`text-sm mt-2 ${
            isRestDay || coach
              ? "text-black font-plight"
              : "text-secondary font-pmedium"
          }`}
        >
          {coach
            ? `${sessions.length} ${sessions.length > 1 ? "clases" : "clase"}`
            : isRestDay
            ? "Descanso"
            : sessions[0].name}
        </Text>

        {coach ? (
          <Text className="text-sm mt-6 text-secondary font-pmedium">
            Ver Detalles
          </Text>
        ) : (
          <Icon
            style={{ marginTop: 8 }}
            icon={isRestDay ? "greenCheck" : "close"}
            size={32}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Day;
