import { View, Text, ScrollView, Image } from "react-native";
import React, { useContext, useState } from "react";
import UserContext from "../../contexts/UserContext";
import icons from "../../scripts/icons";
import CustomFlatlist from "../../components/CustomFlatlist";
import ActivityDetailed from "../../components/ActivityDetailed";
import TonalButton from "../../components/TonalButton";
import { router } from "expo-router";
import CoachContext from "../../contexts/CoachContext";

const coachClasses = () => {
  const { coachInfo } = useContext(CoachContext);
  const [activeIndex, setActiveIndex] = useState(0);

  const flatlistData = coachInfo.classes
    ? Array.from({ length: coachInfo.classes.length }, (_, i) => ({ key: i }))
    : [];

  const renderActivities = (activity) => (
    <ActivityDetailed index={activity?.key} />
  );
  return (
    <ScrollView>
      <View className="mt-20 w-full self-center justify-start pl-4">
        <View className="flex flex-row gap-4 items-center">
          <Text className="font-pregular text-h2">
            Hola {coachInfo.fullName.split(" ")[0]}!
          </Text>
          <Image
            resizeMode="contain"
            className="h-10 w-10"
            source={icons.hand}
          />
        </View>
      </View>
      <Text className="text-2xl font-pregular mt-8 ml-4">Mis Clases</Text>
      <CustomFlatlist
        data={flatlistData}
        renderContent={renderActivities}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        height={460}
      />
      <TonalButton
        title="Crear Clase"
        containerStyles="self-center mt-6"
        icon="add"
        onPress={() => {
          router.push("addClass");
        }}
      />
    </ScrollView>
  );
};

export default coachClasses;
