import { View, Text } from "react-native";
import React from "react";
import OutlinedButton from "./OutlinedButton";
import Icon from "./Icon";
import TonalButton from "./TonalButton";

const ActivityDetailed = ({ index }) => {
  const isSessionToday = (daysString) => {
    // Spanish day names mapping (0 = Sunday, 1 = Monday, etc.)
    const dayNames = {
      domingo: 0,
      lunes: 1,
      martes: 2,
      miércoles: 3,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sábado: 6,
      sabado: 6,
    };

    // Get current day number (0-6)
    const today = new Date().getDay();
    // Get tomorrow's day number
    const tomorrow = (today + 1) % 7;

    // Convert input string to array of clean day names
    const activityDays = daysString
      .toLowerCase()
      .split(" y ")
      .map((day) => day.trim());

    // Convert activity days to numbers
    const dayNumbers = activityDays.map((day) => dayNames[day]);

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

  const activities = [
    {
      name: "HIIT",
      days: "Lunes y Miércoles",
      time: "19:45",
      duration: "1:30",
      attendance: 25,
      relativeAttendance: "Elevada",
      place: "Predio 2",
    },
    {
      name: "Funcional",
      days: "Martes y Jueves",
      time: "18:30",
      duration: "1:00",
      attendance: 18,
      relativeAttendance: "Media",
      place: "Predio 1",
    },
    {
      name: "Yoga",
      days: "Viernes",
      time: "09:00",
      duration: "1:15",
      attendance: 12,
      relativeAttendance: "Baja",
      place: "Sala 3",
    },
  ];

  const activity = activities[index];

  const relativeAttendanceColor =
    activity.relativeAttendance === "Elevada"
      ? "text-green"
      : activity.relativeAttendance === "Media"
      ? "text-yellow"
      : "text-darkGray";
  return (
    <View className="shadow-sm w-[85vw] self-center bg-white rounded-2xl ">
      <Text className="text-h2 font-pregular mt-4 self-center mb-6 ">
        {activity.name}
      </Text>
      {isSessionToday(activity.days) && (
        <Text className="text-16 text-secondary  font-plight absolute top-2 right-2">
          {isSessionToday(activity.days)}
        </Text>
      )}

      <View className="flex-row items-center mb-4 ml-8">
        <Icon icon="calendar" />
        <Text className="text-16 font-pregular ml-4 text-darkGray">
          {activity.days}
        </Text>
      </View>
      <View className="flex-row items-center mb-4 ml-8">
        <Icon icon="schedule" />
        <Text className="text-16 font-pregular ml-4 text-darkGray">
          <Text className="font-pregular">{activity.time}</Text> hs
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
      <View className="flex-row items-center mb-4 ml-8">
        <Icon icon="group" />
        <Text className="text-16 font-pregular ml-4 text-darkGray">
          Asistencia:{" "}
          <Text className={relativeAttendanceColor + " font-pregular"}>
            {activity.relativeAttendance}
          </Text>
        </Text>
      </View>
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
      />
      <TonalButton
        title="Entrenar"
        containerStyles="self-center mt-4 mb-4"
        icon="dumbbell"
      />
    </View>
  );
};

export default ActivityDetailed;
