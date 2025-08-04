import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import ExerciseDisplay from "../components/ExerciseDisplay";
import CustomFlatlist, {
  CustomFlatlistItem,
  CustomFlatlistRef,
} from "../components/CustomFlatlist";
import OutlinedButton from "../components/OutlinedButton";
import TonalButton from "../components/TonalButton";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import {
  DisplaySelectedExercise,
  SelectedExercise,
  Progression,
  TrainingBlock,
} from "../types/trainingPlan";
import {
  findMonday,
  getCurrentProgression,
  getExercisesArray,
  getCurrentDayName,
} from "../utils/utils";
import { useUser } from "../contexts/UserContext";
import {
  Athlete,
  SessionPerformanceData,
  ExercisePerformanceData,
} from "../types/Athletes";
import { useDatabaseSync } from "../hooks/useDatabaseSync";

interface ExtendedProgression extends Progression {
  key: string;
  remainingSeries: number;
  isSkipped?: boolean;
}

interface ExtendedExercise extends DisplaySelectedExercise {
  key: string;
  isPostponed?: boolean;
  isSkipped?: boolean;
  extendedProgression?: ExtendedProgression;
}

const ViewPlan = () => {
  const [exercisesN, setExercisesN] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
  const [currentBlockName, setCurrentBlockName] = useState("");
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);

  const { doExercises, sessionId } = useLocalSearchParams();
  const { pushRecord } = useDatabaseSync();
  const doExercisesBoolean = doExercises === "true";
  const flatListRef = useRef<CustomFlatlistRef>(null);

  const [sessionResult, setSessionResult] = useState<SessionPerformanceData>({
    id: "",
    sessionDayName: getCurrentDayName(),
    sessionId: sessionId as string,
    week: findMonday(new Date()),
    performance: 0,
    completedExercises: 0,
    exercisePerformanceData: [],
  });
  const { userData, saveSessionPerformance } = useUser();
  const athleteData = userData as Athlete;

  const relevantSession = athleteData.currentTrainingPlan?.sessions.find(
    (session) => session.id === sessionId
  );

  const [exercises, setExercises] = useState<ExtendedExercise[]>([]);

  const currentExercise = exercises[activeIndex] || null;
  const currentProgression = currentExercise?.extendedProgression || null;

  // Timer functions
  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setIsTimerActive(true);

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerActive(false);
    setTimerSeconds(0);
  };

  // Get block information for an exercise
  const getBlockInfo = (exercise: ExtendedExercise) => {
    if (!exercise.blockId || !relevantSession) return null;
    return relevantSession.exercises.find(
      (ex) => ex.type === "trainingBlock" && ex.id === exercise.blockId
    ) as TrainingBlock | undefined;
  };

  // Get all exercises in the same block
  const getBlockExercises = (
    blockId: string,
    exercisesArray?: ExtendedExercise[]
  ) => {
    const exercisesToUse = exercisesArray || exercises;
    return exercisesToUse.filter(
      (ex) => ex.blockId === blockId && !ex.isSkipped
    );
  };

  // Get all exercises in the same block (including skipped ones)
  const getAllBlockExercises = (
    blockId: string,
    exercisesArray?: ExtendedExercise[]
  ) => {
    const exercisesToUse = exercisesArray || exercises;
    return exercisesToUse.filter((ex) => ex.blockId === blockId);
  };

  // Check if any exercise in the block has remaining series or is not skipped
  const hasAvailableExercisesInBlock = (
    blockId: string,
    excludeExerciseId?: string,
    exercisesArray?: ExtendedExercise[]
  ) => {
    const blockExercises = getBlockExercises(blockId, exercisesArray);
    return blockExercises.some(
      (ex) =>
        ex.id !== excludeExerciseId &&
        ex.extendedProgression &&
        !ex.isSkipped &&
        ex.extendedProgression.remainingSeries > 0
    );
  };

  // Check if there are forward exercises available in the block
  const hasForwardExercisesInBlock = (
    currentExercise: ExtendedExercise,
    exercisesArray?: ExtendedExercise[]
  ) => {
    const block = getBlockInfo(currentExercise);
    if (!block || block.blockModel !== "series") return false;

    const exercisesToUse = exercisesArray || exercises;
    // Get ALL block exercises (including skipped ones) to find the correct position
    const allBlockExercises = getAllBlockExercises(
      currentExercise.blockId!,
      exercisesToUse
    );
    const currentIndex = allBlockExercises.findIndex(
      (ex) => ex.id === currentExercise.id
    );

    // Check if there are any forward exercises with remaining series
    for (let i = currentIndex + 1; i < allBlockExercises.length; i++) {
      const exercise = allBlockExercises[i];
      if (
        !exercise.isSkipped &&
        exercise.extendedProgression &&
        exercise.extendedProgression.remainingSeries > 0
      ) {
        return true;
      }
    }
    return false;
  };

  // Find next forward exercise in series block after omission/postponing
  const getNextForwardExerciseInBlock = (
    currentExercise: ExtendedExercise,
    exercisesArray?: ExtendedExercise[]
  ) => {
    const block = getBlockInfo(currentExercise);
    if (!block || block.blockModel !== "series") return null;

    const exercisesToUse = exercisesArray || exercises;
    // Get ALL block exercises (including skipped ones) to find the correct position
    const allBlockExercises = getAllBlockExercises(
      currentExercise.blockId!,
      exercisesToUse
    );
    const currentIndex = allBlockExercises.findIndex(
      (ex) => ex.id === currentExercise.id
    );

    // Only look forward from the current position
    for (let i = currentIndex + 1; i < allBlockExercises.length; i++) {
      const exercise = allBlockExercises[i];
      if (
        !exercise.isSkipped &&
        exercise.extendedProgression &&
        exercise.extendedProgression.remainingSeries > 0
      ) {
        return exercise;
      }
    }
    return null; // No forward exercises available
  };

  // Find next backward exercise in series block after omission/postponing
  const getNextBackwardExerciseInBlock = (
    currentExercise: ExtendedExercise,
    exercisesArray?: ExtendedExercise[]
  ) => {
    const block = getBlockInfo(currentExercise);
    if (!block || block.blockModel !== "series") return null;

    const exercisesToUse = exercisesArray || exercises;
    // Get ALL block exercises (including skipped ones) to find the correct position
    const allBlockExercises = getAllBlockExercises(
      currentExercise.blockId!,
      exercisesToUse
    );
    const currentIndex = allBlockExercises.findIndex(
      (ex) => ex.id === currentExercise.id
    );

    // Only look backward from the current position
    for (let i = 0; i < currentIndex; i++) {
      const exercise = allBlockExercises[i];
      if (
        !exercise.isSkipped &&
        exercise.extendedProgression &&
        exercise.extendedProgression.remainingSeries > 0
      ) {
        return exercise;
      }
    }
    return null; // No backward exercises available
  };

  // Find next exercise in block for "series" blockModel
  const getNextExerciseInBlock = (
    currentExercise: ExtendedExercise,
    afterSeriesCompletion: boolean = false,
    exercisesArray?: ExtendedExercise[]
  ) => {
    const block = getBlockInfo(currentExercise);
    if (!block || block.blockModel !== "series") return null;

    const blockExercises = getBlockExercises(
      currentExercise.blockId!,
      exercisesArray
    );
    const currentIndex = blockExercises.findIndex(
      (ex) => ex.id === currentExercise.id
    );

    // Try to find next exercise after current one
    for (let i = currentIndex + 1; i < blockExercises.length; i++) {
      const exercise = blockExercises[i];
      if (
        exercise.extendedProgression &&
        exercise.extendedProgression.remainingSeries > 0
      ) {
        return exercise;
      }
    }

    // If no next exercise with remaining series, try from the beginning (cycle back)
    for (let i = 0; i < currentIndex; i++) {
      const exercise = blockExercises[i];
      if (exercise.extendedProgression) {
        const remainingSeriesAfterCompletion =
          afterSeriesCompletion && exercise.id === currentExercise.id
            ? exercise.extendedProgression.remainingSeries - 1
            : exercise.extendedProgression.remainingSeries;

        if (remainingSeriesAfterCompletion > 0) {
          return exercise;
        }
      }
    }

    return null; // No available exercises with remaining series in block
  };

  // Create exercise performance data
  const createExercisePerformanceData = (
    exercise: ExtendedExercise,
    completed: boolean,
    performed: boolean
  ): ExercisePerformanceData => ({
    selectedExerciseId: exercise.id,
    exerciseName: exercise.name,
    completed,
    performed,
  });

  // Handle series completion logic
  const handleSeriesCompletion = (
    currentExercise: ExtendedExercise,
    shouldPerform: boolean,
    newSessionResult?: SessionPerformanceData
  ) => {
    const block = getBlockInfo(currentExercise);
    const shouldNavigateToNext = block && block.blockModel === "series";
    let nextExercise = null;

    if (shouldNavigateToNext) {
      nextExercise = getNextExerciseInBlock(currentExercise, true);
    }

    const currentProgression = currentExercise.extendedProgression;
    if (currentProgression && currentProgression.remainingSeries > 1) {
      // Still has series remaining
      setExercises((prev) =>
        prev.map((ex, idx) =>
          idx === activeIndex && ex.extendedProgression
            ? {
                ...ex,
                extendedProgression: {
                  ...ex.extendedProgression,
                  remainingSeries: ex.extendedProgression.remainingSeries - 1,
                },
              }
            : ex
        )
      );

      // Start rest timer if exercise was performed
      if (shouldPerform) {
        startTimer(currentExercise.restTime);
      }

      // Navigate to next exercise in series block
      if (shouldNavigateToNext && nextExercise) {
        setTimeout(() => {
          navigateToExercise(nextExercise);
        }, 100);
      }
    } else {
      // Last series - first decrement to 0, then check for next exercise

      // Create updated exercises array with current exercise's remaining series set to 0
      const updatedExercises = exercises.map((ex, idx) =>
        idx === activeIndex && ex.extendedProgression
          ? {
              ...ex,
              extendedProgression: {
                ...ex.extendedProgression,
                remainingSeries: 0,
              },
            }
          : ex
      );

      // Update state
      setExercises(updatedExercises);

      if (shouldNavigateToNext && currentExercise.blockId) {
        // Check if there are other available exercises in the series block using updated array
        // First try forward exercises, then backward
        if (hasForwardExercisesInBlock(currentExercise, updatedExercises)) {
          const nextExercise = getNextForwardExerciseInBlock(
            currentExercise,
            updatedExercises
          );
          if (nextExercise) {
            if (shouldPerform) {
              startTimer(currentExercise.restTime);
              setTimeout(() => navigateToExercise(nextExercise), 100);
            } else {
              navigateToExercise(nextExercise);
            }
            return;
          }
        }
        // Only if no forward exercises, check if there are backward exercises available
        else if (
          hasAvailableExercisesInBlock(
            currentExercise.blockId,
            currentExercise.id,
            updatedExercises
          )
        ) {
          const nextExercise = getNextBackwardExerciseInBlock(
            currentExercise,
            updatedExercises
          );
          if (nextExercise) {
            if (shouldPerform) {
              startTimer(currentExercise.restTime);
              setTimeout(() => navigateToExercise(nextExercise), 100);
            } else {
              navigateToExercise(nextExercise);
            }
            return;
          }
        }
      }

      // No more exercises in series block, move to next exercise outside block
      if (shouldPerform) {
        startTimer(currentExercise.restTime);
        setTimeout(() => moveToNextExercise(newSessionResult), 100);
      } else {
        moveToNextExercise(newSessionResult);
      }
    }
  };

  // Navigate to specific exercise
  const navigateToExercise = (targetExercise: ExtendedExercise) => {
    const targetIndex = exercises.findIndex(
      (ex) => ex.id === targetExercise.id
    );
    if (targetIndex !== -1) {
      flatListRef.current?.scrollToIndex(targetIndex, true);
    }
  };

  const finishWorkout = (newSessionResult: SessionPerformanceData) => {
    stopTimer();
    saveSessionPerformance(
      athleteData.id,
      newSessionResult,
      exercises.filter((ex) => !ex.isSkipped && !ex.isPostponed)
    );
    router.replace(
      `success?completedExercises=${newSessionResult?.completedExercises}/${exercisesN}&performance=${newSessionResult?.performance}/${newSessionResult?.completedExercises}` as RelativePathString
    );
  };

  const postponeCurrentExercise = () => {
    const currentExercise = exercises[activeIndex];

    // Create a copy of the exercise for the end, without blockId but keeping the progression
    const postponedExercise: ExtendedExercise = {
      ...currentExercise,
      key: `${currentExercise.key}-postponed-${Date.now()}`, // Unique key for postponed exercise
      blockId: "", // Remove blockId as requested
      isSkipped: false, // Reset skip status for the postponed version
      extendedProgression: currentExercise.extendedProgression
        ? {
            ...currentExercise.extendedProgression,
            key: `${
              currentExercise.extendedProgression.key
            }-postponed-${Date.now()}`,
            // Preserve current remaining series count
          }
        : undefined,
    };

    // Mark current exercise as skipped (like omission) and add new one to the end
    const updatedExercises = exercises.map((ex, index) =>
      index === activeIndex ? { ...ex, isSkipped: true } : ex
    );
    updatedExercises.push(postponedExercise); // Add postponed exercise to end

    setExercises(updatedExercises);

    // Check if we're in a series block and need to stay within it
    if (currentExercise?.blockId) {
      const block = getBlockInfo(currentExercise);
      if (block && block.blockModel === "series") {
        // First, check if there are forward exercises available (prioritize forward movement)
        if (hasForwardExercisesInBlock(currentExercise, updatedExercises)) {
          const nextExercise = getNextForwardExerciseInBlock(
            currentExercise,
            updatedExercises
          );
          if (nextExercise) {
            // Find the index of the next exercise in the updated exercises array
            const nextIndex = updatedExercises.findIndex(
              (ex) => ex.id === nextExercise.id
            );
            if (nextIndex !== -1) {
              setTimeout(() => {
                setActiveIndex(nextIndex);
                flatListRef.current?.scrollToIndex(nextIndex, true);
              }, 100);
              return;
            }
          }
        }
        // Only if no forward exercises, check if there are backward exercises available
        else if (
          hasAvailableExercisesInBlock(
            currentExercise.blockId,
            currentExercise.id,
            updatedExercises
          )
        ) {
          const nextExercise = getNextBackwardExerciseInBlock(
            currentExercise,
            updatedExercises
          );
          if (nextExercise) {
            // Find the index of the next exercise in the updated exercises array
            const nextIndex = updatedExercises.findIndex(
              (ex) => ex.id === nextExercise.id
            );
            if (nextIndex !== -1) {
              setTimeout(() => {
                setActiveIndex(nextIndex);
                flatListRef.current?.scrollToIndex(nextIndex, true);
              }, 100);
              return;
            }
          }
        }
      }
    }

    // Move to next exercise (like omission does)
    moveToNextExercise(undefined, updatedExercises);
  };

  const moveToNextExercise = (
    newSessionResult?: SessionPerformanceData,
    updatedExercises?: ExtendedExercise[]
  ) => {
    const exercisesToUse = updatedExercises || exercises;
    const remainingExercises = exercisesToUse.filter(
      (_, index) => index > activeIndex
    );

    if (
      remainingExercises.length === 0 ||
      remainingExercises.every((ex) => ex.isSkipped)
    ) {
      // Last exercise, finish workout
      finishWorkout(newSessionResult || sessionResult);
      return;
    }

    // Move to next exercise
    const offset =
      remainingExercises.findIndex((ex) => !ex.isSkipped) > 0
        ? remainingExercises.findIndex((ex) => !ex.isSkipped)
        : 0;
    const nextIndex = activeIndex + offset + 1;
    setActiveIndex(nextIndex);
    flatListRef.current?.scrollToIndex(nextIndex, true);
  };

  const renderExercise = (item: CustomFlatlistItem) => {
    const exercise = item as ExtendedExercise;

    // Don't render if no progression is found
    if (!exercise.extendedProgression) {
      return null;
    }

    return (
      <ExerciseDisplay
        exercise={exercise}
        progression={exercise.extendedProgression}
        isTimerActive={isTimerActive}
        timerSeconds={timerSeconds}
      />
    );
  };

  const handleOutlinedPress = () => {
    if (!currentAction) {
      setCurrentAction("skip");
      return;
    }

    // Track exercise performance data - series not completed
    const exercisePerformanceData = createExercisePerformanceData(
      currentExercise || exercises[0],
      currentAction === "next",
      false
    );

    setSessionResult((prev) => ({
      ...prev,
      exercisePerformanceData: [
        ...prev.exercisePerformanceData,
        exercisePerformanceData,
      ],
    }));

    if (currentAction === "next") {
      // "No esta vez" - decrement series but don't perform
      handleSeriesCompletion(currentExercise || exercises[0], false);
    } else {
      // "Omitir" - skip entire exercise
      const currentExercise = exercises[activeIndex];

      const updatedExercises = exercises.map((ex, index) =>
        index === activeIndex ? { ...ex, isSkipped: true } : ex
      );
      setExercises(updatedExercises);

      // Check if we're in a series block and need to stay within it
      if (currentExercise?.blockId) {
        const block = getBlockInfo(currentExercise);
        if (block && block.blockModel === "series") {
          // First, check if there are forward exercises available (prioritize forward movement)
          if (hasForwardExercisesInBlock(currentExercise, updatedExercises)) {
            const nextExercise = getNextForwardExerciseInBlock(
              currentExercise,
              updatedExercises
            );
            if (nextExercise) {
              // Find the index of the next exercise in the updated exercises array
              const nextIndex = updatedExercises.findIndex(
                (ex) => ex.id === nextExercise.id
              );
              if (nextIndex !== -1) {
                setTimeout(() => {
                  setActiveIndex(nextIndex);
                  flatListRef.current?.scrollToIndex(nextIndex, true);
                }, 100);
                setCurrentAction("");
                stopTimer();
                return;
              }
            }
          }
          // Only if no forward exercises, check if there are backward exercises available
          else if (
            hasAvailableExercisesInBlock(
              currentExercise.blockId,
              currentExercise.id,
              updatedExercises
            )
          ) {
            const nextExercise = getNextBackwardExerciseInBlock(
              currentExercise,
              updatedExercises
            );
            if (nextExercise) {
              // Find the index of the next exercise in the updated exercises array
              const nextIndex = updatedExercises.findIndex(
                (ex) => ex.id === nextExercise.id
              );
              if (nextIndex !== -1) {
                setTimeout(() => {
                  setActiveIndex(nextIndex);
                  flatListRef.current?.scrollToIndex(nextIndex, true);
                }, 100);
                setCurrentAction("");
                stopTimer();
                return;
              }
            }
          }
        }
      }

      moveToNextExercise(undefined, updatedExercises);
    }

    setCurrentAction("");
    stopTimer();
  };

  const handleTonalPress = () => {
    if (!currentAction) {
      setCurrentAction("next");
      setSessionResult((prev) => ({
        ...prev,
        completedExercises: prev.completedExercises + 1,
      }));
      return;
    }

    if (currentAction === "next") {
      // "Sí pude" - series completed successfully
      const exercisePerformanceData = createExercisePerformanceData(
        currentExercise || exercises[0],
        true,
        true
      );
      const newSessionResult = {
        ...sessionResult,
        performance: sessionResult.performance + 1,
        exercisePerformanceData: [
          ...sessionResult.exercisePerformanceData,
          exercisePerformanceData,
        ],
      };
      setExercises((prev) =>
        prev.map((ex, idx) =>
          idx === activeIndex && ex.extendedProgression
            ? {
                ...ex,
                extendedProgression: {
                  ...ex.extendedProgression,
                  completed: true,
                },
              }
            : ex
        )
      );

      setSessionResult(newSessionResult);
      handleSeriesCompletion(
        currentExercise || exercises[0],
        true,
        newSessionResult
      );
    } else {
      // "Posponer" - move exercise to end of array and continue
      postponeCurrentExercise();
    }

    setCurrentAction("");
  };

  useEffect(() => {
    if (
      !athleteData.currentTrainingPlan ||
      !athleteData.currentTrainingPlan.sessions
    )
      return;

    if (!relevantSession) return;

    const exercisesArray = getExercisesArray(relevantSession.exercises);
    const totalExercises = exercisesArray.reduce(
      (acc, exercise) => acc + exercise.series,
      0
    );
    setExercisesN(totalExercises);

    // Add extended properties to each exercise with embedded progressions
    const exercisesWithExtras: ExtendedExercise[] = exercisesArray.map(
      (exercise, index) => {
        const progression = getCurrentProgression(exercise);
        const extendedProgression: ExtendedProgression | undefined = progression
          ? {
              ...progression,
              key: index.toString(),
              remainingSeries: exercise.series,
              isSkipped: false,
            }
          : undefined;

        return {
          ...exercise,
          key: index.toString(),
          extendedProgression,
        };
      }
    );

    setExercises(exercisesWithExtras);

    if (exercisesWithExtras[0]?.blockId) {
      const block = relevantSession?.exercises.find(
        (exercise) => exercise.id === exercisesWithExtras[0].blockId
      );
      if (!block || block.type === "selectedExercise") return;
      const blockName = `${block.name} ${
        block.blockModel === "series" ? " - En Serie" : ""
      }`;
      setCurrentBlockName(blockName);
    }
  }, []);

  useEffect(() => {
    if (exercises.length === 0) return;
    const currentExercise = exercises[activeIndex] || exercises[0];
    if (currentExercise?.blockId) {
      const block = relevantSession?.exercises.find(
        (exercise) => exercise.id === currentExercise.blockId
      );
      if (!block || block.type === "selectedExercise") return;
      const blockName = `${block.name} ${
        block.blockModel === "series" ? " - En Serie" : ""
      }`;
      setCurrentBlockName(blockName);
    } else {
      setCurrentBlockName("");
    }
  }, [activeIndex, exercises, relevantSession]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  return (
    <ScrollView className="mt-4">
      <View className="pl-4">
        <Text className="font-pregular text-h3 mb-4">
          {relevantSession?.name}
          {currentBlockName && (
            <>
              {" - "}
              <Text className="text-secondary">{currentBlockName}</Text>
            </>
          )}
        </Text>
        <CustomFlatlist
          ref={flatListRef}
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
          indicatorPostponedColor="#FFC1C1"
          doExercises={doExercisesBoolean}
        />
        {currentAction === "next" && (
          <Text className="self-center text-sm font-pregular mt-6">
            Pudiste hacer {currentProgression?.repetitions} repeticiones
            {currentProgression?.weight
              ? `con ${currentProgression?.weight}kg`
              : "?"}
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
                      ? "close"
                      : "skip-next"
                    : "fast-forward"
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
                icon={currentAction === "skip" ? "skip-next" : "check"}
                containerStyles="w-[40%]"
                onPress={handleTonalPress}
              />
            </>
          ) : (
            <>
              <OutlinedButton
                title="Volver"
                icon="arrow-left"
                containerStyles="w-[40%]"
                inverse
                onPress={() => router.back()}
              />
              <TonalButton
                title="Entrenar"
                customIcon="dumbbell"
                containerStyles="w-[40%]"
                onPress={() =>
                  router.replace(
                    `prePoll?sessionId=${sessionId}` as RelativePathString
                  )
                }
              />
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ViewPlan;
