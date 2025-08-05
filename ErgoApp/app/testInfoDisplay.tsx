import { View, Text, ScrollView, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useUser } from "../contexts/UserContext";
import { Athlete } from "../types/Athletes";
import { StudyType } from "../types/Studies";
import { testInfo } from "../types/Studies";
import CustomAreaChart from "../components/CustomAreaChart";
import {
  formatIsoToSpanishDate,
  getDataForValue,
  getEquidistantDates,
} from "../utils/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "../utils/supabase";
import { formattedDisciplines } from "../constants/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface AiAnalysis {
  shortInfo1: string;
  shortInfo2: string;
  amateurPercentile: number;
  professionalPercentile: number;
}
const getAiAnalysis = async (
  testType: string,
  testValue: number,
  sport: string
): Promise<AiAnalysis | null> => {
  try {
    const savedInfo = await AsyncStorage.getItem(testType + testValue);
    if (savedInfo) {
      return JSON.parse(savedInfo) as AiAnalysis;
    }
    const { data, error } = await supabase.functions.invoke(
      "analyze-performance",
      {
        body: { testType, testValue, sport },
      }
    );

    if (error) {
      console.error("Error invoking function:", error);
      return null;
    }

    await AsyncStorage.setItem(testType + testValue, JSON.stringify(data));
    return data as AiAnalysis;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return null;
  }
};

const TestInfoDisplay = () => {
  const { testType, valueType } = useLocalSearchParams();
  const { userData } = useUser();

  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);

  const [displayValue, setDisplayValue] = useState<string>("");
  const athleteData = userData as Athlete;

  const completedTests = athleteData.completedStudies.filter(
    (test) => test.results.type === testType
  );

  const latestTest = completedTests[completedTests.length - 1];

  const displayType =
    valueType === "height"
      ? testInfo[testType as StudyType].displayName
      : valueType;

  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    const getChartData = async () => {
      let chartData: number[] = [];
      if (valueType === "height") {
        chartData = [...completedTests].reverse().map((test) => {
          if (test.results.type === "custom" || test.results.type === "bosco")
            return 0;
          if (test.results.type === "multipleDropJump") {
            return test.results.maxAvgHeightReached || 0;
          }
          return test.results.avgHeightReached || 0;
        });
      } else {
        if (valueType !== "ECR" && valueType !== "RSI") {
          setChartData([]);
        } else {
          chartData = getDataForValue(valueType, athleteData.completedStudies);
        }
      }
      setChartData(chartData);
      const displayValue =
        valueType === "height"
          ? chartData[chartData.length - 1]?.toFixed(2) || ""
          : chartData[chartData.length - 1] || "";
      setDisplayValue(displayValue as string);

      const aiAnalysis = await getAiAnalysis(
        displayType as string,
        displayValue as unknown as number,
        formattedDisciplines.find(
          (discipline) => discipline.id === athleteData.discipline
        )?.label || "No Especificado"
      );
      if (aiAnalysis) {
        setAiAnalysis(aiAnalysis);
      }
    };
    getChartData();
  }, []);

  if (
    latestTest.results.type === "custom" ||
    latestTest.results.type === "bosco" ||
    completedTests.length === 0
  ) {
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
          <Text className="text-4xl font-pmedium text-secondary">
            {testInfo[testType as StudyType].displayName}
          </Text>
          <Text className="text-2xl text-secondary mt-2">
            {testInfo[testType as StudyType].measures}
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 8 }}
      bounces={true}
      scrollEventThrottle={16}
      removeClippedSubviews={false}
      style={{
        flex: 1,
        minHeight: "100%",
      }}
    >
      <View className="flex w-[95vw] items-center bg-white self-center rounded-2xl shadow-sm py-4">
        <Text className="text-4xl font-pmedium text-secondary my-8">
          {displayType}
        </Text>
        <Text className="text-5xl text-secondary mt-2 mb-8">
          {displayValue}{" "}
          {valueType === "height" ? <Text className="text-3xl">cm</Text> : ""}
        </Text>
        {chartData.length > 1 && (
          <CustomAreaChart
            data={chartData}
            color="#e81d23"
            yMin={20}
            yMax={60}
            xInitialLabel={getEquidistantDates(
              completedTests.map((test) => test.date),
              3
            ).map((date) => formatIsoToSpanishDate(date))}
            xLabelColor="#e81d23"
            width={Dimensions.get("window").width * 0.9}
            height={200}
          />
        )}
      </View>
      <Text className="font-pregular text-h3 mt-8 ml-4">Significado</Text>
      <View className="bg-white shadow-sm rounded-2xl w-[90vw] flex flex-col p-8 pr-16 self-center">
        <View className="flex flex-row items-center">
          <MaterialCommunityIcons
            name="information-outline"
            size={32}
            color="#e81d23"
          />
          <Text className="text-16 ml-4">{aiAnalysis?.shortInfo1}</Text>
        </View>
        <View className="flex flex-row items-center mt-4">
          <MaterialCommunityIcons
            name="information-outline"
            size={32}
            color="#e81d23"
          />
          <Text className="text-16 ml-4">{aiAnalysis?.shortInfo2}</Text>
        </View>
        <View className="flex flex-row items-center mt-4">
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={32}
            color="#e81d23"
          />
          <Text className="text-16 ml-4">
            Percentil amateur:{" "}
            <Text className="text-secondary">
              {aiAnalysis?.amateurPercentile}%
            </Text>
          </Text>
        </View>
        <View className="flex flex-row items-center mt-4">
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={32}
            color="#e81d23"
          />
          <Text className="text-16 ml-4">
            Percentil profesional:{" "}
            <Text className="text-secondary">
              {aiAnalysis?.professionalPercentile}%
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default TestInfoDisplay;
