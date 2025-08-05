import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { shortenName } from "../../scripts/utils";
import { useUser } from "../../contexts/UserContext";
import { Athlete } from "../../types/Athletes";
import Icon from "../../components/Icon";
import CustomFlatlist from "../../components/CustomFlatlist";
import TestPreview from "../../components/TestPreview";
import icons from "../../scripts/icons";
import { getTestsForAthlete } from "../../utils/utils";
import { testInfo } from "../../types/Studies";
import TestInfoDisplay from "../../components/TestInfoDisplay";
import { router } from "expo-router";

const MyTests = () => {
  const { userData } = useUser();
  const athleteData = userData as Athlete | null;

  const [currentItemTestPreview, setCurrentItemTestPreview] = useState(0);
  const [currentItemTestInfo, setCurrentItemTestInfo] = useState(0);

  const testPreviewFlatlistData =
    athleteData?.completedStudies && athleteData.completedStudies.length > 0
      ? getTestsForAthlete(athleteData.completedStudies)
      : [
          {
            key: "noTests",
            data: false,
          },
        ];

  const testInfoData = Object.entries(testInfo).map(([key, value]) => {
    return { key, data: value };
  });

  const handleItemChangeTestPreview = (index: number): void =>
    setCurrentItemTestPreview(index);

  const renderCarouselItemTestPreview = (item: any) => {
    if (typeof item.data === "boolean" || !item.data || item.data.length === 0)
      return (
        <View className="w-[85vw] h-[300] rounded-2xl shadow-sm self-center bg-white flex items-center justify-center relative overflow-hidden">
          <Text className="text-xl text-secondary">
            No hay tests completados
          </Text>
        </View>
      );
    return (
      <TestPreview
        tests={item}
        onPress={() => {
          router.push(`/testInfoDisplay?testType=${item.key}`);
        }}
      />
    );
  };

  const handleItemChangeTestInfo = (index: number): void =>
    setCurrentItemTestInfo(index);

  const renderCarouselItemTestInfo = (item: any) => {
    return (
      <TestInfoDisplay
        testInfo={item.data}
        onPress={() => router.push(`/testInfo?testType=${item.key}`)}
      />
    );
  };
  return (
    <ScrollView>
      <View className="flex mt-20 w-full self-center justify-start ">
        <View className="flex flex-row gap-4 items-center pl-4">
          <Text className="font-pregular text-h2">
            Hola {athleteData?.name ? shortenName(athleteData.name) : "..."}!
          </Text>
          <Image
            resizeMode="contain"
            className="h-10 w-10"
            source={icons.hand}
          />
        </View>
        <Text className="font-pregular text-h3 mt-8 ml-4">Mis Tests</Text>
        <CustomFlatlist
          data={testPreviewFlatlistData}
          renderContent={renderCarouselItemTestPreview}
          height={300}
          onItemChange={handleItemChangeTestPreview}
          activeIndex={currentItemTestPreview}
          setActiveIndex={setCurrentItemTestPreview}
        />
        <Text className="font-pregular text-h3 mt-8 ml-4">
          Tests Disponibles
        </Text>
        <CustomFlatlist
          data={testInfoData}
          renderContent={renderCarouselItemTestInfo}
          height={160}
          onItemChange={handleItemChangeTestInfo}
          activeIndex={currentItemTestInfo}
          setActiveIndex={setCurrentItemTestInfo}
        />
      </View>
    </ScrollView>
  );
};

export default MyTests;
