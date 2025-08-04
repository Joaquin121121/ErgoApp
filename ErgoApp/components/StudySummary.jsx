import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "./Icon";
import TonalButton from "./TonalButton";
import { router } from "expo-router";

const StudySummary = () => {
  const selectedStudy = {
    name: "Antropometría",
    data: [
      { icon: "donut", name: "Masa muscular", value: "24 kg" },
      { icon: "fat", name: "% de grasa corporal", value: "18%" },
      { icon: "barChart", name: "Índice Masa Corporal", value: "1.84" },
      { icon: "bone", name: "Masa ósea", value: "15 kg" },
      { icon: "measuringTape", name: "Perímetro de cintura", value: "38 cm" },
    ],
    recommendations: [
      "Enfoque contráctil",
      "Dieta proteica",
      "Ejercicios 3x/sem",
      "Monitoreo mensual",
    ],
  };
  return (
    <View className="shadow-sm w-[90vw] bg-white rounded-2xl pl-4 self-center mt-2">
      <Text className="font-pmedium text-16 self-center mt-2">
        {selectedStudy.name}
      </Text>
      {selectedStudy.data.map((e) => (
        <View className="flex flex-row items-center mt-8">
          <Icon icon={e.icon} />
          <Text className="text-darkGray font-plight text-sm ml-2">
            {e.name}: <Text className="text-secondary">{e.value}</Text>
          </Text>
        </View>
      ))}
      <View className="flex flex-row mt-8">
        <Icon icon="lightbulb" />
        <View>
          <Text className="text-darkGray text-sm font-plight ml-2">
            Recomendaciones:
          </Text>
          <Text className="ml-4 mt-2 pr-2 font-plight text-sm text-darkGray">
            {" - "}
            {selectedStudy.recommendations[0]}
          </Text>
          <TouchableOpacity>
            <Text className="mt-2 ml-4 font-pmedium text-sm text-secondary">
              {" - "}Ver más
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TonalButton
        title="Ver Todo"
        icon="arrow-right"
        containerStyles="self-center w-1/2 mt-8 mb-4"
        onPress={() => {
          router.push("studyDetails");
        }}
      />
    </View>
  );
};

export default StudySummary;
