import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Icon from "../components/Icon";
import TonalButton from "../components/TonalButton";
import OutlinedButton from "../components/OutlinedButton";
import { router } from "expo-router";
const setClassTime = () => {
  const [classTimes, setClassTimes] = useState([
    {
      days: ["Lunes", "Miércoles", "Viernes"],
      time: "19:45",
    },
    {
      days: ["Martes", "Jueves"],
      time: "08:30",
    },
    {
      days: ["Sábado"],
      time: "10:00",
    },
  ]);

  const [error, setError] = useState(false);

  const handleDelete = (index) => {
    setClassTimes(classTimes.filter((_, i) => i !== index));
  };

  const onContinue = () => {
    if (classTimes.length === 0) {
      setError(true);
      return;
    }
  };

  useEffect(() => {
    setError(false);
  }, [classTimes]);

  return (
    <ScrollView>
      <Text className="text-xl font-pregular self-center mt-8">Horarios</Text>
      <Text className="text-16 font-pregular self-center mt-2 text-darkGray w-[85vw]">
        En que días y a que hora quieres realizar la clase?
      </Text>
      <View className="w-3/4 self-center mt-8">
        {!classTimes.length && (
          <Text className="text-16 font-pregular text-center self-center mt-2 text-secondary w-[85vw]">
            No hay horarios configurados
          </Text>
        )}
        {classTimes.map((item, index) => (
          <View
            key={index}
            className="flex-row items-center justify-between mb-4"
          >
            <Text className="text-16 font-pregular text-secondary max-w-[70%]">
              {item.days.join(", ")}, a las {item.time}
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
