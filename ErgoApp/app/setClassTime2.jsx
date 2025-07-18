import { ScrollView, Text, View, Platform } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";
import TonalButton from "../components/TonalButton";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
const SetClassTime2 = () => {
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
  const [time, setTime] = useState(() => {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  });
  const [displayTime, setDisplayTime] = useState("");
  const [timeError, setTimeError] = useState(false);
  const [daysError, setDaysError] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const { classInfo, setClassInfo } = useContext(ClassContext);

  const toggleVisibility = () => {
    setPickerVisible(!pickerVisible);
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const onChange = (event, selectedTime) => {
    if (event.type === "set" && selectedTime) {
      setTime(selectedTime);
      if (Platform.OS === "android") {
        saveChanges(selectedTime);
      }
    } else {
      toggleVisibility();
    }
  };

  const saveChanges = (selectedTime = time) => {
    toggleVisibility();
    setDisplayTime(formatTime(selectedTime));
    setTimeError(false);
  };

  const onSave = () => {
    if (!displayTime) {
      setTimeError(true);
      return;
    }
    if (selectedDays.length === 0) {
      setDaysError(true);
      return;
    }
    // Here you can handle the selected time and days
    setClassInfo({
      ...classInfo,
      time: [...classInfo.time, { days: selectedDays, hour: displayTime }],
    });
    router.back();
  };

  useEffect(() => {
    setDisplayTime(formatTime(time));
  }, []);

  return (
    <ScrollView>
      <Text className="text-xl font-pregular self-center mt-8">
        Registrar Horario
      </Text>
      <View className="w-3/4 self-center mt-8">
        {!pickerVisible && (
          <>
            <Text className="text-16 text-darkGray">Días (seleccionar)</Text>
            <View className="flex-row flex-wrap justify-between w-[95vw] self-center mt-4">
              {daysOfTheWeek.map((day) => (
                <CustomButton
                  key={day}
                  containerStyles={`w-12 mb-2 ${
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
                    setDaysError(false);
                  }}
                />
              ))}
            </View>
            {daysError && (
              <Text className="text-16 text-secondary self-center mt-2">
                Seleccione al menos un día
              </Text>
            )}
          </>
        )}
        <FormField
          placeholder="HH:MM"
          otherStyles="self-center mt-8"
          title="Hora"
          value={displayTime}
          editable={false}
          toggleVisibility={toggleVisibility}
          date
        />
        {timeError && !pickerVisible && (
          <Text className="text-16 text-secondary self-center mt-2">
            Seleccione una hora
          </Text>
        )}
        {pickerVisible && (
          <>
            <DateTimePicker
              value={time}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={onChange}
              locale="es-ES"
            />
            {Platform.OS === "ios" && (
              <CustomButton
                icon="checkWhite"
                title="Guardar"
                containerStyles="self-center mt-8 bg-secondary"
                textStyles="text-white"
                onPress={() => saveChanges()}
              />
            )}
          </>
        )}
        {!pickerVisible && (
          <TonalButton
            containerStyles="self-center mt-8"
            title="Continuar"
            onPress={onSave}
            icon="checkWhite"
          />
        )}
      </View>
    </ScrollView>
  );
};

export default SetClassTime2;
