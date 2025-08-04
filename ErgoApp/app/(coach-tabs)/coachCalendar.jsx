import { View, Text, ScrollView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Calendar from "../../components/Calendar";
import CustomFlatlist from "../../components/CustomFlatlist";

const coachCalendar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { coachInfo, setCoachInfo } = useContext(CoachContext);
  const day = new Date()
    .toLocaleString("es", { weekday: "long" })
    .replace(/^(\w)/, (c) => c.toUpperCase());
  const activitiesToday = coachInfo.classes.filter((activity) =>
    activity.time[0].days.includes(day)
  );
  const flatlistData = activitiesToday
    ? Array.from({ length: activitiesToday.length }, (_, i) => ({
        key: i,
      }))
    : [];

  const renderActivities = (activity) => (
    <ActivitySummary index={activity?.key} />
  );

  return (
    <ScrollView className="pt-20">
      <Text className="text-2xl font-pregular mt-8 ml-4">Mi Semana</Text>
      <Calendar coach />
      <Text className="text-2xl font-pregular mt-12 ml-4">
        Actividades de Hoy
      </Text>
      {activitiesToday.length === 0 ? (
        <View className="shadow-sm w-[85vw] self-center h-40 flex items-center justify-center p-4 bg-white rounded-2xl mt-4">
          <Text className="text-16 font-plight  ">
            No tienes actividades programadas para hoy
          </Text>
        </View>
      ) : (
        <CustomFlatlist
          data={flatlistData}
          renderContent={renderActivities}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          height={240}
        />
      )}
    </ScrollView>
  );
};

export default coachCalendar;
