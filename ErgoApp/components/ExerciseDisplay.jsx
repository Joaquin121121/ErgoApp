import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useContext } from "react";
import OutlinedButton from "./OutlinedButton";
import TonalButton from "./TonalButton";
import CurrentClassContext from "../contexts/CurrentClassContext";
const ExerciseDisplay = ({ exerciseName, instructions, coachMode }) => {
  const {
    exercises,
    setExercises,
    setActiveIndex,
    completedExercises,
    setCompletedExercises,
    skippedExercises,
    setSkippedExercises,
    activeIndex,
  } = useContext(CurrentClassContext);

  const removeExercise = () => {
    setExercises((prevExercises) => {
      const newExercises = prevExercises
        .filter((_, i) => i !== activeIndex)
        .map((exercise, index) => ({
          ...exercise,
          key: index.toString(), // Reindex the keys
        }));
      if (activeIndex >= newExercises.length) {
        setActiveIndex(Math.max(0, newExercises.length - 1));
      }
      return newExercises;
    });
  };

  const onSkip = () => {
    setSkippedExercises((prev) => [...prev, exercises[activeIndex]]);

    removeExercise();
  };

  const onDone = () => {
    setCompletedExercises((prev) => [...prev, exercises[activeIndex]]);

    removeExercise();
  };

  return (
    <View className="self-center shadow-sm bg-white rounded-2xl w-[90vw] h-[480px]">
      <Text className="font-pregular text-xl self-center mt-8">
        {exerciseName}
      </Text>
      <View className="pl-4">
        <Text className="font-pregular text-16 mt-8 ">Instrucciones</Text>
        {instructions.map((e) => (
          <Text className="mt-2 font-plight text-sm text-darkGray ml-2">
            {e}
          </Text>
        ))}
        <TouchableOpacity>
          <Text className="text-secondary mt-2 font-pmedium text-sm ml-2">
            Ver video
          </Text>
        </TouchableOpacity>
      </View>
      {!coachMode ? (
        <View className="self-center mt-8 mb-8 rounded-2xl bg-gray w-[90%] h-40"></View>
      ) : (
        <View className="self-center mt-8 w-full flex flex-1 pb-8 flex-row justify-around items-end">
          <OutlinedButton
            title="Saltear"
            icon="fastForward"
            onPress={onSkip}
            containerStyles="w-[40%]"
          />
          <TonalButton
            title="Listo"
            containerStyles="w-[40%]"
            icon="checkWhite"
            onPress={onDone}
          />
        </View>
      )}
    </View>
  );
};

export default ExerciseDisplay;
