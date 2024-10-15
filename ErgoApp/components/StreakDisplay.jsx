import { View, Text, Image } from "react-native";
import React from "react";
import icons from "../scripts/icons";

const StreakDisplay = ({ gamificationFeatures }) => {
  return (
    <View className="shadow-sm w-80 self-center h-40 bg-white rounded-xl flex flex-row items-end pb-8 mr-12 ml-12">
      <Image
        resizeMode="stretch"
        source={icons.fire}
        className="h-28 w-1/4 ml-4 "
      ></Image>
      <Text className="text-fire text-streak font-psemibold ml-8">
        {gamificationFeatures.streak || 0}
      </Text>
      <Text className="ml-4 flex flex-1 pb-4 text-darkGray font-pregular">
        entrenamientos seguidos
      </Text>
    </View>
  );
};

export default StreakDisplay;
