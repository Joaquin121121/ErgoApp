import { View, Text, Animated } from "react-native";
import React, { useState, useRef } from "react";
import Day from "./Day";
import Icon from "./Icon";
import { TouchableOpacity } from "react-native";
import { calendarData, dayTranslations } from "../scripts/calendarData";

const Calendar = () => {
  // Sort weeks in chronological order
  const sortedWeeks = Object.keys(calendarData).sort((a, b) => {
    const [dayA] = a.split("-")[0].split("/").reverse();
    const [dayB] = b.split("-")[0].split("/").reverse();
    return parseInt(dayA) - parseInt(dayB);
  });

  const [currentWeekIndex, setCurrentWeekIndex] = useState(
    sortedWeeks.length - 1
  );
  const slideAnim = useRef(new Animated.Value(0)).current;
  const touchX = useRef(0);

  const currentWeek = calendarData[sortedWeeks[currentWeekIndex]];
  const days = Object.keys(currentWeek);

  const animateSlide = (direction) => {
    slideAnim.setValue(direction === "left" ? 300 : -300);

    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePrevWeek = () => {
    if (currentWeekIndex > 0) {
      animateSlide("right");
      setCurrentWeekIndex((prev) => prev - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < sortedWeeks.length - 1) {
      animateSlide("left");
      setCurrentWeekIndex((prev) => prev + 1);
    }
  };

  const handleTouchStart = (event) => {
    touchX.current = event.nativeEvent.pageX;
  };

  const handleTouchEnd = (event) => {
    const SWIPE_THRESHOLD = 50;
    const dx = event.nativeEvent.pageX - touchX.current;

    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx > 0 && currentWeekIndex > 0) {
        handlePrevWeek();
      } else if (dx < 0 && currentWeekIndex < sortedWeeks.length - 1) {
        handleNextWeek();
      }
    }
  };

  // Format the date range for display
  const formatDateRange = (dateRange) => {
    const [start, end] = dateRange.split("-");
    return `${start} - ${end}`;
  };

  return (
    <View className="h-[280] w-[85%] self-center flex gap-4 items-center">
      <Animated.View
        style={{ transform: [{ translateX: slideAnim }] }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <View className="gap-4">
          {/* First row - Monday to Wednesday */}
          <View className="w-full h-[110px] flex flex-row justify-between">
            {days.slice(0, 3).map((day) => {
              const dayData = currentWeek[day];
              const hasActivity = dayData.scheduledActivities.length > 0;

              return (
                <Day
                  key={day}
                  day={dayTranslations[day]}
                  sessionName={
                    hasActivity
                      ? dayData.scheduledActivities[0].name
                      : "restDay"
                  }
                />
              );
            })}
          </View>

          {/* Second row - Thursday to Saturday */}
          <View className="w-full h-[110px] flex flex-row justify-between">
            {days.slice(3, 6).map((day) => {
              const dayData = currentWeek[day];
              const hasActivity = dayData.scheduledActivities.length > 0;

              return (
                <Day
                  key={day}
                  day={dayTranslations[day]}
                  sessionName={
                    hasActivity
                      ? dayData.scheduledActivities[0].name
                      : "restDay"
                  }
                />
              );
            })}
          </View>
        </View>
      </Animated.View>

      <View className="mt-2 flex flex-row items-center">
        <TouchableOpacity
          onPress={handlePrevWeek}
          disabled={currentWeekIndex === 0}
        >
          <Icon
            size={32}
            icon="leftArrow"
            style={{ opacity: currentWeekIndex === 0 ? 0.5 : 1 }}
          />
        </TouchableOpacity>
        <Text className="font-plight text-darkGray ml-4 mr-4">
          {formatDateRange(sortedWeeks[currentWeekIndex])}
        </Text>
        <TouchableOpacity
          onPress={handleNextWeek}
          disabled={currentWeekIndex === sortedWeeks.length - 1}
        >
          <Icon
            size={32}
            icon="rightArrow"
            style={{
              opacity: currentWeekIndex === sortedWeeks.length - 1 ? 0.5 : 1,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Calendar;
