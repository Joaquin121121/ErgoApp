import { View, Text, ScrollView } from "react-native";
import React, { useContext } from "react";
import OutlinedButton from "../components/OutlinedButton";
import Icon from "../components/Icon";
import { router } from "expo-router";

const trainingSolution = () => {
  const { coachInfo, selectedAthlete } = useContext(CoachContext);

  const entireAthlete = coachInfo.athletes.find(
    (athlete) => athlete.name === selectedAthlete
  );

  return (
    <ScrollView>
      <Text className="font-pregular text-[28px] ml-4">{selectedAthlete}</Text>
      <Text className="font-pregular mt-4 text-xl ml-4">
        Solución de Entrenamiento
      </Text>
      <View className="shadow-sm w-[85vw] self-center bg-white rounded-2xl p-4 pr-8 mt-2 ">
        <View className="flex flex-row">
          <Icon icon="target" />
          <View>
            <Text className="ml-2 font-pregular text-sm text-secondary">
              Objetivo:
            </Text>
            {entireAthlete.trainingSolutions.target.map((target) => (
              <Text className="ml-4 pr-2 font-pbold text-sm text-darkGray">
                {" - "}
                {target}
              </Text>
            ))}
          </View>
        </View>
        <View className="flex flex-row items-center mt-4">
          <Icon icon="dumbbellRed" />
          <View>
            <Text className="ml-2 font-pregular text-sm text-darkGray">
              {entireAthlete.trainingSolutions.additionals[0]}
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center mt-4">
          <Icon icon="barChart" />
          <View>
            <Text className="ml-2 font-pregular text-sm text-darkGray">
              {entireAthlete.trainingSolutions.additionals[1]}
            </Text>
          </View>
        </View>
      </View>
      <OutlinedButton
        title="Volver"
        onPress={() => router.back()}
        icon="arrowBackRed"
        containerStyles="mt-8 self-center w-[40vw]"
        inverse
      />
    </ScrollView>
  );
};

export default trainingSolution;
