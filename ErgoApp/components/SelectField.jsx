import { View, Text, Image } from "react-native";
import React, { useContext, useState } from "react";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import icons from "../scripts/icons.js";
import UserContext from "../contexts/UserContext.jsx";
import { router } from "expo-router";

const SelectField = ({ title, options, displayTitle }) => {
  const { user, setUser } = useContext(UserContext);

  const onPress = () => {
    router.push({
      pathname: "/choice",
      params: { options: options, title: title },
    });
  };

  return (
    <View className={`space-y-2 w-full mt-8`}>
      <TouchableOpacity
        className="w-full h-16 px-4 bg-white rounded-2xl flex-row justify-between pl-4 pr-4 items-center shadow-sm"
        onPress={onPress}
      >
        <Text className="flex-1 text-black font-pregular text-base ">
          {displayTitle}
        </Text>
        <View className="h-full flex flex-row items-center">
          <Text className="text-secondary font-plight mr-2">{user[title]}</Text>
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
