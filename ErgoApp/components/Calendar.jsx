import { View, Text, Animated, useWindowDimensions } from "react-native";
import React, { useState, useRef, useCallback, useEffect } from "react";
import Day from "./Day";
import Icon from "./Icon";
import { TouchableOpacity } from "react-native";
import { calendarData, dayTranslations } from "../scripts/calendarData";

const Calendar = ({ coach }) => {
  // Sort weeks in chronological order
  const sortedWeeks = Object.keys(calendarData).sort((a, b) => {
    const [dayA] = a.split("-")[0].split("/").reverse();
    const [dayB] = b.split("-")[0].split("/").reverse();
    return parseInt(dayA) - parseInt(dayB);
  });

  // Find the current week index
  const getCurrentWeekIndex = () => {
    const today = new Date();
    return sortedWeeks.findIndex((weekRange) => {
      const [startDate] = weekRange.split("-");
      const [day, month, year] = startDate.split("/").map(Number);
      const weekStart = new Date(year, month - 1, day);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      return today >= weekStart && today <= weekEnd;
    });
  };

  const initialWeekIndex = getCurrentWeekIndex();
  const [currentWeekIndex, setCurrentWeekIndex] = useState(
    initialWeekIndex !== -1 ? initialWeekIndex : sortedWeeks.length - 1
  );

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const { width: screenWidth } = useWindowDimensions();
  const CONTAINER_WIDTH = screenWidth * 0.85;

  const renderWeek = useCallback(
    ({ item, index }) => {
      const inputRange = [
        (index - 1) * CONTAINER_WIDTH,
        index * CONTAINER_WIDTH,
        (index + 1) * CONTAINER_WIDTH,
      ];

      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0],
        extrapolate: "clamp",
      });

      const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0.9, 1, 0.9],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={{
            width: CONTAINER_WIDTH,
            opacity,
            transform: [{ scale }],
          }}
          className="py-2"
        >
          <View className="gap-4">
            {/* First row - Monday to Wednesday */}
            <View className="w-full h-[110px] flex flex-row justify-between">
              {item.days.slice(0, 3).map((day) => {
                const dayData = item.data[day];
                const hasActivity = dayData.scheduledActivities.length > 0;

                return (
                  <Day
                    key={day}
                    day={dayTranslations[day]}
                    sessions={
                      hasActivity ? dayData.scheduledActivities : "restDay"
                    }
                    coach={coach}
                    currentWeekIndex={currentWeekIndex}
                  />
                );
              })}
            </View>

            {/* Second row - Thursday to Saturday */}
            <View className="w-full h-[110px] flex flex-row justify-between">
              {item.days.slice(3, 6).map((day) => {
                const dayData = item.data[day];
                const hasActivity = dayData.scheduledActivities.length > 0;

                return (
                  <Day
                    key={day}
                    day={dayTranslations[day]}
                    sessions={
                      hasActivity ? dayData.scheduledActivities : "restDay"
                    }
                    coach={coach}
                    currentWeekIndex={currentWeekIndex}
                  />
                );
              })}
            </View>
          </View>
        </Animated.View>
      );
    },
    [CONTAINER_WIDTH, currentWeekIndex, coach]
  );

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        const newIndex = Math.round(
          event.nativeEvent.contentOffset.x / CONTAINER_WIDTH
        );
        if (newIndex !== currentWeekIndex) {
          setCurrentWeekIndex(newIndex);
        }
      },
    }
  );

  const scrollToIndex = useCallback(
    (index) => {
      flatListRef.current?.scrollToOffset({
        offset: index * CONTAINER_WIDTH,
        animated: true,
      });
    },
    [CONTAINER_WIDTH]
  );

  const handlePrevWeek = () => {
    if (currentWeekIndex > 0) {
      scrollToIndex(currentWeekIndex - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < sortedWeeks.length - 1) {
      scrollToIndex(currentWeekIndex + 1);
    }
  };

  const flatListData = sortedWeeks.map((week) => ({
    key: week,
    data: calendarData[week],
    days: Object.keys(calendarData[week]),
  }));

  const formatDateRange = (dateRange) => {
    const [start, end] = dateRange.split("-");
    return `${start} - ${end}`;
  };

  // Set initial scroll position after component mount
  useEffect(() => {
    if (flatListRef.current && initialWeekIndex !== -1) {
      flatListRef.current.scrollToOffset({
        offset: initialWeekIndex * CONTAINER_WIDTH,
        animated: false,
      });
    }
  }, []);

  useEffect(() => {
    console.log(currentWeekIndex);
  }, [currentWeekIndex]);

  return (
    <View className="h-[280] w-[85%] self-center flex gap-4 items-center">
      <View
        style={{
          height: 250,
          overflow: "visible",
        }}
        className="w-full"
      >
        <Animated.FlatList
          ref={flatListRef}
          data={flatListData}
          renderItem={renderWeek}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          snapToInterval={CONTAINER_WIDTH}
          decelerationRate="fast"
          bounces={false}
          getItemLayout={useCallback(
            (_, index) => ({
              length: CONTAINER_WIDTH,
              offset: CONTAINER_WIDTH * index,
              index,
            }),
            [CONTAINER_WIDTH]
          )}
          contentContainerStyle={{
            alignItems: "center",
          }}
          style={{
            overflow: "visible",
          }}
        />
      </View>

      <View className="flex flex-row items-center">
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
