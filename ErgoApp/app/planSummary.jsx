import { View, Text, ScrollView } from "react-native";
import React, { useContext, useRef, useEffect } from "react";
import { router } from "expo-router";
import OutlinedButton from "../components/OutlinedButton";
import TonalButton from "../components/TonalButton";

const planSummary = () => {
  const {
    exercises,
    initialExercises,
    activeIndex,
    completedExercises,
    skippedExercises,
  } = useContext(CurrentClassContext);

  const displayCategories = Object.keys(exercises[0].categories).slice(0, 3);

  const scrollViewRef = useRef(null);

  const getColor = (e) => {
    let color;
    if (e.name === exercises[activeIndex].name) {
      color = "border border-blue";
    }
    completedExercises.forEach((completed) => {
      if (completed.name === e.name) {
        color = "border border-green";
      }
    });
    skippedExercises.forEach((skipped) => {
      if (skipped.name === e.name) {
        color = "border border-secondary";
      }
    });
    return color;
  };

  const translateCategory = (category) => {
    switch (category) {
      case "weight":
        return "peso";
      default:
        return category;
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  return (
    <ScrollView ref={scrollViewRef} className="mt-4">
      <View className="pl-4">
        <Text className="font-pregular text-h3 mb-4">Ejercicios</Text>
        <View className="mt-4">
          <Text className="font-plight text-sm">
            <Text className="text-green">Verde: </Text>Completado
          </Text>
          <Text className="font-plight text-sm mt-2">
            <Text className="text-secondary">Rojo: </Text>Salteado
          </Text>
          <View className="flex flex-row justify-between mt-2">
            <Text className="font-plight text-sm">
              <Text className="text-blue">Azul: </Text>Actual
            </Text>
            <View className="flex flex-row">
              {displayCategories.map((category) => (
                <Text className="font-plight text-sm mr-5 text-darkGray">
                  {translateCategory(category)}
                </Text>
              ))}
            </View>
          </View>
          {initialExercises.map((e) => (
            <View
              className={`w-[95vw] h-16 bg-white rounded-2xl shadow-sm mt-4 flex flex-row items-center justify-between ${getColor(
                e
              )}`}
            >
              <Text className="font-pregular text-16 ml-4 ">{e.name}</Text>
              <View className="flex flex-row">
                {displayCategories.map((category) => (
                  <Text className=" font-plight text-sm mr-8">
                    {e.categories[category]}
                  </Text>
                ))}
              </View>
            </View>
          ))}
          <OutlinedButton
            containerStyles="self-center mt-8 w-[60vw]"
            title="Ver Ejercicios"
            onPress={() => router.back()}
            icon="dumbbellRed"
          />
          <TonalButton
            title="Continuar"
            icon="arrow-right"
            containerStyles="self-center mt-4 w-[60vw] mb-12"
            onPress={() => router.replace("coachHome")}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default planSummary;
