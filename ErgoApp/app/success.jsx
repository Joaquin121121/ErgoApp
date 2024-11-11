import { View, Text, ScrollView, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import Icon from "../components/Icon";
import { router, useLocalSearchParams } from "expo-router";
import TonalButton from "../components/TonalButton";
import { fractionToPercentage } from "../scripts/utils";

const Success = () => {
  const { completedExercises, improvedExercises } = useLocalSearchParams();

  // Create animated value refs for each section
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const fadeAnim4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence the animations back-to-back
    Animated.sequence([
      // First group: title, confetti, and animation
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Second group: blue card
      Animated.timing(fadeAnim2, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Third group: green card
      Animated.timing(fadeAnim3, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Fourth group: button
      Animated.timing(fadeAnim4, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView className="mt-4">
      <Animated.View style={{ opacity: fadeAnim1 }}>
        <View className="self-center flex flex-row items-center">
          <Text className="text-[32px] font-pregular mr-2">
            Felicitaciones !!
          </Text>
          <Icon icon="confetti" size={32} />
        </View>
        <Text className="mt-4 text-secondary text-2xl font-pregular self-center">
          Sesion completada
        </Text>
        <View className="mt-6 flex justify-center bg-gray rounded-2xl self-center w-3/4 h-40">
          <Text className="font-pregular text-2xl self-center">Animación</Text>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim2 }}>
        <View className="shadow-sm self-center mt-6 border-blue border-2 border-t-[10px] h-28 w-3/4 rounded-2xl flex flex-row justify-around items-center">
          <Text className="text-[32px] text-blue font-psemibold">
            {fractionToPercentage(
              parseInt(completedExercises[0]),
              parseInt(completedExercises[2])
            )}
          </Text>
          <Text className="text-blue text-sm font-psemibold">
            Ejercicios completados
          </Text>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim3 }}>
        <View className="shadow-sm self-center mt-4 border-green border-2 border-t-[10px] h-28 w-3/4 rounded-2xl flex flex-row justify-around items-center">
          <Text className="text-[32px] text-green font-psemibold">
            {fractionToPercentage(
              parseInt(improvedExercises[0]),
              parseInt(improvedExercises[2])
            )}
          </Text>
          <Text className="text-green text-sm font-psemibold">
            Ejercicios con progreso
          </Text>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim4 }}>
        <TonalButton
          containerStyles="mt-6 self-center"
          icon="checkWhite"
          title="Continuar"
          onPress={() => {
            router.replace("myStats");
          }}
        ></TonalButton>
      </Animated.View>
    </ScrollView>
  );
};

export default Success;
