import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect } from "react";

import LineGraph from "../components/LineGraph";
import { router, useLocalSearchParams } from "expo-router";
import TonalButton from "../components/TonalButton";
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
      <View className="self-center flex flex-row items-center mb-4">
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
      <View className="self-center mt-4 bg-white rounded-2xl shadow-sm w-[90vw] pl-2 pr-2">
        <Text className="font-pregular text-2xl self-center mt-4 mb-2">
          ¿Qué es {stat}?
        </Text>
        <Text className="font-plight text-sm">
          El RSI, o Índice de Fuerza Reactiva, mide la capacidad de cambiar
          rápidamente de dirección o moverse explosivamente. Un valor alto
          indica mejor respuesta y agilidad, algo crucial en muchos deportes.
        </Text>
        <TouchableOpacity>
          <Text className="font-pregular text-secondary text-sm mb-8">
            Ver más
          </Text>
        </TouchableOpacity>
      </View>
      <TonalButton
        containerStyles="self-center mt-8"
        icon="checkWhite"
        title="Continuar"
        onPress={() => {
          router.back();
        }}
      />
    </ScrollView>
  );
};

export default StatGraph;
