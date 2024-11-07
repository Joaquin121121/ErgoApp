import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import OutlinedButton from "../../components/OutlinedButton";
import TonalButton from "../../components/TonalButton";
import TrainingSession from "../../components/TrainingSession";
import CustomFlatlist from "../../components/CustomFlatlist";
import { router } from "expo-router";
const train = () => {
  const flatlistData = [{ key: 0 }, { key: 1 }, { key: 2 }];

  const components = [
    <TrainingSession />,
    <TrainingSession />,
    <TrainingSession />,
  ];

  const [currentItem, setCurrentItem] = useState(0);
  const handleItemChange = (index) => {
    setCurrentItem(index);
  };
  const renderCarouselItem = (item) => components[item.key];

  return (
    <ScrollView className="mt-20">
      <View className="pl-4">
        <Text className="font-pregular text-h3 mt-8">
          Entrenamiento del Día
        </Text>
        <View className="shadow-sm w-[90vw] bg-white rounded-2xl mt-2">
          <Text className="font-pregular text-16 text-secondary self-center mt-16">
            Musculación
            <Text className="text-black">{" con Julio Castillo"}</Text>
          </Text>
          <View className="mt-8 flex flex-row w-full justify-around mb-4">
            <OutlinedButton
              icon="plan"
              title="Ver Plan"
              containerStyles="w-[40%]"
            />
            <TonalButton
              icon="dumbbell"
              title="Entrenar"
              containerStyles="w-[40%]"
              onPress={() => router.push("prePoll")}
            />
          </View>
        </View>
        <Text className="font-pregular text-h3 mt-8">Mis Entrenamientos</Text>
      </View>
      <View className="pl-1">
        <CustomFlatlist
          data={flatlistData}
          renderContent={renderCarouselItem}
          height={340}
          onItemChange={handleItemChange}
          activeIndex={currentItem}
          setActiveIndex={setCurrentItem}
          large
        />
      </View>
    </ScrollView>
  );
};

export default train;
