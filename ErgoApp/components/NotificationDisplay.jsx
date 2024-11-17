import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Icon from "./Icon";
import TonalButton from "./TonalButton";

const NotificationDisplay = ({ index }) => {
  const notifications = [
    {
      type: "message",
      title: "Joaquín te envió un mensaje",
      message:
        "Hola profe, me esguinzé el tobillo anoche, cómo debería entrenar?",
      imageDisplay: "Roger",
    },
    {
      type: "pendingStudy",
      title: "Estudio pendiente",
      message: "16 estudios de asimetrías para el 14/11 (lunes que viene)",
      imageDisplay: "plan",
    },
    {
      type: "pendingStudy",
      title: "Estudio pendiente",
      message: "16 estudios de asimetrías para el 14/11 (lunes que viene)",
      imageDisplay: "plan",
    },
  ];

  const notification = notifications[index];

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
