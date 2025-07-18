import { View, Text, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
import Icon from "../components/Icon";
import OutlinedButton from "../components/OutlinedButton";
import TonalButton from "../components/TonalButton";
import { router } from "expo-router";
const newClassSummary = () => {
  const { classInfo } = useContext(ClassContext);
  const { coachInfo, setCoachInfo } = useContext(CoachContext);

  const [loading, setLoading] = useState(false);
  const difficultyColor =
    classInfo.relativeAttendance === "Elevada"
      ? "text-secondary"
      : classInfo.relativeAttendance === "Media"
      ? "text-yellow"
      : "text-green";

  const mergeHourArrays = (objects) => {
    if (!objects || objects.length === 0) return [];

    // Get all hours and remove duplicates
    const hours = [...new Set(objects.map((obj) => obj.hour))];

    // Sort hours
    return hours.sort((a, b) => {
      const [hoursA, minsA] = a.split(":").map(Number);
      const [hoursB, minsB] = b.split(":").map(Number);

      if (hoursA !== hoursB) return hoursA - hoursB;
      return minsA - minsB;
    });
  };

  const mergeDayArrays = (objects) => {
    const dayOrder = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Domingo: 7,
    };

    return [
      ...new Set(
        objects.reduce((allDays, obj) => {
          if (obj?.days) {
            allDays.push(...obj.days);
          }
          return allDays;
        }, [])
      ),
    ].sort((a, b) => dayOrder[a] - dayOrder[b]);
  };

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

    // Remove duplicates and sort
    const orderedDays = [...new Set(days)].sort(
      (a, b) => dayOrder[a] - dayOrder[b]
    );

    if (orderedDays.length === 0) return "";
    if (orderedDays.length === 1) return orderedDays[0];

    return (
      orderedDays.slice(0, -1).join(", ") +
      " y " +
      orderedDays[orderedDays.length - 1]
    );
  };

  const formatMinutesToTime = (minutes) => {
    if (!minutes && minutes !== 0) return "0:00";
    if (minutes < 60) return `${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}`;
  };

  const onSaveClass = async () => {
    const classRef = doc(collection(db, "classes"));
    try {
      setLoading(true);
      await setDoc(classRef, {
        ...classInfo,
        id: classRef.id,
      });
      setCoachInfo((prev) => ({
        ...prev,
        classes: [...prev.classes, classInfo],
      }));
      router.replace("coachClasses");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <Text className="text-2xl font-pregular self-center mt-8">Resumen</Text>
      <View className="w-[85vw] self-center mt-4 shadow-sm rounded-2xl bg-white">
        <Text className="text-xl font-pregular self-center mt-2 mb-8">
          {classInfo.name}
        </Text>
        <View className="pl-8 mt-4">
          <View className="flex-row items-center mb-8 w-3/4">
            <Icon icon="calendar" />
            <Text className="text-16 font-pregular text-darkGray  ml-2">
              {formatOrderedDays(mergeDayArrays(classInfo.time))}
            </Text>
          </View>
          <View className="flex-row items-center mb-8 w-3/4">
            <Icon icon="schedule" />
            <Text className="text-16 font-pregular text-darkGray  ml-2">
              {mergeHourArrays(classInfo.time).join(", ")} hs
            </Text>
          </View>
          <View className="flex-row items-center mb-8 w-3/4">
            <Icon icon="timer" />
            <Text className="text-16 font-pregular text-darkGray  ml-2">
              Duración: {formatMinutesToTime(classInfo.duration)}
              {classInfo.duration >= 60 ? " hs" : ""}
            </Text>
          </View>
          <View className="flex-row items-center mb-8 w-3/4">
            <Icon icon="velocimeter" />
            <Text className="text-16 font-pregular text-darkGray  ml-2">
              Dificultad:{" "}
              <Text className={difficultyColor}>{classInfo.difficulty}</Text>
            </Text>
          </View>
          <View className="flex-row items-center mb-8 w-3/4">
            <Icon icon="location" />
            <Text className="text-16 font-pregular text-darkGray  ml-2">
              Lugar: <Text className="text-secondary">{classInfo.place}</Text>
            </Text>
          </View>
        </View>
      </View>
      <View className="w-full mt-8 flex flex-row items-center justify-around">
        <OutlinedButton
          title="Volver"
          containerStyles="w-[40%]"
          icon="arrowBackRed"
          onPress={() => {
            router.back();
          }}
          inverse
        />
        <TonalButton
          title="Guardar"
          icon="checkWhite"
          onPress={onSaveClass}
          containerStyles="w-[40%]"
          isLoading={loading}
        />
      </View>
    </ScrollView>
  );
};

export default newClassSummary;
