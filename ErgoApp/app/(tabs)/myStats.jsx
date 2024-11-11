// home.jsx
import { useContext, useEffect } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import UserContext from "../../contexts/UserContext";
import StreakDisplay from "../../components/athlete/home/StreakDisplay";
import icons from "../../scripts/icons.js";
import CustomFlatlist from "../../components/CustomFlatlist.jsx";
import AthleteProfile from "../../components/athlete/home/AthleteProfile.jsx";
import { useState } from "react";
import ProgressToTarget from "../../components/athlete/home/ProgressToTarget.jsx";
import ProgressDisplay from "../../components/ProgressDisplay.jsx";
import StatsDisplay from "../../components/StatsDisplay.jsx";
import TargetDisplay from "../../components/TargetDisplay.jsx";

const MyStats = () => {
  const [currentItem, setCurrentItem] = useState(0);
  const [currentItemBottom, setCurrentItemBottom] = useState(0);
  const { user, setUser } = useContext(UserContext);

  const flatlistData = Object.keys(user.gamificationFeatures).map((e, i) => ({
    key: i.toString(),
    data: user.gamificationFeatures[e],
  }));

  const bottomFlatlistData = Object.keys(user.gamificationFeatures).map(
    (e, i) => ({
      key: i.toString(),
      data: user.gamificationFeatures[e],
    })
  );

  const components = [
    <ProgressToTarget />,
    <AthleteProfile />,
    <StreakDisplay gamificationFeatures={user.gamificationFeatures} />,
  ];

  const names = ["Objetivo", "Perfil de Atleta", "Racha"];

  const bottomComponents = [
    <ProgressDisplay />,
    <StatsDisplay />,
    <TargetDisplay />,
  ];

  const bottomNames = ["Mi Progreso", "Mis Estadísticas", "Mis Objetivos"];

  const renderCarouselItem = (item) => components[item.key];
  const renderCarouselItemBottom = (item) => bottomComponents[item.key];

  const handleItemChange = (index) => {
    setCurrentItem(index);
  };

  const handleItemChangeBottom = (index) => {
    setCurrentItemBottom(index);
  };

  return (
    <ScrollView>
      <View className="flex flex-row mt-20 w-full self-center justify-start pl-4">
        <View className="flex flex-row gap-4 items-center">
          <Text className="font-pregular text-h2">Hola Aníbal</Text>
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
        {bottomNames[currentItemBottom]}
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
