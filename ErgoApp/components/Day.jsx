import { View, Text } from "react-native";
import React from "react";
import Icon from "./Icon";

const Day = ({ day, sessionName }) => {
  const isRestDay = sessionName === "restDay";

  return (
    <View className="w-[110px] h-full shadow-sm bg-white rounded-xl flex items-center">
      <Text className="font-plight text-darkGray mt-2">{day}</Text>
      <Text
        className={`text-sm mt-2 ${
          isRestDay ? "text-black font-plight" : "text-secondary font-pmedium"
        }`}
      >
        {isRestDay ? "Descanso" : sessionName}
      </Text>
      <Icon
        style={{ marginTop: 8 }}
        icon={isRestDay ? "greenCheck" : "close"}
        size={32}
      />
    </View>
  );
};

export default Day;
