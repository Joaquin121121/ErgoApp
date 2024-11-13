import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import LineGraph from "../components/LineGraph";
import { useLocalSearchParams } from "expo-router";

const StatGraph = () => {
  const { stat } = useLocalSearchParams();
  const { user, setUser } = useContext(UserContext);

  const currentValue = user?.stats?.[stat.toLowerCase()]?.currentValue;
  const pastValue =
    user?.stats?.[stat.toLowerCase()]?.previousValues?.at(-1)?.value;
  const diffPercentage = Math.round(
    ((currentValue - pastValue) / pastValue) * 100
  );

  const styles = StyleSheet.create({
    triangleUp: {
      width: 0,
      height: 0,
      borderLeftWidth: 5, // Half the width of the base
      borderRightWidth: 5, // Half the width of the base
      borderBottomWidth: 10, // Height of the triangle
      borderLeftColor: "transparent", // Left border transparent
      borderRightColor: "transparent", // Right border transparent
      borderBottomColor: "#00A859", // Color of the triangle
    },
    triangleDown: {
      width: 0,
      height: 0,
      borderLeftWidth: 5, // Half the width of the base
      borderRightWidth: 5, // Half the width of the base
      borderTopWidth: 10, // Height of the triangle
      borderLeftColor: "transparent", // Left border transparent
      borderRightColor: "transparent", // Right border transparent
      borderTopColor: "#E81D23", // Color of the triangle
    },
    circle: {
      width: 8,
      height: 8,
      borderRadius: 75,
      backgroundColor: "#FFD700",
    },
  });

  return (
    <ScrollView>
      <Text className="self-center text-2xl text-darkGray">{stat}</Text>
      <Text className="mt-1 self-center text-[32px]">
        {currentValue || "No disponible ahora mismo"}
      </Text>
      <View className="self-center flex flex-row items-center">
        {diffPercentage < -3 && (
          <>
            <View style={styles.triangleDown} />
            <Text className="text-secondary font-plight ml-1">{`${diffPercentage}%`}</Text>
          </>
        )}
        {diffPercentage >= -3 && diffPercentage <= 3 && (
          <>
            <View style={styles.circle} />
            <Text className="text-yellow font-plight ml-1">{`${diffPercentage}%`}</Text>
          </>
        )}
        {diffPercentage > 3 && (
          <>
            <View style={styles.triangleUp} />
            <Text className="text-green font-plight ml-1">{`${diffPercentage}%`}</Text>
          </>
        )}
      </View>
      <LineGraph stat={stat} />
    </ScrollView>
  );
};

export default StatGraph;
