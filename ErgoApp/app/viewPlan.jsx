import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import ExerciseDisplay from "../components/ExerciseDisplay";
import CustomFlatlist from "../components/CustomFlatlist";
import OutlinedButton from "../components/OutlinedButton";
import TonalButton from "../components/TonalButton";
import { router, useLocalSearchParams } from "expo-router";

const ViewPlan = () => {
  const [exercisesN, setExercisesN] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
  const [completedExercises, setCompletedExercises] = useState([]);
  const [exercisesWithImprovement, setExercisesWithImprovement] = useState([]);
  const { doExercises } = useLocalSearchParams();

  const [exercises, setExercises] = useState([
    {
      key: "0",
      name: "Press de Banca",
      instructions: [
        "6-8 repeticiones",
        "3 sets",
        "20kg por lado",
        "cerca del fallo muscular",
      ],
      categories: {
        reps: "6-8",
        sets: "3",
        weight: "20",
      },
    },
    {
      key: "1",
      name: "Sentadillas",
      instructions: [
        "8-10 repeticiones",
        "4 sets",
        "25kg por lado",
        "profundidad paralela",
      ],
      categories: {
        reps: "8-10",
        sets: "4",
        weight: "25",
      },
    },
    {
      key: "2",
      name: "Peso Muerto",
      instructions: [
        "5-6 repeticiones",
        "3 sets",
        "30kg por lado",
        "mantener espalda recta",
      ],
      categories: {
        reps: "5-6",
        sets: "3",
        weight: "30",
      },
    },
    {
      key: "3",
      name: "Remo con Barra",
      instructions: [
        "8-12 repeticiones",
        "3 sets",
        "15kg por lado",
        "codos cerca del cuerpo",
      ],
      categories: {
        reps: "8-12",
        sets: "3",
        weight: "15",
      },
    },
    {
      key: "4",
      name: "Press Militar",
      instructions: [
        "6-8 repeticiones",
        "4 sets",
        "15kg por lado",
        "control en el movimiento",
      ],
      categories: {
        reps: "6-8",
        sets: "4",
        weight: "15",
      },
    },
    {
      key: "5",
      name: "Dominadas",
      instructions: [
        "6-10 repeticiones",
        "3 sets",
        "peso corporal",
        "hasta mentón sobre barra",
      ],
      categories: {
        reps: "6-10",
        sets: "3",
        weight: "0",
      },
    },
    {
      key: "6",
      name: "Fondos en Paralelas",
      instructions: [
        "8-12 repeticiones",
        "3 sets",
        "peso corporal",
        "90 grados de flexión",
      ],
      categories: {
        reps: "8-12",
        sets: "3",
        weight: "0",
      },
    },
  ]);

  const renderExercise = (item) => (
    <ExerciseDisplay
      exerciseName={item.name}
      instructions={item.instructions}
    />
  );
  const handleOutlinedPress = () => {
    if (!currentAction) {
      setCurrentAction("skip");
      return;
    }
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
    if (currentAction === "next") {
      setCompletedExercises((prev) => [...prev, exercises[activeIndex]]);
    }
    setCurrentAction("");
  };

  const handleTonalPress = () => {
    if (!currentAction) {
      setCurrentAction("next");
      return;
    }
    if (currentAction === "next") {
      setCompletedExercises((prev) => [...prev, exercises[activeIndex]]);
      setExercisesWithImprovement((prev) => [...prev, exercises[activeIndex]]);

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
    } else {
      setExercises((prevExercises) => {
        const currentExercise = prevExercises[activeIndex];
        const filteredExercises = prevExercises
          .filter((_, i) => i !== activeIndex)
          .map((exercise, index) => ({
            ...exercise,
            key: index.toString(),
          }));
        return [
          ...filteredExercises,
          { ...currentExercise, key: filteredExercises.length.toString() },
        ];
      });
    }
    setCurrentAction("");
  };

  useEffect(() => {
    setExercisesN(exercises.length);
  }, []);

  useEffect(() => {
    console.log(exercisesWithImprovement, completedExercises);
    exercises.length === 0 &&
      router.replace(
        `success?completedExercises=${completedExercises.length}/${exercisesN}&improvedExercises=${exercisesWithImprovement.length}/${completedExercises.length}`
      );
  }, [exercises]);

  return (
    <ScrollView className="mt-4">
      <View className="pl-4">
        <Text className="font-pregular text-h3 mb-4">Ejercicios</Text>
        <CustomFlatlist
          data={exercises}
          renderContent={renderExercise}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          large={true}
          height={490}
          itemWidthPercentage={0.85}
          slideDistance={8}
          scaleRange={[0.9, 1, 0.9]}
          showIndicators={true}
          indicatorActiveColor="#E81D23"
          indicatorInactiveColor="#D9D9D9"
        />
        {currentAction === "next" && (
          <Text className="self-center text-sm font-pregular mt-6">
            Pudiste hacer {exercises[activeIndex]["instructions"][0]} con{" "}
            {exercises[activeIndex]["instructions"][2]}?
          </Text>
        )}
        {currentAction === "skip" && (
          <Text className="self-center text-sm font-pregular mt-6">
            Desea posponer u omitir {exercises[activeIndex]["name"]}?
          </Text>
        )}
        {currentAction === "" && (
          <Text className="self-center text-sm font-pregular text-offWhite mt-6">
            {" "}
          </Text>
        )}

        <View className="mt-4 flex flex-row justify-around w-full self-center">
          {doExercises ? (
            <>
              <OutlinedButton
                title={
                  currentAction
                    ? currentAction === "next"
                      ? "No esta vez"
                      : "Omitir"
                    : "Saltear"
                }
                icon={
                  currentAction
                    ? currentAction === "next"
                      ? "fail"
                      : "skipNext"
                    : "fastForward"
                }
                containerStyles="w-[40%]"
                onPress={handleOutlinedPress}
              />
              <TonalButton
                title={
                  currentAction
                    ? currentAction === "next"
                      ? "Sí pude"
                      : "Posponer"
                    : "Listo"
                }
                icon={currentAction === "skip" ? "postpone" : "checkWhite"}
                containerStyles="w-[40%]"
                onPress={handleTonalPress}
              />
            </>
          ) : (
            <>
              <OutlinedButton
                title="Volver"
                icon="arrowBackRed"
                containerStyles="w-[40%]"
                inverse
                onPress={() => router.back()}
              />
              <TonalButton
                title="Entrenar"
                icon="dumbbell"
                containerStyles="w-[40%]"
                onPress={() => router.replace("prePoll")}
              />
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ViewPlan;
