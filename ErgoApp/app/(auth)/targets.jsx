import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useCallback, useContext, useEffect } from "react";
import Icon from "../../components/Icon";
import TonalButton from "../../components/TonalButton";
import { router } from "expo-router";

import { categories } from "../../scripts/categories";
import { set } from "date-fns";
import { tr } from "date-fns/locale";

const targets = () => {
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [indexBeingShown, setIndexBeingShown] = useState(0);
  const [targetError, setTargetError] = useState(null);

  const { user, setUser } = useContext(UserContext);

  const trainingTargets = categories["trainingTargets"];

  // Helper function to handle circular array access
  const getCircularIndex = useCallback((index, length) => {
    return ((index % length) + length) % length;
  }, []);

  // Get up to 5 items starting from current index, without wrapping
  const getCurrentItems = useCallback(() => {
    const items = [];
    const remainingItems = trainingTargets.length - indexBeingShown;
    const itemsToShow = Math.min(5, remainingItems);

    for (let i = 0; i < itemsToShow; i++) {
      const currentIndex = indexBeingShown + i;
      items.push({
        text: trainingTargets[currentIndex],
        originalIndex: currentIndex,
      });
    }
    return items;
  }, [indexBeingShown, trainingTargets.length]);

  // Handle navigation with bounds checking
  const handleNavigation = useCallback(
    (direction) => {
      setIndexBeingShown((prev) => {
        if (direction === "next") {
          const nextIndex = prev + 5;
          return nextIndex < trainingTargets.length ? nextIndex : prev;
        } else {
          const prevIndex = prev - 5;
          return prevIndex >= 0 ? prevIndex : 0;
        }
      });
    },
    [trainingTargets.length]
  );

  // Calculate display range for the counter text
  const getDisplayRange = useCallback(() => {
    const start = indexBeingShown + 1;
    const end = Math.min(indexBeingShown + 5, trainingTargets.length);
    return `Mostrando ${start} - ${end} de ${trainingTargets.length} objetivos`;
  }, [indexBeingShown, trainingTargets.length]);

  const onContinue = () => {
    if (!selectedIndexes.length) {
      setTargetError(true);
      return;
    }
    setUser({
      ...user,
      targets: trainingTargets
        .filter((_, i) => selectedIndexes.includes(i))
        .map((e) => {
          return { name: e, current: 20, target: 45 };
        }),
    });
    router.push("injury-history");
  };

  useEffect(() => {
    setTargetError(false);
  }, [selectedIndexes.length]);

  return (
    <View className="w-full">
      <Text className="self-center font-pregular text-2xl">Tus Objetivos</Text>
      <Text className="self-center font-plight text-16 text-darkGray">
        Selecciona al menos un objetivo
      </Text>
      <View className="self-center mt-8 w-full h-[70vh] relative">
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
        {targetError && (
          <Text className="text-secondary font-pregular text-16 mt-2 self-center absolute bottom-44">
            Seleccione al menos un objetivo
          </Text>
        )}
        <View className="flex flex-row items-center w-[85%] absolute bottom-32 mt-8 left-[10%]">
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
          containerStyles="absolute bottom-16 mt-8 left-[25%]"
          onPress={onContinue}
        />
      </View>
    </View>
  );
};

export default targets;
