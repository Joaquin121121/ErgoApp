import { ScrollView, Text, View } from "react-native";
import React, { useState } from "react";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";
import TonalButton from "../components/TonalButton";
import { router } from "expo-router";
const setClassTime2 = () => {
  const daysOfTheWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const [selectedDays, setSelectedDays] = useState([]);
  const [hour, setHour] = useState("");
  const [hourError, setHourError] = useState(false);
  const [daysError, setDaysError] = useState(false);

  const onSave = () => {
    router.back();
  };

  return (
    <ScrollView>
      <Text className="text-xl font-pregular self-center mt-8">
        Registrar Horario
      </Text>
      <View className="w-3/4 self-center mt-8">
        <Text className="text-16 text-darkGray">Días (seleccionar)</Text>
        <View className="flex-row justify-between w-[95vw] self-center mt-4">
          {daysOfTheWeek.map((day) => (
            <CustomButton
              containerStyles={`w-12 ${
                selectedDays.includes(day)
                  ? "bg-lightRed"
                  : "bg-offWhite border border-lightRed"
              }`}
              textStyles={`text-secondary ${
                selectedDays.includes(day) && "font-psemibold"
              }`}
              title={day.substring(0, 3)}
              onPress={() => {
                setSelectedDays(
                  selectedDays.includes(day)
                    ? selectedDays.filter((d) => d !== day)
                    : [...selectedDays, day]
                );
              }}
            />
          ))}
        </View>
        <FormField
          placeholder="Hora"
          otherStyles="self-center mt-8"
          keyboardType="numeric"
          title="Hora"
        />
        {hourError && (
          <Text className="text-16 text-secondary self-center mt-2">
            Hora inválida
          </Text>
        )}
        <TonalButton
          containerStyles="self-center mt-8"
          title="Continuar"
          onPress={onSave}
        />
      </View>
    </ScrollView>
  );
};

export default setClassTime2;
