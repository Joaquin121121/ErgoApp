import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { dayTranslations, calendarData } from "../scripts/calendarData";
import ActivityDetailed from "../components/ActivityDetailed";
import CustomFlatlist from "../components/CustomFlatlist";
import TonalButton from "../components/TonalButton";
import OutlinedButton from "../components/OutlinedButton";
import PendingStudy from "../components/PendingStudy";

import { router } from "expo-router";
const dayInfo = () => {
  const { currentWeekIndex, day } = useLocalSearchParams();

  const sortedWeeks = Object.keys(calendarData).sort((a, b) => {
    const [dayA] = a.split("-")[0].split("/").reverse();
    const [dayB] = b.split("-")[0].split("/").reverse();
    return parseInt(dayA) - parseInt(dayB);
  });
  const getFormattedDate = (day, weekRange) => {
    const [startDate] = weekRange.split("-");
    const [startDay, startMonth, startYear] = startDate.trim().split("/");

    const weekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = weekDays.indexOf(day);

    const date = new Date(
      startYear,
      parseInt(startMonth) - 1,
      parseInt(startDay)
    );
    date.setDate(date.getDate() + dayIndex);

    const formattedDay = date.getDate().toString().padStart(2, "0");
    const formattedMonth = (date.getMonth() + 1).toString().padStart(2, "0");

    return `${dayTranslations[day]} ${formattedDay}/${formattedMonth}`;
  };

  const formattedDate = getFormattedDate(day, currentWeekIndex);

  const scheduledActivities =
    calendarData[currentWeekIndex][day].scheduledActivities;

  const studies = calendarData[currentWeekIndex][day].scheduledStudies;

  const studiesFlatlistData = studies
    ? Array.from({ length: studies.length }, (_, i) => ({
        key: i,
      }))
    : [];

  const renderStudies = (study) => (
    <PendingStudy studies={studies} studyKey={study.key} />
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeStudyIndex, setActiveStudyIndex] = useState(0);

  const flatlistData = scheduledActivities
    ? Array.from({ length: scheduledActivities.length }, (_, i) => ({
        key: i,
      }))
    : [];

  const renderActivities = (activity) => (
    <ActivityDetailed
      index={activity?.key}
      day={day}
      week={currentWeekIndex}
      studies={studies.length}
    />
  );

  return (
    <ScrollView>
      <Text className="text-2xl font-pregular mt-8 ml-4">
        Itinerario {formattedDate}
      </Text>
      <CustomFlatlist
        data={flatlistData}
        renderContent={renderActivities}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        height={studies.length ? 380 : 460}
      />
      <View className="mt-4" />
      {studies.length && (
        <CustomFlatlist
          data={studiesFlatlistData}
          renderContent={renderStudies}
          activeIndex={activeStudyIndex}
          setActiveIndex={setActiveStudyIndex}
          height={180}
        />
      )}
      <OutlinedButton
        inverse
        icon="arrowBackRed"
        title="Volver"
        containerStyles="self-center w-[40vw] mt-8"
        onPress={() => router.back()}
      />
    </ScrollView>
  );
};

export default dayInfo;
