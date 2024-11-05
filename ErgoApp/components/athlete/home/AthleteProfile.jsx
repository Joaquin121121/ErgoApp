import { View, Text } from "react-native";
import React from "react";

const AthleteProfile = () => {
  return (
    <View className="shadow-sm w-[85vw] self-center h-40 bg-white rounded-xl flex flex-row ">
      <View className="w-1/2 h-full flex justify-center items-center">
        <Text className="text-secondary font-psemibold text-2xl">Avanzado</Text>
      </View>
      <View className="w-1/2 h-full flex justify-evenly pl-2">
        <Text className="text-darkGray font-plight">-Alta explosividad</Text>
        <Text className="text-darkGray font-plight">-Fuerza promedio</Text>
        <Text className="text-darkGray font-plight">-Baja resistencia</Text>
      </View>
    </View>
  );
};

export default AthleteProfile;
