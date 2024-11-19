import { View, Text } from "react-native";
import React, { useContext } from "react";
import Icon from "./Icon";
import TonalButton from "./TonalButton";
import CoachContext from "../contexts/CoachContext";
const NotificationDisplay = ({ index }) => {
  const { coachInfo } = useContext(CoachContext);

  const notification = coachInfo.notifications[index];

  return (
    <View className="shadow-sm w-[85vw] self-center  bg-white rounded-2xl ">
      <Text className="text-14 text-secondary font-pregular mt-2 ml-2">
        {notification.title}
      </Text>
      <View className="flex flex-row items-center mt-8 self-center w-[90%]  justify-between">
        <Icon icon={notification.imageDisplay} size={72} />
        <Text className="text-14 font-pregular text-darkGray w-[60%]">
          {notification.message}
        </Text>
      </View>
      <TonalButton
        title={notification.type === "message" ? "Chatear" : "Ver Estudios "}
        containerStyles="self-center mt-8 mb-4"
        icon={notification.type === "message" ? "chatWhite" : "planWhite"}
      />
    </View>
  );
};

export default NotificationDisplay;
