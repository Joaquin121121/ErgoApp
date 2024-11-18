import { View, Text, Image } from "react-native";
import React, { useContext, useState } from "react";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import icons from "../scripts/icons.js";
import UserContext from "../contexts/UserContext.jsx";
import { router } from "expo-router";
import ClassContext from "../contexts/ClassContext";

const SelectField = ({
  title,
  options,
  displayTitle,
  context = "user",
  containerStyles,
}) => {
  const { user, setUser } = useContext(UserContext);
  const { classInfo, setClassInfo } = useContext(ClassContext);

  const contexts = {
    user: { get: user, set: setUser },
    class: { get: classInfo, set: setClassInfo },
  };

  const onPress = () => {
    router.push({
      pathname: "/choice",
      params: { options: options, title: title, context: context },
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
            {contexts[context].get[title]}
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
