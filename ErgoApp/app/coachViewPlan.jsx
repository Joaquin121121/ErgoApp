import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState, useRef, useContext } from "react";
import ExerciseDisplay from "../components/ExerciseDisplay";
import CustomFlatlist from "../components/CustomFlatlist";
import { router, useLocalSearchParams } from "expo-router";
import OutlinedButton from "../components/OutlinedButton";
import TonalButton from "../components/TonalButton";
import CurrentClassContext from "../contexts/CurrentClassContext";

const coachViewPlan = () => {
  const { action } = useLocalSearchParams();
  const [coachMode, setCoachMode] = useState(false);
  const scrollViewRef = useRef(null);

  const { exercises, activeIndex, setActiveIndex, reset } =
    useContext(CurrentClassContext);

  useEffect(() => {
    reset();
    setCoachMode(action === "doExercises");
  }, []);

  useEffect(() => {
    if (exercises.length === 0) {
      router.replace("coachHome");
    }
  }, [exercises]);

  const renderExercise = (item) => (
    <ExerciseDisplay
      exerciseName={item.name}
      instructions={item.instructions}
      coachMode={coachMode}
    />
  );

  return (
    <ScrollView ref={scrollViewRef} className="mt-4">
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
      </View>
      <OutlinedButton
        containerStyles="self-center mt-8 w-[60vw]"
        title="Ver Resumen"
        onPress={() => router.push("planSummary")}
        icon="plan"
      />
      <TonalButton
        title="Continuar"
        icon="next"
        containerStyles="self-center mt-4 w-[60vw] mb-12"
        onPress={() => router.replace("coachHome")}
      />
    </ScrollView>
  );
};

export default coachViewPlan;
