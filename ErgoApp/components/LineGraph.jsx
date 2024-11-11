import React, { useContext, useState } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import UserContext from "../contexts/UserContext";

const LineGraph = ({
  stat,
  currentValue,
  previousValues = [], // Array of { value: number, date: string }
  targetValue = null,
}) => {
  const { user, setUser } = useContext(UserContext);

  const { currentValue, parsedPreviousValues, targetValue } =
    user["stats"][stat];

  const previousValues = parsedPreviousValues || user["registryDate"];
  // Calculate width based on screen
  const screenWidth = Dimensions.get("window").width;

  // Process data
  const data = {
    labels: previousValues.map((pv) => {
      const date = new Date(pv.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        data: [...previousValues.map((pv) => pv.value), currentValue],
        color: () => "#00A859", // Green color
        strokeWidth: 2,
      },
    ],
  };

  // If there's a target, adjust data to show only 75% and add target point
  if (targetValue) {
    // Truncate data to 75% of points
    const dataLength = data.labels.length;
    const cutoffIndex = Math.floor(dataLength * 0.75);

    data.labels = data.labels.slice(0, cutoffIndex);
    data.datasets[0].data = data.datasets[0].data.slice(0, cutoffIndex);

    // Add target point
    data.labels.push("Target");
    data.datasets.push({
      data: [null, null, null, targetValue], // Only show target at end
      color: () => "#E81D23", // Red color
      strokeWidth: 0,
    });
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={screenWidth - 20} // -20 for margin
        height={220}
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 168, 89, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#00A859",
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default LineGraph;
