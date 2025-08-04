import {
  View,
  Text,
  ScrollView,
  Animated,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useRef } from "react";
import Icon from "../components/Icon";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import TonalButton from "../components/TonalButton";
import ItemCard from "../components/ItemCard";
import { fractionToPercentage } from "../scripts/utils";
import { VideoView, useVideoPlayer } from "expo-video";

const Success = () => {
  const { completedExercises, performance } = useLocalSearchParams();
  const [completedExercisesNumber, totalExercisesNumber] = completedExercises
    .toString()
    .split("/")
    .slice(0, 2);
  const [performanceNumber] = performance.toString().split("/");
  console.log("completedExercisesNumber", completedExercisesNumber);
  console.log("totalExercisesNumber", totalExercisesNumber);
  console.log("performanceNumber", performanceNumber);
  console.log("completedExercises", completedExercises);
  console.log("performance", performance);
  const { width: screenWidth } = useWindowDimensions();

  const videoSource =
    "https://github.com/Joaquin121121/ErgoCharacters/raw/refs/heads/main/musculoso%20lo%20logra.mp4";

  const player = useVideoPlayer(videoSource, (player) => {
    player.play();
  });

  // Video dimensions for 1080x1920 aspect ratio
  // Aspect ratio = 1080/1920 = 0.5625
  const videoWidth = screenWidth;
  const videoHeight = screenWidth * (1080 / 1920); // Maintain aspect ratio

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
    <ScrollView className="mt-4 bg-white">
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

        <VideoView
          player={player}
          style={{
            width: videoWidth,
            height: videoHeight,
            pointerEvents: "none",
          }}
        />
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim2 }}>
        <ItemCard
          percentage={fractionToPercentage(
            parseInt(completedExercisesNumber),
            parseInt(totalExercisesNumber)
          )}
          label="Ejercicios completados"
          color="blue"
        />
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim3 }}>
        <ItemCard
          percentage={fractionToPercentage(
            parseInt(performanceNumber),
            parseInt(completedExercisesNumber)
          )}
          label="Ejercicios con progreso"
          color="green"
        />
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim4 }}>
        <TonalButton
          containerStyles="mt-6 self-center"
          icon="check"
          title="Continuar"
          onPress={() => {
            router.replace("myStats" as RelativePathString);
          }}
        ></TonalButton>
      </Animated.View>
    </ScrollView>
  );
};

export default Success;
