import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { router } from "expo-router";
import UserContext from "../contexts/UserContext";

const IndexDisplay = ({
  name,
  currentValueParameter,
  pastValueParameter,
  onPress,
}) => {
  const { user } = useContext(UserContext);

  const currentValue =
    currentValueParameter ?? user?.stats?.[name.toLowerCase()]?.currentValue;
  const pastValue =
    pastValueParameter ??
    user?.stats?.[name.toLowerCase()]?.previousValues?.[0]?.value;

  // Calculate difference percentage only if both values exist
  const diffPercentage =
    currentValue && pastValue
      ? Math.round(((currentValue - pastValue) / pastValue) * 100)
      : 0;

  const styles = StyleSheet.create({
    triangleUp: {
      width: 0,
      height: 0,
      borderLeftWidth: 5,
      borderRightWidth: 5,
      borderBottomWidth: 10,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: "#00A859",
    },
    triangleDown: {
      width: 0,
      height: 0,
      borderLeftWidth: 5,
      borderRightWidth: 5,
      borderTopWidth: 10,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderTopColor: "#E81D23",
    },
    circle: {
      width: 8,
      height: 8,
      borderRadius: 75,
      backgroundColor: "#FFD700",
    },
  });

  const renderIndicator = () => {
    if (diffPercentage < -3) {
      return (
        <View className="flex flex-row items-center gap-1 w-10">
          <View style={styles.triangleDown} />
          <Text className="ml-1 font-plight text-[12px] text-secondary">{`${diffPercentage}%`}</Text>
        </View>
      );
    }
    if (diffPercentage > 3) {
      return (
        <View className="flex flex-row items-center gap-1 w-10">
          <View style={styles.triangleUp} />
          <Text className="ml-1 font-plight text-[12px] text-green">{`+${diffPercentage}%`}</Text>
        </View>
      );
    }
    return (
      <View className="flex flex-row items-center gap-1 w-10">
        <View style={styles.circle} />
        <Text className="ml-1 font-plight text-[12px] text-yellow">{`${
          diffPercentage > 0 ? `+${diffPercentage}` : diffPercentage
        }%`}</Text>
      </View>
    );
  };

  const displayValue = currentValue ? Math.round(currentValue) : "N/A";

  return (
    <TouchableOpacity onPress={() => router.push(`statGraph?stat=${name}`)}>
      <View className="w-32 h-16 rounded-2xl bg-offWhite pl-6 pr-4 flex justify-evenly">
        <Text className="text-[12px] text-darkGray font-plight ">{name}</Text>
        <View className="flex flex-row items-center justify-between">
          <Text className="font-pmedium text-2xl w-10">{displayValue}</Text>
          {renderIndicator()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default IndexDisplay;
