import { View, Text } from "react-native";
import React, { useContext } from "react";

import TonalButton from "../components/TonalButton";
import { router } from "expo-router";
import ChatContext from "../contexts/ChatContext";

const CoachDisplay = ({ name }) => {
  const { currentCoach, setCurrentCoach, coaches } = useContext(ChatContext);

  const handlePress = () => {
    console.log(coaches);
    setCurrentCoach(name);
    router.push("chat");
  };
  return (
    <View className="rounded-2xl bg-white shadow-sm w-[85vw] self-center">
      <View className="absolute top-2 right-2 rounded-full bg-darkGray h-8 w-8" />
      <Text className="text-secondary text-sm font-plight ml-2 mt-2">
        3 mensajes nuevos
      </Text>
      <Text className="mt-4 self-center font-pregular text-2xl">{name}</Text>
      <Text className="mt-1 self-center text-darkGray font-plight text-16">
        Coach de Musculación
      </Text>
      <View className="self-center w-[80%] mt-6">
        <Text className="font-pregular text-16">
          - Especialista en hipertrofia
        </Text>
        <Text className="font-pregular text-16">- 5 años de experiencia</Text>
        <Text className="font-pregular text-16">
          - Le apasiona ayudar a atletas a alcanzar su máximo potencial
        </Text>
      </View>
      <TonalButton
        containerStyles="mt-8 mb-4 self-center"
        title="Ver Mensajes"
        icon="chatWhite"
        onPress={handlePress}
      />
    </View>
  );
};

export default CoachDisplay;
