import { View, Text, TextInput } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CoachContext from "../contexts/CoachContext";
import { TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import Icon from "./Icon";

const Movement = ({ index }) => {
  const { currentStudyData, setCurrentStudyData } = useContext(CoachContext);

  const [score, setScore] = useState(5);

  const movement = currentStudyData.movements[index];

  useEffect(() => {
    setCurrentStudyData({
      ...currentStudyData,
      movements: currentStudyData.movements.map((e, i) =>
        i === index ? { ...e, score: score } : e
      ),
    });
  }, [score]);

  return (
    <View className="shadow-sm w-[85vw] self-center bg-white rounded-2xl mt-2">
      <Text className="text-2xl font-pregular mt-8 self-center mb-8">
        {movement.name}
      </Text>
      <View className="flex justify-between h-[240] px-4">
        {movement.parameters.map((parameter) => (
          <View className="flex-row items-center">
            <Icon icon={parameter.character === "good" ? "check" : "close"} />
            <Text className="text-plight text-16  text-tertiary ml-4 pr-4">
              {parameter.description}
            </Text>
          </View>
        ))}
      </View>
      <View className="flex items-center self-center">
        <Text className="text-xl font-pregular text-tertiary mb-1 mt-8">
          Puntuación: <Text className=" text-secondary">{score}</Text>
        </Text>
        <Slider
          minimumValue={1}
          maximumValue={10}
          step={1}
          style={{ width: 250, height: 16, marginBottom: 20 }}
          maximumTrackTintColor="#FFC1C1"
          minimumTrackTintColor="#E81D23"
          value={score}
          onValueChange={(value) => setScore(value)}
        />
      </View>
    </View>
  );
};

export default Movement;
