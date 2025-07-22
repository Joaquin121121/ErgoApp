// home.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";

import StreakDisplay from "../../components/athlete/home/StreakDisplay";
import icons from "../../scripts/icons.js";
import Calendar from "../../components/Calendar";
import CustomFlatlist from "../../components/CustomFlatlist";
import AthleteProfile from "../../components/athlete/home/AthleteProfile";
import ProgressToTarget from "../../components/athlete/home/ProgressToTarget";
import { useUser } from "../../contexts/UserContext";
import { Athlete, GamificationFeatures } from "../../types/Athletes";
import { shortenName } from "../../scripts/utils";

function Home() {
  const [currentItem, setCurrentItem] = useState<number>(0);
  const { userData } = useUser();
  const athleteData = userData as Athlete;

  // Handle case where gamificationFeatures might be undefined
  const gamificationFeatures = athleteData?.gamificationFeatures || {
    streak: 0,
    targetProgress: 0,
    currentLevel: "Beginner",
  };

  const flatlistData = Object.keys(gamificationFeatures).map((e, i) => ({
    key: i.toString(),
    data: gamificationFeatures[e as keyof GamificationFeatures],
  }));

  const components = [
    <StreakDisplay key="streak" gamificationFeatures={gamificationFeatures} />,
    <ProgressToTarget key="progress" />,
    <AthleteProfile key="profile" />,
  ];

  const names = ["Racha", "Objetivo", "Perfil de Atleta"];

  const renderCarouselItem = (item: any): React.ReactNode => {
    const index = parseInt(item.key);
    return components[index];
  };

  const handleItemChange = (index: number): void => {
    setCurrentItem(index);
  };

  return (
    <ScrollView>
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
      <Calendar />
    </ScrollView>
  );
}

export default Home;
