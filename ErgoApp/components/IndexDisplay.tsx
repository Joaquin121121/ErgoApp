import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { router } from "expo-router";
import { useUser } from "../contexts/UserContext";
import { Athlete } from "../types/Athletes";
import { calculatePercentageDifference } from "../utils/utils";

const IndexDisplay = ({
  name,
  currentValue,
  percentageDiff,
  onPress,
}: {
  name: string;
  currentValue: number;
  percentageDiff?: number;
  onPress?: () => void;
}) => {
  const { userData } = useUser();
  const athleteData = userData as Athlete;

  // Calculate the percentage difference display only if percentageDiff is provided
  const diffResult =
    percentageDiff !== undefined
      ? calculatePercentageDifference(
          currentValue - percentageDiff,
          currentValue
        )
      : null;

  // Format the current value for display (rounded to nearest decimal)
  const displayValue = Math.round(currentValue * 10) / 10;

  // Render the indicator (icon + percentage) only if percentageDiff is provided
  const renderIndicator = () => {
    if (!diffResult || !diffResult.content) return null;

    return (
      <View className="flex flex-row items-center">
        <Text style={{ color: diffResult.iconColor }} className="text-xs ">
          {diffResult.icon}
        </Text>
        <Text style={{ color: diffResult.iconColor }} className="text-xs">
          {diffResult.content}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View className=" h-16 rounded-2xl w-36 bg-offWhite pl-6 pr-4 flex justify-evenly">
        <Text className="text-16 text-tertiary font-plight ">{name}</Text>
        <View className="flex flex-row items-center gap-x-2">
          <Text className="font-pmedium text-xl">{displayValue}</Text>
          {renderIndicator()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default IndexDisplay;
