import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const ExerciseDisplay = ({ exerciseName, instructions }) => {
  return (
    <View className="self-center shadow-sm bg-white rounded-2xl w-[90vw]">
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
      <View className="self-center mt-8 mb-8 rounded-2xl bg-gray w-[90%] h-40"></View>
    </View>
  );
};

export default ExerciseDisplay;
