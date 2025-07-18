import { View, Text } from "react-native";
import React, { useContext } from "react";
import Icon from "./Icon";
import OutlinedButton from "./OutlinedButton";
import TonalButton from "./TonalButton";
import { router } from "expo-router";
const ActivitySummary = ({ index }) => {
  const { coachInfo } = useContext(CoachContext);
  const activities = coachInfo.classes;

  const item = activities[index || 0];

  const formatOrderedDays = (days) => {
    const dayOrder = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Domingo: 7,
    };

    const orderedDays = [...days].sort((a, b) => dayOrder[a] - dayOrder[b]);

    if (orderedDays.length === 0) return "";
    if (orderedDays.length === 1) return orderedDays[0];

    return (
      orderedDays.slice(0, -1).join(", ") +
      " y " +
      orderedDays[orderedDays.length - 1]
    );
  };

  return (
    <View className="shadow-sm w-[85vw] self-center h-60 bg-white rounded-2xl ">
      <Text className="self-center text-xl mt-2">{item.name}</Text>
      <View className="flex-row items-center mt-4 ml-8">
        <Icon icon="schedule" />
        <Text className="font-pregular text-16 ml-2 ">
          {formatOrderedDays(item.time[0].days)}, {item.time[0].hour}
        </Text>
      </View>
      <View className="flex-row items-center mt-4 ml-8">
        <Icon icon="timer" />
        <Text className="font-pregular text-16 ml-2">{item.duration}</Text>
      </View>
      <View className="flex-row items-center mt-4 ml-8">
        <Icon icon="personRed" />
        <Text className="font-pregular text-16 ml-2">
          {item.attendance} personas
        </Text>
      </View>
      <View className="self-center w-full flex flex-row justify-evenly items-center mt-8">
        <OutlinedButton
          containerStyles="w-[40%]"
          icon="plan"
          title="Ver Plan"
          onPress={() => router.push("coachViewPlan")}
        />
        <TonalButton
          containerStyles="w-[40%]"
          icon="dumbbell"
          title="Entrenar"
          onPress={() => router.push(`coachViewPlan?action=doExercises`)}
        />
      </View>
    </View>
  );
};

export default ActivitySummary;
