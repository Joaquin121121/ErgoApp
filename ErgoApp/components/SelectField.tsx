import { View, Text, Image } from "react-native";
import React, { useContext, useState } from "react";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import icons from "../scripts/icons.js";
import { router, RelativePathString } from "expo-router";
import { useUser } from "../contexts/UserContext";
import type { User } from "../types/User";
import { Athlete } from "../types/Athletes.js";
import { Coach } from "../types/Coach.js";
import { getPropertyValue } from "../utils/utils";

const SelectField = ({
  title,
  category,
  displayTitle,
  context = "user",
  containerStyles,
  action = "choice",
}: {
  title: string;
  category: string;
  displayTitle: string;
  context?: string;
  containerStyles?: string;
  action?: string;
}) => {
  const { userData, setUserData } = useUser();

  const contexts: Record<
    string,
    {
      get: Athlete | Coach | null;
      set: React.Dispatch<React.SetStateAction<Athlete | Coach | null>>;
    }
  > = {
    user: { get: userData, set: setUserData },
  };

  const onPress = () => {
    router.push({
      pathname: `/${action}` as RelativePathString,
      params: { category: category, title: title, context: context },
    });
  };

  return (
    <View className={`space-y-2 w-full mt-1`}>
      <TouchableOpacity
        className={`w-full h-12 px-4 bg-white rounded-2xl flex-row justify-between pl-4 pr-4 items-center shadow-sm ${containerStyles}`}
        onPress={onPress}
      >
        <Text className="flex-1 text-darkGray font-plight text-base ">
          {displayTitle}
        </Text>
        <View className="h-full flex flex-row items-center">
          <Text className="text-secondary font-plight mr-2">
            {getPropertyValue(contexts[context].get, title)}
          </Text>
          <Image
            source={icons.rightArrow}
            resizeMode="contain"
            className="h-6 w-6"
          ></Image>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default SelectField;
