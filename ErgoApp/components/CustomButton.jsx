import { View, Text, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import icons from "../scripts/icons";
import Icon from "./Icon";

const CustomButton = ({
  title,
  onPress,
  containerStyles,
  textStyles,
  isLoading,
  provider,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`rounded-2xl min-h-[40px] justify-evenly items-center shadow-sm flex flex-row w-[200px] ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }  `}
      disabled={isLoading}
    >
      <Text className={`text-primary font-pmedium text-16 ${textStyles}`}>
        {title}
      </Text>
      {provider && (
        <Image
          source={icons.google}
          resizeMode="contain"
          className="w-10 h-10"
        ></Image>
      )}
      {icon && <Icon icon={icon} />}
    </TouchableOpacity>
  );
};

export default CustomButton;
