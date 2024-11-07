// home.jsx
import { useContext, useEffect } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import UserContext from "../../contexts/UserContext";
import StreakDisplay from "../../components/athlete/home/StreakDisplay";
import icons from "../../scripts/icons.js";
import Calendar from "../../components/Calendar.jsx";
import CustomFlatlist from "../../components/CustomFlatlist.jsx";
import AthleteProfile from "../../components/athlete/home/AthleteProfile.jsx";
import { useState } from "react";
import ProgressToTarget from "../../components/athlete/home/ProgressToTarget.jsx";

const Home = () => {
  const [currentItem, setCurrentItem] = useState(0);
  const { user, setUser } = useContext(UserContext);

  const flatlistData = Object.keys(user.gamificationFeatures).map((e, i) => ({
    key: i.toString(),
    data: user.gamificationFeatures[e],
  }));

  const components = [
    <StreakDisplay gamificationFeatures={user.gamificationFeatures} />,
    <ProgressToTarget />,
    <AthleteProfile />,
  ];

  const names = ["Racha", "Objetivo", "Perfil de Atleta"];

  const renderCarouselItem = (item) => components[item.key];

  const handleItemChange = (index) => {
    setCurrentItem(index);
  };

  useEffect(() => {
    setUser({ ...user, character: "Roger" });
  }, []);

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
        height={180}
        onItemChange={handleItemChange}
        activeIndex={currentItem}
        setActiveIndex={setCurrentItem}
      />
      <Text className="font-pregular text-h3 mt-2 mb-4 ml-4">Mi Semana</Text>
      <Calendar />
    </ScrollView>
  );
};

export default Home;
