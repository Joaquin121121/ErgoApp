import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useCallback, useContext } from "react";
import Icon from "../../components/Icon";
import TonalButton from "../../components/TonalButton";
import { router } from "expo-router";
import UserContext from "../../contexts/UserContext";

const Targets = () => {
  const targets = [
    "Ganar músculo",
    "Más fuerza",
    "Bajar peso",
    "Saltar alto",
    "Resistencia",
    "Flexibilidad",
    "Mejor postura",
    "Equilibrio",
    "Velocidad",
    "Explosividad",
    "Coordinación",
    "Agilidad",
    "Cardio",
    "Movilidad",
    "Potencia",
  ];

  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [indexBeingShown, setIndexBeingShown] = useState(0);

  const { user, setUser } = useContext(UserContext);

  // Helper function to handle circular array access
  const getCircularIndex = useCallback((index, length) => {
    return ((index % length) + length) % length;
  }, []);

  // Get 5 items starting from current index, wrapping around if necessary
  const getCurrentItems = useCallback(() => {
    const items = [];
    for (let i = 0; i < 5; i++) {
      const wrappedIndex = getCircularIndex(
        indexBeingShown + i,
        targets.length
      );
      items.push({
        text: targets[wrappedIndex],
        originalIndex: wrappedIndex,
      });
    }
    return items;
  }, [indexBeingShown, targets.length]);

  // Handle navigation with infinite scrolling
  const handleNavigation = useCallback(
    (direction) => {
      setIndexBeingShown((prev) => {
        if (direction === "next") {
          return getCircularIndex(prev + 5, targets.length);
        } else {
          return getCircularIndex(prev - 5, targets.length);
        }
      });
    },
    [targets.length]
  );

  // Calculate display range for the counter text
  const getDisplayRange = useCallback(() => {
    const start = getCircularIndex(indexBeingShown, targets.length) + 1;
    const rawEnd = start + 4;
    const end = rawEnd > targets.length ? targets.length : rawEnd;
    return `Mostrando ${start} - ${end} de ${targets.length} objetivos`;
  }, [indexBeingShown, targets.length]);

  return (
    <View className="w-full">
      <Text className="self-center font-pregular text-2xl">Tus Objetivos</Text>
      <Text className="self-center font-plight text-16 text-darkGray">
        Selecciona al menos un objetivo
      </Text>
      <View className="self-center mt-8 w-full">
        {getCurrentItems().map(({ text, originalIndex }) => (
          <TouchableOpacity
            key={`${originalIndex}-${indexBeingShown}`}
            onPress={() => {
              setSelectedIndexes((prev) =>
                prev.includes(originalIndex)
                  ? prev.filter((num) => num !== originalIndex)
                  : [...prev, originalIndex]
              );
            }}
            className={`w-[85%] h-16 self-center mb-4 bg-white shadow-sm rounded-2xl justify-center ${
              selectedIndexes.includes(originalIndex) &&
              "border border-secondary"
            }`}
          >
            <Text className="font-pregular text-16 pl-4">{text}</Text>
          </TouchableOpacity>
        ))}
        <View className="flex flex-row items-center w-[85%] self-center">
          <TouchableOpacity
            className="flex flex-1"
            onPress={() => handleNavigation("prev")}
          >
            <Icon icon="leftArrow" size={32} />
          </TouchableOpacity>
          <Text className="font-plight text-darkGray text-16 mr-1">
            {getDisplayRange()}
          </Text>
          <TouchableOpacity
            className="flex flex-1"
            onPress={() => handleNavigation("next")}
          >
            <Icon icon="rightArrow" size={32} />
          </TouchableOpacity>
        </View>
        <TonalButton
          title="Continuar"
          icon="next"
          containerStyles="self-center mt-8"
          onPress={() => {
            setUser({
              ...user,
              targets: targets
                .filter((_, i) => selectedIndexes.includes(i))
                .map((e) => {
                  return { name: e, current: 20, target: 45 };
                }),
            });
            router.push("sign-up-2");
          }}
        />
      </View>
    </View>
  );
};

export default Targets;
