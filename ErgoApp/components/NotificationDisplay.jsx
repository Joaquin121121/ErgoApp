import { View, Text } from "react-native";
import React, { useContext } from "react";
import Icon from "./Icon";
import TonalButton from "./TonalButton";
import CoachContext from "../contexts/CoachContext";
import { router } from "expo-router";
import { auth } from "../scripts/firebase";
import ChatContext from "../contexts/ChatContext";

const NotificationDisplay = ({ index }) => {
  const { coachInfo } = useContext(CoachContext);
  const { setCurrentRecipient } = useContext(ChatContext);
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
        onPress={() => {
          if (notification.type === "message") {
            setCurrentRecipient(
              coachInfo.athletes.find((e) => e.uid === notification.uid).name
            );
            router.push(
              `/chat?senderId=${auth.currentUser.uid}&receiverId=${notification.uid}`
            );
          }
        }}
      />
    </View>
  );
};

export default NotificationDisplay;
