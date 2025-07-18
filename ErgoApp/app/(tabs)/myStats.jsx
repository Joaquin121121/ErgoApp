import { useContext, useEffect, useState } from "react";
import { View, Text, Image, ScrollView } from "react-native";

import StreakDisplay from "../../components/athlete/home/StreakDisplay";
import icons from "../../scripts/icons.js";
import CustomFlatlist from "../../components/CustomFlatlist.jsx";
import AthleteProfile from "../../components/athlete/home/AthleteProfile.jsx";
import ProgressToTarget from "../../components/athlete/home/ProgressToTarget.jsx";
import ProgressDisplay from "../../components/ProgressDisplay.jsx";
import StatsDisplay from "../../components/StatsDisplay.jsx";
import TargetDisplay from "../../components/TargetDisplay.jsx";

const MyStats = () => {
  const [currentItem, setCurrentItem] = useState(0);
  const [currentItemBottom, setCurrentItemBottom] = useState(0);
  const { user } = useContext(UserContext);

  const flatlistData = Object.keys(user.gamificationFeatures).map((e, i) => ({
    key: i.toString(),
    data: user.gamificationFeatures[e],
  }));

  const components = [
    <ProgressToTarget />,
    <AthleteProfile />,
    <StreakDisplay gamificationFeatures={user.gamificationFeatures} />,
  ];

  const names = ["Objetivo", "Perfil de Atleta", "Racha"];

  const [bottomFlatlistData, setBottomFlatlistData] = useState([]);
  const [bottomComponents, setBottomComponents] = useState([]);
  const initialBottomNames = ["Mi Progreso", "Mis Estadísticas"];
  const [bottomNames, setBottomNames] = useState(initialBottomNames);

  const renderCarouselItem = (item) => components[item.key];
  const renderCarouselItemBottom = (item) => bottomComponents[item.key];

  const handleItemChange = (index) => setCurrentItem(index);
  const handleItemChangeBottom = (index) => setCurrentItemBottom(index);

  useEffect(() => {
    const targetsPerPage = 3;
    const targetDisplays = [];

    for (let i = 0; i < user.targets.length; i += targetsPerPage) {
      targetDisplays.push({
        key: targetDisplays.length.toString(),
        component: <TargetDisplay start={i} finish={i + targetsPerPage} />,
      });
      bottomNames.push("Mis Objetivos");
    }

    setBottomFlatlistData([
      { key: "0", data: "" },
      { key: "1", data: "" },
      ...targetDisplays.map((item, index) => ({
        key: (index + 2).toString(),
        data: item.component,
      })),
    ]);

    setBottomComponents([
      <ProgressDisplay />,
      <StatsDisplay />,
      ...targetDisplays.map((item) => item.component),
    ]);

    setBottomNames(initialBottomNames);
  }, [user.targets]);

  return (
    <ScrollView>
      <View className="flex flex-row mt-20 w-full self-center justify-start pl-4">
        <View className="flex flex-row gap-4 items-center">
          <Text className="font-pregular text-h2">Hola {user.fullName}!</Text>
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
