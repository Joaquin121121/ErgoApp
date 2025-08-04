import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { RelativePathString, router } from "expo-router";

import StreakDisplay from "../../components/athlete/home/StreakDisplay";
import icons from "../../scripts/icons";
import CustomFlatlist from "../../components/CustomFlatlist";
import AthleteProfile from "../../components/athlete/home/AthleteProfile";
import ProgressToTarget from "../../components/athlete/home/ProgressToTarget";
import { Athlete } from "../../types/Athletes";
import TargetDisplay from "../../components/TargetDisplay.jsx";
import { useUser } from "../../contexts/UserContext";
import WellnessDisplay from "../../components/WellnessDisplay";
import TestStatsDisplay from "../../components/TestStatsDisplay";
import { shortenName } from "../../scripts/utils";

interface FlatlistDataItem {
  key: string | number;
  data?: any;
}

const MyStats = () => {
  const [currentItem, setCurrentItem] = useState(0);
  const [currentItemBottom, setCurrentItemBottom] = useState(0);
  const { userData } = useUser();

  // Safely cast userData to Athlete with null check
  const athleteData = userData as Athlete | null;

  const [bottomFlatlistData, setBottomFlatlistData] = useState<
    FlatlistDataItem[]
  >([]);
  const [bottomComponents, setBottomComponents] = useState<
    React.ReactElement[]
  >([]);

  useEffect(() => {
    if (!athleteData) return;
    const targetsPerPage = 3;
    const targetDisplays: { key: string; component: React.ReactElement }[] = [];

    // Check if objectives exist and have length
    const objectives = athleteData.objectives || [];

    const newBottomFlatlistData: FlatlistDataItem[] = [
      { key: "0", data: "" },
      { key: "1", data: "" },
      ...targetDisplays.map((item, index) => ({
        key: (index + 2).toString(),
        data: item.component,
      })),
    ];

    const newBottomComponents: React.ReactElement[] = [
      <TestStatsDisplay key="stats-display" />,
      ...targetDisplays.map((item) => item.component),
    ];

    setBottomFlatlistData(newBottomFlatlistData);
    setBottomComponents(newBottomComponents);
  }, [athleteData]);

  if (!athleteData) {
    return (
      <View className="flex-1 justify-center items-center mt-20">
        <Text>Cargando estadisticas...</Text>
      </View>
    );
  }

  // Simplified data structure - just keys since components fetch their own data
  const flatlistData: FlatlistDataItem[] = [
    { key: "0" },
    { key: "1" },
    { key: "2" },
  ];

  const components: React.ReactElement[] = [
    <WellnessDisplay key="sleep" section="sleep" />,
    <WellnessDisplay key="nutrition" section="nutrition" />,
    <WellnessDisplay key="fatigue" section="fatigue" />,
  ];

  const names: string[] = ["Sueño", "Nutrición", "Fatiga"];

  const bottomNames = [
    <Text>
      Estadísticas - <Text className="text-secondary">Tests</Text>
    </Text>,
    <Text>
      Estadísticas - <Text className="text-secondary">Ejercicios</Text>
    </Text>,
    <Text>Mis Objetivos</Text>,
  ];
  const renderCarouselItem = (item: any): React.ReactNode => {
    const index = parseInt(item.key.toString());
    return components[index] || <View key={`empty-${index}`} />;
  };

  const renderCarouselItemBottom = (item: any): React.ReactNode => {
    const index = parseInt(item.key.toString());
    return bottomComponents[index] || <View key={`empty-bottom-${index}`} />;
  };

  const handleItemChange = (index: number): void => setCurrentItem(index);
  const handleItemChangeBottom = (index: number): void =>
    setCurrentItemBottom(index);

  return (
    <ScrollView>
      <View className="flex mt-20 w-full self-center justify-start pl-4">
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
      <Text className="font-pregular text-h3 mt-8 ml-4">
        {bottomNames[currentItemBottom] || "Estadísticas"}
      </Text>
      <CustomFlatlist
        data={bottomFlatlistData}
        renderContent={renderCarouselItemBottom}
        height={300}
        onItemChange={handleItemChangeBottom}
        activeIndex={currentItemBottom}
        setActiveIndex={setCurrentItemBottom}
      />
    </ScrollView>
  );
};

export default MyStats;
