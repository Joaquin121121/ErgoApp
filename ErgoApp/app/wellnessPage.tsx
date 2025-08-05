import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { Athlete } from "../types/Athletes";
import { router, useLocalSearchParams } from "expo-router";
import {
  iconsMap,
  wellnessTranslations,
  WellnessType,
} from "../constants/wellnessColors";
import {
  calculatePercentageDifference,
  formatIsoToSpanishDate,
} from "../utils/utils";
import { getColor } from "../constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomAreaChart from "../components/CustomAreaChart";
import ChoiceButton from "../components/ChoiceButton";
import { timeFrameTranslations } from "../constants/Translations";
import OutlinedButton from "../components/OutlinedButton";

type TimeFrame = "week" | "month" | "year";

const WellnessPage = () => {
  const { userData } = useUser();
  const athleteData = userData as Athlete;

  const { wellnessCategory } = useLocalSearchParams();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("week");
  const [xInitialLabel, setXInitialLabel] = useState<string[]>([]);
  const [currentChartData, setCurrentChartData] = useState<number[]>([]);

  const wellnessData = athleteData.wellnessData?.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const wellnessDataValues = wellnessData?.map(
    (data) => data[wellnessCategory as WellnessType]
  );

  const color = getColor(wellnessCategory as WellnessType);

  const currentValue = wellnessDataValues?.[0]; // Most recent value
  const previousValue = wellnessDataValues?.[1]; // Second most recent value

  // Calculate the percentage difference display
  const diffResult = calculatePercentageDifference(
    previousValue || 0,
    currentValue || 0
  );

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

  const getChartData = (timeFrame: TimeFrame) => {
    if (!wellnessData) return { chartData: [], xInitialLabel: [] };

    const currentDate = new Date();
    let xInitialLabel: string[] = [];
    let offset = 0;
    switch (timeFrame) {
      case "week":
        offset = 7;
        break;
      case "month":
        offset = 30;
        break;
      case "year":
        offset = 365;
        break;
    }

    const startDate = new Date(
      currentDate.getTime() - offset * 24 * 60 * 60 * 1000
    );

    // Find the wellness data object with the date closest to startDate
    let closestData = wellnessData[0];
    let minDifference = Math.abs(
      new Date(closestData.date).getTime() - startDate.getTime()
    );

    for (const data of wellnessData) {
      const difference = Math.abs(
        new Date(data.date).getTime() - startDate.getTime()
      );
      if (difference < minDifference) {
        minDifference = difference;
        closestData = data;
      }
    }

    // Calculate the time difference between closestData.date and currentDate
    const closestDateTime = new Date(closestData.date).getTime();
    const currentDateTime = currentDate.getTime();
    const timeDifference = currentDateTime - closestDateTime;
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    if (timeDifference < oneWeekInMs) {
      // If difference is less than a week, only show the closest date
      xInitialLabel = [formatIsoToSpanishDate(closestData.date)];
    } else {
      // Calculate two middle points for longer time periods
      const firstMiddlePoint = new Date(closestDateTime + timeDifference / 3);
      const secondMiddlePoint = new Date(
        closestDateTime + (2 * timeDifference) / 3
      );

      xInitialLabel = [
        formatIsoToSpanishDate(closestData.date),
        formatIsoToSpanishDate(secondMiddlePoint),
        formatIsoToSpanishDate(firstMiddlePoint),
      ];
    }

    const chartData = wellnessData
      .filter(
        (value) =>
          new Date(value.date) >= startDate &&
          new Date(value.date) <= currentDate
      )
      .map((value) => value[wellnessCategory as WellnessType])
      .reverse();

    console.log("xInitialLabel", xInitialLabel);

    return { chartData: chartData || [], xInitialLabel };
  };

  useEffect(() => {
    const { chartData, xInitialLabel } = getChartData(timeFrame);
    setCurrentChartData(chartData);
    setXInitialLabel(xInitialLabel);
  }, [timeFrame]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 8 }}
      bounces={true}
      scrollEventThrottle={16}
      removeClippedSubviews={false}
      style={{
        flex: 1,
        backgroundColor: "white",
        minHeight: "100%",
      }}
    >
      <View className="flex flex-1 items-center bg-white">
        <View className="flex items-center  w-full my-8">
          <View className="flex flex-row items-center">
            <MaterialCommunityIcons
              name={iconsMap[wellnessCategory as WellnessType]}
              size={48}
              color={color}
              style={{
                marginRight: wellnessCategory === "sleep" ? 0 : 8,
              }}
            />
            <Text
              className="text-2xl font-pmedium"
              style={{ color: getColor(wellnessCategory as WellnessType) }}
            >
              {wellnessTranslations[wellnessCategory as WellnessType]}
            </Text>
          </View>
          <View className="flex flex-row items-center mt-8">
            <Text
              className="text-5xl font-pmedium py-2 mr-2"
              style={{ color: color }}
            >
              {currentValue}
            </Text>
            {renderIndicator()}
          </View>
        </View>

        <CustomAreaChart
          width={Dimensions.get("window").width * 0.9}
          height={200}
          xInitialLabel={xInitialLabel}
          xLabelColor={color}
          data={currentChartData}
          color={color}
          yMin={1}
          yMax={10}
        />
        <View className="flex flex-row justify-center w-full mt-4 mb-8">
          {["week", "month", "year"].map((timeFrameChoice) => (
            <ChoiceButton
              key={timeFrameChoice}
              text={timeFrameTranslations[timeFrameChoice as TimeFrame]}
              onPress={() => setTimeFrame(timeFrameChoice as TimeFrame)}
              selected={timeFrame === timeFrameChoice}
              outlineColor={color}
              backgroundColor={getColor(
                wellnessCategory as WellnessType,
                "veryLight"
              )}
            />
          ))}
        </View>
        <OutlinedButton
          containerStyles="my-8 self-center w-[35vw]"
          title="Volver"
          inverse
          icon="arrow-left"
          onPress={() => {
            router.back();
          }}
        />
      </View>
    </ScrollView>
  );
};

export default WellnessPage;
