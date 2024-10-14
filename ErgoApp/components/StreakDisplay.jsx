import { View, Text, Image } from "react-native";
import React from "react";
import icons from "../scripts/icons";

const StreakDisplay = () => {
  return (
    <View className="w-[80%] self-center h-40 bg-white rounded-xl flex flex-row">
      {/* <View className="w-1/2 h-full">
        <Image resizeMode="contain" source={icons.fire}></Image>
      </View> */}
      <View className="flex flex-row gap-5">
        <Text className="text-md">Hola Aníbal</Text>
        <Image resizeMode="contain"></Image>
      </View>
    </View>
  );
};

export default StreakDisplay;
