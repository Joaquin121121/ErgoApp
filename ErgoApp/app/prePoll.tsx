import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import Icon from "../components/Icon";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import Slider from "@react-native-community/slider";
import { getColor } from "../constants/Colors";
import { type WellnessType } from "../constants/wellnessColors";
import TonalButton from "../components/TonalButton";
import { useUser } from "../contexts/UserContext";
import { Athlete, WellnessData } from "../types/Athletes";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const prePoll = () => {
  const [sleep, setSleep] = useState<number>(8);
  const [nutrition, setnutrition] = useState<number>(8);
  const [fatigue, setFatigue] = useState<number>(2);
  const { userData, savePollResults } = useUser();
  const { sessionId } = useLocalSearchParams();

  const handleValueChange = (type: WellnessType, value: number) => {
    if (type === "sleep") setSleep(value);
    if (type === "nutrition") setnutrition(value);
    if (type === "fatigue") setFatigue(value);
  };

  const handleContinue = () => {
    const wellnessData: WellnessData = {
      id: uuidv4(),
      date: new Date(),
      sleep,
      nutrition,
      fatigue,
    };
    savePollResults((userData as Athlete).id, wellnessData);
    router.replace(
      `viewPlan?doExercises=true&sessionId=${sessionId}` as RelativePathString
    );
  };

  return (
    <ScrollView className="pt-8">
      <Text className="self-center font-pregular text-2xl">
        Como te sentís hoy?
      </Text>
      <Text className="self-center font-plight text-16 w-[90vw] mt-2">
        Esta información nos sirve para entender cómo estás y saber con qué
        intensidad entrenar.
      </Text>
      <View className="mt-8 self-center flex  w-[90%] bg-white shadow-sm rounded-2xl pb-8">
        <Text className="mt-8 font-pregular text-16 self-center">
          Como venís durmiendo?
        </Text>
        <View className="w-full px-6 ">
          <View className="relative">
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={sleep}
              onValueChange={(value) => handleValueChange("sleep", value)}
              minimumTrackTintColor={getColor("sleep")}
              maximumTrackTintColor={getColor("sleep", "veryLight")}
            />
          </View>
          <Text
            className="text-center font-pregular text-lg"
            style={{ color: getColor("sleep") }}
          >
            {sleep}/10
          </Text>
        </View>

        <Text className="mt-8 font-pregular text-16 self-center">
          Como te venís alimentando?
        </Text>
        <View className="w-full px-6 ">
          <View className="relative">
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={nutrition}
              onValueChange={(value) => handleValueChange("nutrition", value)}
              minimumTrackTintColor={getColor("nutrition")}
              maximumTrackTintColor={getColor("nutrition", "veryLight")}
            />
          </View>
          <Text
            className="text-center font-pregular text-lg "
            style={{ color: getColor("nutrition") }}
          >
            {nutrition}/10
          </Text>
        </View>

        <Text className="mt-8 font-pregular text-16 self-center">
          Nivel de fatiga
        </Text>
        <View className="w-full px-6 ">
          <View className="relative">
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={fatigue}
              onValueChange={(value) => handleValueChange("fatigue", value)}
              minimumTrackTintColor={getColor("fatigue")}
              maximumTrackTintColor={getColor("fatigue", "veryLight")}
            />
          </View>
          <Text
            className="text-center  font-pregular text-lg"
            style={{ color: getColor("fatigue") }}
          >
            {fatigue}/10
          </Text>
        </View>

        <TonalButton
          onPress={handleContinue}
          title="Continuar"
          icon="arrow-right"
          containerStyles="mt-8 self-center"
        />
      </View>
    </ScrollView>
  );
};

export default prePoll;
