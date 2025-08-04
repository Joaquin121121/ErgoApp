import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  iconSize = 24,
  inverse,
  iconColor,
  customIcon,
}: {
  title: string;
  onPress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  provider?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconSize?: number;
  inverse?: boolean;
  iconColor?: string;
  customIcon?: keyof typeof icons;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`rounded-2xl min-h-[40px] justify-evenly items-center shadow-sm flex flex-row  w-[200px] ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }  `}
      disabled={isLoading}
    >
      {inverse ? (
        <>
          {provider && <Icon icon="google" size={40} />}
          {customIcon ? (
            <Icon icon={customIcon} size={40} />
          ) : icon ? (
            <MaterialCommunityIcons
              name={icon}
              size={iconSize}
              color={iconColor}
            />
          ) : null}
          <Text className={`text-primary font-pmedium text-16 ${textStyles}`}>
            {title}
          </Text>
        </>
      ) : (
        <>
          <Text className={`text-primary font-pmedium text-16 ${textStyles}`}>
            {title}
          </Text>
          {provider && <Icon icon="google" size={40} />}
          {customIcon ? (
            <Icon icon={customIcon} />
          ) : icon ? (
            <MaterialCommunityIcons
              name={`${icon}`}
              size={iconSize}
              color={iconColor}
            />
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
