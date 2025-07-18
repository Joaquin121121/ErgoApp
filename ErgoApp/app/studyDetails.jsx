import { View, Text, ScrollView } from "react-native";
import React, { useContext } from "react";
import Icon from "../components/Icon";
import TonalButton from "../components/TonalButton";

const studyDetails = () => {
  const { selectedAthlete } = useContext(CoachContext);
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
    <ScrollView>
      <Text className="font-pmedium mt-4 text-2xl ml-4">Antropometría</Text>
      <Text className="font-pregular mt-4 text-xl ml-4">Recomendaciones</Text>
      <View className="shadow-sm w-[90vw] bg-white rounded-2xl p-4 self-center mt-2">
        {selectedStudy.recommendations.map((e) => (
          <Text className="font-pregular mt-2">
            {" - "}
            {e}
          </Text>
        ))}
      </View>
      <Text className="font-pregular mt-4 text-xl ml-4">Info General</Text>
      <View className="shadow-sm w-[90vw] bg-white rounded-2xl pb-8 pl-4 self-center mt-2">
        {selectedStudy.data.map((e) => (
          <View className="flex flex-row items-center mt-8">
            <Icon icon={e.icon} />
            <Text className="text-darkGray font-plight text-sm ml-2">
              {e.name}: <Text className="text-secondary">{e.value}</Text>
            </Text>
          </View>
        ))}
      </View>
      <TonalButton
        title="Ver Estudio"
        icon="document"
        containerStyles="mt-8 self-center"
      />
    </ScrollView>
  );
};

export default studyDetails;
