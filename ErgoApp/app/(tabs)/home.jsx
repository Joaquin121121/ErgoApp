// home.jsx
import { useContext, useEffect } from "react";
import { View, Text, Image, ScrollView } from "react-native";

import StreakDisplay from "../../components/athlete/home/StreakDisplay";
import icons from "../../scripts/icons.js";
import Calendar from "../../components/Calendar";
import CustomFlatlist from "../../components/CustomFlatlist.jsx";
import AthleteProfile from "../../components/athlete/home/AthleteProfile.jsx";
import { useState } from "react";
import ProgressToTarget from "../../components/athlete/home/ProgressToTarget.jsx";

const Home = () => {
  const [currentItem, setCurrentItem] = useState(0);
  const { user, setUser } = useContext(UserContext);
  const { coaches } = useContext(ChatContext);

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
    console.log("uid:", auth?.currentUser?.uid);
    console.log("nombre: ", user);
    setUser({
      ...user,
      coaches: [
        "98wr7eNv0XNTV6B9Dr6pl8ZsexA3",
        "9vMZiq6qd3ZdUPH6m5VkDvEi4L42",
        "ca4WWSdGEzQHmvVC3oGYILzwvM52",
      ],
      stats: {
        rsi: {
          currentValue: 2,
          previousValues: [
            { value: 1.5, date: "20/08/2024" },
            { value: 1.2, date: "07/05/2024" },
          ],
          target: 2.4,
        },
        dsi: {
          currentValue: 3.2,
          previousValues: [
            { value: 2.8, date: "20/08/2024" },
            { value: 2.5, date: "07/05/2024" },
          ],
          target: 3.5,
        },
        cmj: {
          currentValue: 45.6,
          previousValues: [
            { value: 44.2, date: "20/08/2024" },
            { value: 43.8, date: "07/05/2024" },
          ],
          target: 48.0,
        },
        explosividad: {
          currentValue: 82,
          previousValues: [
            { value: 78, date: "20/08/2024" },
            { value: 75, date: "07/05/2024" },
          ],
          target: 88,
        },
        resistencia: {
          currentValue: 77,
          previousValues: [
            { value: 73, date: "20/08/2024" },
            { value: 70, date: "07/05/2024" },
          ],
          target: 85,
        },
        fuerza: {
          currentValue: 85,
          previousValues: [
            { value: 82, date: "20/08/2024" },
            { value: 79, date: "07/05/2024" },
          ],
          target: 90,
        },
        agilidad: {
          currentValue: 88,
          previousValues: [
            { value: 85, date: "20/08/2024" },
            { value: 82, date: "07/05/2024" },
          ],
          target: 92,
        },
        salto: {
          currentValue: 79,
          previousValues: [
            { value: 75, date: "20/08/2024" },
            { value: 72, date: "07/05/2024" },
          ],
          target: 85,
        },
        balance: {
          currentValue: 85,
          previousValues: [
            { value: 85, date: "20/08/2024" },
            { value: 77, date: "07/05/2024" },
          ],
          target: 87,
        },
      },
    });
  }, []);

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
      <Text className="font-pregular text-h3 mt-8 ml-4">Mi Semana</Text>
      <Calendar />
    </ScrollView>
  );
};

export default Home;
