import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import OutlinedButton from "../../components/OutlinedButton";
import TonalButton from "../../components/TonalButton";
import TrainingSession from "../../components/TrainingSession";
import CustomFlatlist from "../../components/CustomFlatlist";
import { RelativePathString, router } from "expo-router";
import { useUser } from "../../contexts/UserContext";
import { Athlete } from "../../types/Athletes";
import { getCurrentDayName } from "../../utils/utils";
import { DayName } from "../../types/trainingPlan";

const Train = () => {
  const { userData } = useUser();
  const athleteData = userData as Athlete;

  const [currentItem, setCurrentItem] = useState(0);
  const handleItemChange = (index: number) => {
    setCurrentItem(index);
  };

  const currentDay: DayName = getCurrentDayName();

  const currentSession = athleteData?.currentTrainingPlan?.sessions.find(
    (session) => session.days.includes(currentDay)
  );

  const components = athleteData?.currentTrainingPlan?.sessions.map(
    (session) => <TrainingSession session={session} />
  );

  const flatlistData = athleteData?.currentTrainingPlan?.sessions.map(
    (session, index) => ({
      key: index,
    })
  );

  const renderCarouselItem = (item: any) => components?.[item.key] || null;

  return (
    <ScrollView className="mt-20">
      <View className="pl-4">
        <Text className="font-pregular text-h3 mt-8">
          Entrenamiento del Día
        </Text>
        <View className="shadow-sm w-[90vw] bg-white rounded-2xl mt-2">
          {currentSession ? (
            <>
              <Text className="text-secondary text-2xl mt-4 mb-8 text-center">
                {currentSession.name}
              </Text>

              <View className="flex flex-row w-full justify-around mb-4">
                <OutlinedButton
                  customIcon="plan"
                  title="Ver Plan"
                  containerStyles="w-[40%]"
                  onPress={() => {
                    router.push(
                      `/viewPlan?sessionId=${currentSession?.id}` as RelativePathString
                    );
                  }}
                />
                <TonalButton
                  customIcon="dumbbell"
                  title="Entrenar"
                  containerStyles="w-[40%]"
                  onPress={() =>
                    router.push(
                      `/prePoll?sessionId=${currentSession?.id}` as RelativePathString
                    )
                  }
                />
              </View>
            </>
          ) : (
            <>
              <Text className="self-center text-2xl mt-4">Descanso</Text>
              <Text className="self-center text-16 text-darkGray px-4 mb-8 mt-2">
                No hay entrenamiento programado para hoy
              </Text>
            </>
          )}
        </View>
        <Text className="font-pregular text-h3 mt-8">Mis Entrenamientos</Text>
      </View>
      <View className="pl-1">
        <CustomFlatlist
          data={flatlistData || []}
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

export default Train;
