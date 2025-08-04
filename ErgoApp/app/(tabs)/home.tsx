// home.tsx
import React, { useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";

import StreakDisplay from "../../components/athlete/home/StreakDisplay";
import icons from "../../scripts/icons";
import Calendar from "../../components/Calendar";
import CustomFlatlist from "../../components/CustomFlatlist";
import AthleteProfile from "../../components/athlete/home/AthleteProfile";
import ProgressToTarget from "../../components/athlete/home/ProgressToTarget";
import { useUser } from "../../contexts/UserContext";
import { useCalendar } from "../../contexts/CalendarContext";
import { Athlete } from "../../types/Athletes";
import { shortenName } from "../../scripts/utils";
import CurrentWeekPerformance from "../../components/athlete/home/CurrentWeekPerformance";

function Home() {
  const [currentItem, setCurrentItem] = useState<number>(0);
  const { userData, user } = useUser();
  const { calendarData } = useCalendar();
  const athleteData = userData as Athlete;

  // Simplified data structure - just keys since components fetch their own data
  const flatlistData = [{ key: "0" }, { key: "1" }, { key: "2" }];

  const components = [
    <StreakDisplay key="streak" />,
    <CurrentWeekPerformance key="currentWeekPerformance" />,
    <AthleteProfile key="profile" />,
  ];

  const names = ["Racha", "Semana Actual", "Perfil de Atleta"];

  const renderCarouselItem = (item: any): React.ReactNode => {
    const index = parseInt(item.key);
    return components[index];
  };

  const handleItemChange = (index: number): void => {
    setCurrentItem(index);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 8 }}
      bounces={true}
      scrollEventThrottle={16}
      removeClippedSubviews={false}
    >
      <View className="flex flex-row mt-20 w-full self-center justify-start pl-4">
        <View className="flex flex-row gap-4 items-center">
          <Text className="font-pregular text-h2">
            Hola {athleteData?.name ? shortenName(athleteData.name) : "..."}!
          </Text>
          <Image
            resizeMode="contain"
            className="h-10 w-10"
            source={icons.hand}
          />
        </View>
      </View>
      <Text className="font-pregular text-h3 mt-8 ml-4">
        {names[currentItem]}
      </Text>
      <CustomFlatlist
        data={flatlistData}
        renderContent={renderCarouselItem}
        height={160}
        onItemChange={handleItemChange}
        activeIndex={currentItem}
        setActiveIndex={setCurrentItem}
      />
      <Text className="font-pregular text-h3 mt-8 ml-4">Mi Semana</Text>
      {calendarData && <Calendar />}
    </ScrollView>
  );
}

export default Home;
