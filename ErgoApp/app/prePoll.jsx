import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import Icon from "../components/Icon";
import TonalButton from "../components/TonalButton";
import { router } from "expo-router";

const prePoll = () => {
  const sentiments = [
    "veryDissatisfied",
    "dissatisfied",
    "neutral",
    "satisfied",
    "verySatisfied",
  ];
  const numbers = Array.from({ length: 5 }, (_, i) => i + 1);

  const [sleep, setSleep] = useState(null);
  const [diet, setDiet] = useState(null);
  const [fatigue, setFatigue] = useState(null);

  return (
    <ScrollView className="mt-12">
      <Text className="self-center font-pregular text-2xl">
        Como te sentís hoy?
      </Text>
      <Text className="self-center font-plight text-16 text-darkGray w-[90vw]">
        Esta información nos sirve para entender cómo estás y saber con qué
        intensidad entrenar.
      </Text>
      <View className="mt-8 self-center flex  w-[90%] bg-white shadow-sm rounded-2xl pb-8">
        <Text className="mt-8 font-pregular text-16 self-center">
          Como venís durmiendo?
        </Text>
        <View className="w-full flex flex-row justify-around mt-6">
          {sentiments.map((e) => (
            <TouchableOpacity onPress={() => setSleep(e)}>
              <Icon size={40} icon={sleep === e ? `${e}Red` : e}></Icon>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="mt-8 font-pregular text-16 self-center">
          Como te venís alimentando?
        </Text>
        <View className="w-full flex flex-row justify-around mt-6">
          {sentiments.map((e) => (
            <TouchableOpacity onPress={() => setDiet(e)}>
              <Icon size={40} icon={diet === e ? `${e}Red` : e}></Icon>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="mt-12 font-pregular text-16 self-center">
          Nivel de fatiga
        </Text>
        <Text className="self-center font-plight text-16 text-darkGray">
          Seleccione un número del 1-5
        </Text>
        <View className="mt-6 w-[95%] h-10 self-center flex flex-row items-center justify-between rounded-2xl border border-secondary overflow-hidden">
          {numbers.map((e) => (
            <View
              className={`flex flex-1 justify-center border-r border-lightRed h-full ${
                e === fatigue && "bg-lightRed"
              } ${e === 5 && "border-0"}`}
            >
              <TouchableOpacity onPress={() => setFatigue(e)}>
                <Text className="self-center font-pregular text-16 text-secondary">
                  {e}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
      <TonalButton
        title="Continuar"
        icon="next"
        containerStyles="self-center mt-4"
        onPress={() => {
          router.push("viewPlan?doExercises=true");
        }}
      />
    </ScrollView>
  );
};

export default prePoll;
