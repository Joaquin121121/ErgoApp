import { View, Text, StyleSheet } from "react-native";
import React from "react";

const IndexDisplay = ({ name, currentValue, pastValue }) => {
  const diffPercentage = Math.round(
    ((currentValue - pastValue) / currentValue) * 100
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
    <View className="w-32 h-14 rounded-2xl bg-offWhite pl-6 pr-4 ">
      <Text className="text-[12px] text-darkGray font-plight">{name}</Text>
      <View className="flex flex-row items-center justify-between">
        <Text className="font-pmedium text-2xl w-10">{currentValue}</Text>
        {diffPercentage < -5 && (
          <View className="flex flex-row items-center gap-1 w-10">
            <View style={styles.triangleDown} />
            <Text className="ml-1 font-plight text-[12px] text-secondary">{`${diffPercentage}%`}</Text>
          </View>
        )}
        {diffPercentage >= -5 && diffPercentage <= 5 && (
          <View className="flex flex-row items-center gap-1 w-10">
            <View style={styles.circle} />
            <Text className="ml-1 font-plight text-[12px] text-yellow">{`${diffPercentage}%`}</Text>
          </View>
        )}
        {diffPercentage > 5 && (
          <View className="flex flex-row items-center gap-1 w-10">
            <View style={styles.triangleUp} />
            <Text className="ml-1 font-plight text-[12px] text-green">{`${diffPercentage}%`}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default IndexDisplay;
