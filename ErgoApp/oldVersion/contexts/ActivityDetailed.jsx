import { View, Text } from "react-native";
import React, { useContext, useEffect } from "react";
import OutlinedButton from "../../components/OutlinedButton";
import Icon from "../../components/Icon";
import TonalButton from "../../components/TonalButton";
import { router } from "expo-router";
import { calendarData } from "../../scripts/calendarData";
const ActivityDetailed = ({ week, day, index, studies }) => {
  const { coachInfo } = useContext(CoachContext);
  const isSessionToday = (timeSlots) => {
    // Spanish day names mapping (0 = Sunday, 1 = Monday, etc.)
    const dayNames = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Miercoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Sabado: 6,
    };

    // Get current day number (0-6)
    const today = new Date().getDay();
    // Get tomorrow's day number
    const tomorrow = (today + 1) % 7;

    // Get all days from all time slots
    const allDays = timeSlots.flatMap((slot) => slot.days);

    // Convert days to numbers
    const dayNumbers = allDays.map((day) => dayNames[day]);

    // Check if any of the days is today
    if (dayNumbers.includes(today)) {
      return "Hoy";
    }
    // Check if any of the days is tomorrow
    if (dayNumbers.includes(tomorrow)) {
      return "Mañana";
    }
    // If neither today nor tomorrow
    return false;
  };

  const getNextSessionDays = (timeSlots) => {
    const dayNames = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Miercoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Sabado: 6,
    };

    const today = new Date().getDay();
    const allDays = timeSlots.flatMap((slot) => slot.days);
    const dayNumbers = allDays.map((day) => dayNames[day]);

    // Sort days based on proximity to current day
    dayNumbers.sort((a, b) => {
      const diffA = (a - today + 7) % 7;
      const diffB = (b - today + 7) % 7;
      return diffA - diffB;
    });

    return dayNumbers;
  };

  const activities = [...coachInfo.classes].sort((a, b) => {
    const aDays = getNextSessionDays(a.time);
    const bDays = getNextSessionDays(b.time);

    const aNextDay = aDays[0];
    const bNextDay = bDays[0];

    const today = new Date().getDay();
    const aDiff = (aNextDay - today + 7) % 7;
    const bDiff = (bNextDay - today + 7) % 7;

    return aDiff - bDiff;
  });

  const activity =
    week && day
      ? coachInfo.classes.find(
          (activity) =>
            activity.name ===
            calendarData[week][day].scheduledActivities[index].name
        )
      : activities[index];

  const relativeAttendanceColor =
    activity.relativeAttendance === "Alta"
      ? "text-green"
      : activity.relativeAttendance === "Media"
      ? "text-yellow"
      : "text-darkGray";

  const formatDays = (timeSlots) => {
    const allDays = timeSlots.flatMap((slot) => slot.days);
    return allDays.join(" y ");
  };

  return (
    <View className="shadow-sm w-[85vw] self-center bg-white rounded-2xl ">
      <Text className="text-h2 font-pregular mt-4 self-center mb-6 ">
        {activity.name}
      </Text>
      {isSessionToday(activity.time) && (
        <Text className="text-16 text-secondary  font-plight absolute top-2 right-2">
          {!week && isSessionToday(activity.time)}
        </Text>
      )}
      {!studies && (
        <View className="flex-row items-center mb-4 ml-8">
          <Icon icon="calendar" />
          <Text className="text-16 font-pregular ml-4 text-darkGray">
            {formatDays(activity.time)}
          </Text>
        </View>
      )}
      <View className="flex-row items-center mb-4 ml-8">
        <Icon icon="schedule" />
        <Text className="text-16 font-pregular ml-4 text-darkGray">
          <Text className="font-pregular">{activity.time[0].hour}</Text> hs
        </Text>
      </View>
      <View className="flex-row items-center mb-4 ml-8">
        <Icon icon="timer" />
        <Text className="text-16 font-pregular ml-4 text-darkGray">
          Duración: <Text className="font-pregular">{activity.duration}</Text>{" "}
          hs
        </Text>
      </View>
      <View className="flex-row items-center mb-4 ml-8">
        <Icon icon="personRed" />
        <Text className="text-16 font-pregular ml-4 text-darkGray">
          <Text className="font-pregular">{activity.attendance}</Text>{" "}
          participantes
        </Text>
      </View>
      {!studies && (
        <View className="flex-row items-center mb-4 ml-8">
          <Icon icon="group" />
          <Text className="text-16 font-pregular ml-4 text-darkGray">
            Asistencia:{" "}
            <Text className={relativeAttendanceColor + " font-pregular"}>
              {activity.relativeAttendance}
            </Text>
          </Text>
        </View>
      )}
      <View className="flex-row items-center mb-4 ml-8">
        <Icon icon="location" />
        <Text className="text-16 font-pregular ml-4 text-secondary">
          <Text className="font-pregular">{activity.place}</Text>
        </Text>
      </View>
      <OutlinedButton
        title="Ver Plan"
        icon="plan"
        containerStyles="self-center mt-6"
        onPress={() => router.push("coachViewPlan")}
      />
      <TonalButton
        title="Entrenar"
        containerStyles="self-center mt-4 mb-4"
        icon="dumbbell"
        onPress={() => router.push(`coachViewPlan?action=doExercises`)}
      />
    </View>
  );
};

export default ActivityDetailed;
