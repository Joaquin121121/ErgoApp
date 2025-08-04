import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import OutlinedButton from "./OutlinedButton";
import TonalButton from "./TonalButton";
import CircularTimer from "./CircularTimer";
import { SelectedExercise, Progression } from "../types/trainingPlan";
import { spanishPositionalSuffixFactory } from "../utils/utils";

interface ExtendedProgression extends Progression {
  key: string;
  remainingSeries: number;
}
interface ExerciseDisplayProps {
  progression: ExtendedProgression;
  exercise: SelectedExercise;
  isTimerActive?: boolean;
  timerSeconds?: number;
}

const ExerciseDisplay = ({
  progression,
  isTimerActive = false,
  timerSeconds = 0,
  exercise,
}: ExerciseDisplayProps) => {
  const instructions: (keyof SelectedExercise)[] = [
    "repetitions",
    "series",
    "effort",
    "restTime",
    "comments",
  ];

  const renderInstruction = (instruction: keyof SelectedExercise) => {
    if (instruction === "repetitions") {
      if (!progression.repetitions.includes("-")) {
        return (
          <Text className="mt-3 font-plight text-16 ml-2">
            <Text className="text-secondary font-pmedium">
              {progression.repetitions}
            </Text>{" "}
            repeticiones
          </Text>
        );
      }
      const repetitions = progression.repetitions.split("-");
      return (
        <Text className="mt-3 font-plight text-16 ml-2">
          {repetitions.map((repetition, index) => (
            <Text className="mt-1 font-plight text-16 ml-2" key={repetition}>
              {spanishPositionalSuffixFactory(index + 1, "female")}:{" "}
              <Text className="text-secondary font-pmedium">{repetition}</Text>
              {"  "}
              repeticiones
            </Text>
          ))}
        </Text>
      );
    }

    if (instruction === "series") {
      const remainingSeries = progression.remainingSeries;
      return (
        <Text className="mt-3 font-plight text-16 ml-2">
          <Text className="text-secondary font-pmedium">{remainingSeries}</Text>
          {"  "}
          serie{remainingSeries === 1 ? "" : "s"} restante
          {remainingSeries === 1 ? "" : "s"}
        </Text>
      );
    }

    if (instruction === "restTime") {
      return (
        <Text className="mt-3 font-plight text-16 ml-2">
          <Text className="text-secondary font-pmedium">
            {exercise.restTime}
          </Text>{" "}
          segundos de descanso
        </Text>
      );
    }

    if (instruction === "effort") {
      return (
        <Text className="mt-3 font-plight text-16 ml-2">
          <Text className="text-secondary font-pmedium">
            {progression.effort}
          </Text>{" "}
          de Carácter del Esfuerzo
        </Text>
      );
    }

    return null;
  };

  // Check if timer was active but is now completed
  const isTimerCompleted = isTimerActive && timerSeconds === 0;

  return (
    <View className="self-center shadow-sm bg-white rounded-2xl w-[90vw] h-[480px] overflow-hidden">
      <Text className="font-pregular text-center text-2xl self-center bg-secondary text-white w-full py-2 ">
        {exercise.name}
      </Text>
      <View className="pl-4 flex-1 justify-between">
        <View>
          <Text className="font-pregular text-xl mt-8 ">Instrucciones</Text>
          {instructions.map((e) => renderInstruction(e))}
          <TouchableOpacity>
            <Text className="text-secondary mt-3 font-pmedium text-16 ml-2">
              Ver video
            </Text>
          </TouchableOpacity>
        </View>

        {/* Rest Timer - show when active or completed */}
        {(isTimerActive || isTimerCompleted) && (
          <CircularTimer
            seconds={timerSeconds}
            totalSeconds={exercise.restTime}
            isCompleted={isTimerCompleted}
          />
        )}

        {/* Spacer when no timer */}
        {!isTimerActive && !isTimerCompleted && <View className="h-20" />}
      </View>
    </View>
  );
};

export default ExerciseDisplay;
