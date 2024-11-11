import { View, Text, ScrollView } from "react-native";
import React, { useContext } from "react";
import UserContext from "../contexts/UserContext";

const StatGraph = ({ stat }) => {
  const { user, setUser } = useContext(UserContext);
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
    <ScrollView>
      <Text className="self-center text-2xl text-darkGray">{stat}</Text>
      <Text className="mt-1 self-center text-[32px]">
        {user["stats"][stat.toLowerCase()]
          ? user["stats"][stat]["currentValue"]
          : "No disponible ahora mismo"}
      </Text>
      <View className="self-center flex flex-row items-center">
        {diffPercentage < -5 && (
          <>
            <View style={styles.triangleDown} />
            <Text className="text-secondary font-plight ml-1">{`${diffPercentage}%`}</Text>
          </>
        )}
        {diffPercentage > -5 && diffPercentage < 5 && (
          <>
            <View style={styles.circle} />
            <Text className="text-yellow font-plight ml-1">{`${diffPercentage}%`}</Text>
          </>
        )}
        {diffPercentage > 5 && (
          <>
            <View style={styles.triangleUp} />
            <Text className="text-green font-plight ml-1">{`${diffPercentage}%`}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default StatGraph;
