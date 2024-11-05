import { View, Text, Image } from "react-native";
import React from "react";
import icons from "../scripts/icons";

const Icon = ({ icon, size, style }) => {
  const iconSize = size || 24; // Default size if not provided
  return (
    <Image
      style={{ ...style, height: iconSize, width: iconSize }}
      resizeMode="contain"
      source={icons[icon]}
    />
  );
};

export default Icon;
