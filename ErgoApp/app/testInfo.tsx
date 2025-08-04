import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { studiesInfo } from "../constants/data";

const testInfo = () => {
  const { testType } = useLocalSearchParams();

  const info = studiesInfo[testType as keyof typeof studiesInfo];

  return (
    <ScrollView>
      <View className="w-[95vw] rounded-2xl shadow-sm self-center mb-8 pb-8 px-4 bg-white overflow-hidden">
        <Text className="text-2xl self-center text-center w-[95vw] bg-secondary text-white py-2">
          {info.name}
        </Text>
        <Text className="text-center text-lg mt-4">{info.shortDesc}</Text>

        <Text className=" mt-8 text-xl text-secondary font-medium">
          Qué es?
        </Text>
        <Text className="  mt-2 text-tertiary text-16">{info.longDesc}</Text>
        <Text className=" mt-8 text-xl text-secondary font-medium">
          Que dispositivos se utilizan?
        </Text>
        <Text className="  mt-2 text-tertiary text-16">
          Se puede medir utilizando una{" "}
          <Text className="text-secondary text-16">{info.equipment[0]}</Text>
        </Text>
        <Text className=" mt-8 text-xl text-secondary font-medium">
          Qué busca medir?
        </Text>
        <View className="list-disc mt-2">
          {info.measures.map((measure) => (
            <Text key={measure} className="text-tertiary text-16">
              • {measure}
            </Text>
          ))}
        </View>
        <Text className=" mt-8 text-xl text-secondary font-medium">
          Como se aplican los resultados?
        </Text>
        <Text className=" mt-2 text-tertiary text-16">
          {info.trainingApplications}
        </Text>
      </View>
    </ScrollView>
  );
};

export default testInfo;
