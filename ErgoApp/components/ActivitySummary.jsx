import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Icon from "./Icon";
import OutlinedButton from "./OutlinedButton";
import TonalButton from "./TonalButton";
const ActivitySummary = ({ index }) => {
  const activities = [
    { name: "HIIT", time: "19:45", duration: "1:30", attendance: "274" },
    { name: "HIIT", time: "19:45", duration: "1:30", attendance: "274" },
    { name: "HIIT", time: "19:45", duration: "1:30", attendance: "274" },
  ];

  const item = activities[index || 0];

  useEffect(() => {
    console.log(index);
  }, []);

  return (
    <View className="shadow-sm w-[85vw] self-center h-60 bg-white rounded-2xl ">
      <Text className="self-center text-xl mt-2">{item.name}</Text>
      <View className="flex-row items-center mt-4 ml-8">
        <Icon icon="schedule" />
        <Text className="font-pregular text-16 ml-2 ">{item.time}</Text>
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
        />
        <TonalButton
          containerStyles="w-[40%]"
          icon="dumbbell"
          title="Entrenar"
        />
      </View>
    </View>
  );
};

export default ActivitySummary;
