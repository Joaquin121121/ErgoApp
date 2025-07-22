import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { RelativePathString, router } from "expo-router";

import StreakDisplay from "../../components/athlete/home/StreakDisplay";
import icons from "../../scripts/icons.js";
import CustomFlatlist from "../../components/CustomFlatlist";
import AthleteProfile from "../../components/athlete/home/AthleteProfile";
import ProgressToTarget from "../../components/athlete/home/ProgressToTarget";
import ProgressDisplay from "../../components/ProgressDisplay.jsx";
import StatsDisplay from "../../components/StatsDisplay.jsx";
import { Athlete, GamificationFeatures } from "../../types/Athletes";
import TargetDisplay from "../../components/TargetDisplay.jsx";
import { useUser } from "../../contexts/UserContext";

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

  // Return loading state if no athlete data
  if (!athleteData) {
    return (
      <View className="flex-1 justify-center items-center mt-20">
        <Text className="font-pregular text-h2">Cargando estadísticas...</Text>
      </View>
    );
  }

  const gamificationFeatures: GamificationFeatures =
    athleteData.gamificationFeatures || {
      streak: 0,
      targetProgress: 0,
      currentLevel: "Beginner",
    };

  const flatlistData: FlatlistDataItem[] = Object.keys(
    gamificationFeatures
  ).map((e, i) => ({
    key: i.toString(),
    data: gamificationFeatures[e as keyof GamificationFeatures],
  }));

  const components: React.ReactElement[] = [
    <ProgressToTarget key="progress-target" />,
    <AthleteProfile key="athlete-profile" />,
    <StreakDisplay
      key="streak-display"
      gamificationFeatures={gamificationFeatures}
    />,
  ];

  const names: string[] = ["Objetivo", "Perfil de Atleta", "Racha"];

  const [bottomFlatlistData, setBottomFlatlistData] = useState<
    FlatlistDataItem[]
  >([]);
  const [bottomComponents, setBottomComponents] = useState<
    React.ReactElement[]
  >([]);
  const initialBottomNames: string[] = ["Mi Progreso", "Mis Estadísticas"];
  const [bottomNames, setBottomNames] = useState<string[]>(initialBottomNames);

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

  useEffect(() => {
    const targetsPerPage = 3;
    const targetDisplays: { key: string; component: React.ReactElement }[] = [];

    // Check if objectives exist and have length
    const objectives = athleteData.objectives || [];

    for (let i = 0; i < objectives.length; i += targetsPerPage) {
      targetDisplays.push({
        key: targetDisplays.length.toString(),
        component: (
          <TargetDisplay
            key={`target-${i}`}
            start={i}
            finish={i + targetsPerPage}
          />
        ),
      });
    }

    const newBottomFlatlistData: FlatlistDataItem[] = [
      { key: "0", data: "" },
      { key: "1", data: "" },
      ...targetDisplays.map((item, index) => ({
        key: (index + 2).toString(),
        data: item.component,
      })),
    ];

    const newBottomComponents: React.ReactElement[] = [
      <ProgressDisplay key="progress-display" />,
      <StatsDisplay key="stats-display" />,
      ...targetDisplays.map((item) => item.component),
    ];

    const newBottomNames: string[] = [
      ...initialBottomNames,
      ...targetDisplays.map(() => "Mis Objetivos"),
    ];

    setBottomFlatlistData(newBottomFlatlistData);
    setBottomComponents(newBottomComponents);
    setBottomNames(newBottomNames);
  }, [athleteData.objectives]);

  return (
    <ScrollView>
      <View className="flex flex-row mt-20 w-full self-center justify-start pl-4">
        <View className="flex flex-row gap-4 items-center">
          <Text className="font-pregular text-h2">
            Hola {athleteData.name || "Atleta"}!
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
