import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { getColor } from "../constants/Colors";
import { WellnessType } from "../constants/wellnessColors";
import { useUser } from "../contexts/UserContext";
import { Athlete } from "../types/Athletes";
import { wellnessTranslations } from "../constants/wellnessColors";
import { calculatePercentageDifference } from "../utils/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomAreaChart from "./CustomAreaChart";

const WellnessDisplay = ({ section }: { section: WellnessType }) => {
  const { userData } = useUser();
  const athleteData = userData as Athlete;

  const color = getColor(section);

  const wellnessData = athleteData.wellnessData?.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const iconsMap: Record<
    WellnessType,
    keyof typeof MaterialCommunityIcons.glyphMap
  > = {
    nutrition: "silverware-fork-knife",
    sleep: "moon-waning-crescent",
    fatigue: "speedometer",
  };

  // Fallback data when no wellness data is available
  const getFallbackValue = (section: WellnessType): number => {
    switch (section) {
      case "nutrition":
      case "sleep":
        return 7;
      case "fatigue":
        return 3;
      default:
        return 5; // Default fallback for any other wellness types
    }
  };

  // Define valid ranges for each wellness type
  const getWellnessRange = (
    section: WellnessType
  ): { min: number; max: number } => {
    switch (section) {
      case "nutrition":
      case "sleep":
        return { min: 1, max: 10 };
      case "fatigue":
        return { min: 1, max: 10 };
      default:
        return { min: 1, max: 10 };
    }
  };

  // Clamp values to valid range
  const clampValue = (value: number, section: WellnessType): number => {
    const { min, max } = getWellnessRange(section);
    return Math.max(min, Math.min(max, value));
  };

  const wellnessDataValues =
    wellnessData && wellnessData.length > 0
      ? wellnessData.map((data) => clampValue(data[section], section))
      : [getFallbackValue(section)];

  if (wellnessDataValues.length < 2) {
    // Only one data point available, show current value without percentage difference
    const currentValue = wellnessDataValues[wellnessDataValues.length - 1];

    return (
      <View className="shadow-sm w-[85vw] self-center h-40 bg-white rounded-2xl flex flex-row items-center  ">
        <View className="flex items-center w-2/5">
          <MaterialCommunityIcons
            name={iconsMap[section]}
            size={48}
            color={color}
          />
          <Text
            className="text-2xl font-pmedium mt-2"
            style={{ color: getColor(section) }}
          >
            {wellnessTranslations[section]}
          </Text>
          <View className="flex flex-row items-center justify-center">
            <Text className="text-2xl font-pmedium mr-2">{currentValue}</Text>
          </View>
        </View>
      </View>
    );
  }

  // Get the range for this wellness type
  const { min: yMin, max: yMax } = getWellnessRange(section);

  // Prepare chart data by clamping values to valid range
  const chartData = wellnessDataValues.map((value) =>
    clampValue(value, section)
  );

  const currentValue = wellnessDataValues[wellnessDataValues.length - 1]; // Most recent value
  const previousValue = wellnessDataValues[wellnessDataValues.length - 2]; // Second most recent value

  // Calculate the percentage difference display
  const diffResult = calculatePercentageDifference(previousValue, currentValue);

  // Render the indicator (icon + percentage) only if there's content to display
  const renderIndicator = () => {
    if (!diffResult || !diffResult.content) return null;

    return (
      <View className="flex flex-row items-center">
        <Text className="text-sm font-plight " style={{ color }}>
          {diffResult.icon}
        </Text>
        <Text className="text-sm font-plight" style={{ color }}>
          {diffResult.content}
        </Text>
      </View>
    );
  };

  useEffect(() => {
    console.log("wellnessData", wellnessData);
  }, [wellnessData]);

  return (
    <View className="shadow-sm w-[85vw] self-center h-40 bg-white rounded-2xl flex flex-row items-center  ">
      <View className="flex items-center w-2/5">
        <MaterialCommunityIcons
          name={iconsMap[section]}
          size={48}
          color={color}
        />
        <Text
          className="text-2xl font-pmedium mt-2"
          style={{ color: getColor(section) }}
        >
          {wellnessTranslations[section]}
        </Text>
        <View className="flex flex-row items-center justify-center">
          <Text className="text-2xl font-pmedium mr-2">{currentValue}</Text>
          {renderIndicator()}
        </View>
      </View>
      {chartData.length > 1 && (
        <View
          style={{
            width: "40%",
            height: 120,
            marginLeft: 16,
          }}
        >
          <CustomAreaChart
            data={chartData}
            color={color}
            yMin={yMin}
            yMax={yMax}
          />
        </View>
      )}
    </View>
  );
};

export default WellnessDisplay;
