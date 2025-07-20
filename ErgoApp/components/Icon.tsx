import { View, Text, Image } from "react-native";
import React from "react";
import icons from "../scripts/icons";

const Icon = ({
  icon,
  size,
  style,
}: {
  icon: keyof typeof icons;
  size: number;
  style?: any;
}) => {
  const iconSize = size || 24; // Default size if not provided
  return (
    <Image
      style={{ ...style, height: iconSize, width: iconSize }}
      resizeMode="contain"
      source={icons[icon as keyof typeof icons]}
    />
  );
};

export default Icon;
