import { View, Text, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import icons from "../scripts/icons";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  provider,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`rounded-xl min-h-[55px] justify-center items-center shadow-sm ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
      {provider && (
        <Image
          source={icons.google}
          resizeMode="contain"
          className="w-10 h-10 ml-10"
        ></Image>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
