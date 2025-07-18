import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Icon from "../components/Icon";
import TonalButton from "../components/TonalButton";
import OutlinedButton from "../components/OutlinedButton";
import { router } from "expo-router";
const setClassTime = () => {
  const { classInfo, setClassInfo } = useContext(ClassContext);

  const [error, setError] = useState(false);

  const formatOrderedDays = (days) => {
    const dayOrder = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Domingo: 7,
    };

    const orderedDays = [...days].sort((a, b) => dayOrder[a] - dayOrder[b]);

    if (orderedDays.length === 0) return "";
    if (orderedDays.length === 1) return orderedDays[0];

    return (
      orderedDays.slice(0, -1).join(", ") +
      " y " +
      orderedDays[orderedDays.length - 1]
    );
  };

  const handleDelete = (index) => {
    setClassInfo({
      ...classInfo,
      time: classInfo.time.filter((_, i) => i !== index),
    });
  };

  const onContinue = () => {
    if (classInfo.time.length === 0) {
      setError(true);
      return;
    }
    router.push("newClassSummary");
  };

  useEffect(() => {
    setError(false);
  }, [classInfo.time]);

  return (
    <ScrollView>
      <Text className="text-xl font-pregular self-center mt-8">Horarios</Text>
      <Text className="text-16 font-pregular self-center mt-2 text-darkGray w-[85vw]">
        En que días y a que hora quieres realizar la clase?
      </Text>
      <View className="w-3/4 self-center mt-8">
        {!classInfo.time.length && (
          <Text className="text-16 font-pregular text-center self-center mt-2 text-secondary w-[85vw]">
            No hay horarios configurados
          </Text>
        )}
        {classInfo.time.map((item, index) => (
          <View
            key={index}
            className="flex-row items-center justify-between mb-4"
          >
            <Text className="text-16 font-pregular text-secondary max-w-[70%]">
              {formatOrderedDays(item.days)}, a las {item.hour}
            </Text>
            <TouchableOpacity onPress={() => handleDelete(index)}>
              <View className="bg-white rounded-full p-2 shadow-sm">
                <Icon icon="close" />
              </View>
            </TouchableOpacity>
          </View>
        ))}
        <Text
          className={`text-16 font-pmedium text-center self-center mt-8 text-secondary w-[85vw] ${
            !error && "opacity-0"
          }`}
        >
          Establezca un horario
        </Text>

        <OutlinedButton
          title="Agregar horario"
          icon="addRed"
          containerStyles="self-center mt-2"
          onPress={() => router.push("setClassTime2")}
        />
        <TonalButton
          containerStyles="self-center mt-4"
          icon="checkWhite"
          title="Continuar"
          onPress={onContinue}
        />
      </View>
    </ScrollView>
  );
};

export default setClassTime;
