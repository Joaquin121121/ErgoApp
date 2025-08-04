import { View, Text, Image } from "react-native";
import React from "react";
import icons from "../../../scripts/icons";
import { useUser } from "../../../contexts/UserContext";
import { Athlete } from "../../../types/Athletes";

const StreakDisplay = () => {
  const { userData } = useUser();
  const athleteData = userData as Athlete;

  // Fetch streak data from athlete data
  const streak = athleteData?.streak || 0;

  return (
    <View className="shadow-sm w-[85vw] self-center h-40 bg-white rounded-2xl flex flex-row items-end pb-8 ">
      <Image
        resizeMode="stretch"
        source={icons.fire}
        className="h-28 w-1/4 ml-4 "
      ></Image>
      <Text className="text-fire text-streak font-psemibold ml-8">
        {streak}
      </Text>
      <Text className="ml-2 flex flex-1 pb-4 text-fire font-pregular">
        días consecutivos
      </Text>
    </View>
  );
};

export default StreakDisplay;
