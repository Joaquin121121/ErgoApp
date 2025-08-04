import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { categories } from "../scripts/categories";
import Icon from "../components/Icon";
import TonalButton from "../components/TonalButton";
import { router } from "expo-router";
import { useContext } from "react";
const ScreeningInfo = () => {
  const studyInfo = categories.studies.find(
    (study) => study.name === "Screening"
  );

  const { currentStudyData, setCurrentStudyData } = useContext(CoachContext);
  const onPress = () => {
    setCurrentStudyData({ availableMovements: [] });
    router.push("screeningParameters");
  };

  return (
    <ScrollView>
      <View className="w-full self-center justify-start">
        <Text className="text-3xl font-pregular self-center mt-4">
          Screening
        </Text>
        <View className="self-center mt-4 bg-white rounded-2xl shadow-sm w-[85vw] p-6">
          <Text className="font-pregular text-2xl self-center text-secondary mb-2">
            ¿Qué es?
          </Text>
          <Text className="font-plight text-sm">{studyInfo.description}</Text>
        </View>
        <View className="shadow-sm w-[85vw] self-center bg-white rounded-2xl mt-4 p-4 pt-8">
          {Object.keys(studyInfo.characteristics).map((key) => (
            <View className="flex-row mb-4 pl-4 pr-4">
              <Icon icon={key} />
              <Text className="text-16 font-pregular ml-4 text-tertiary ">
                <Text className="text-secondary ">
                  {studyInfo.characteristics[key][0]}
                  {": "}
                </Text>
                {studyInfo.characteristics[key][1]}
              </Text>
            </View>
          ))}
        </View>
        <TonalButton
          title="Comenzar"
          icon="arrow-right"
          containerStyles="self-center mt-8"
          onPress={onPress}
        />
      </View>
    </ScrollView>
  );
};

export default ScreeningInfo;
