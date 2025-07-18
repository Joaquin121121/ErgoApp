import { ScrollView, View, Text } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import Movement from "../components/Movement";
import CustomFlatlist from "../components/CustomFlatlist";
import TonalButton from "../components/TonalButton";

const screening = () => {
  const { currentStudyData, setCurrentStudyData } = useContext(CoachContext);

  const [activeIndex, setActiveIndex] = useState(0);

  const data = currentStudyData.movements
    ? Array.from({ length: currentStudyData.movements.length }, (_, i) => ({
        key: i,
      }))
    : [];

  const renderItem = (item) => <Movement index={item.key} />;

  useEffect(() => {
    console.log(currentStudyData);
  }, []);

  return (
    <View>
      <Text className="text-3xl font-pregular self-center mt-4">Screening</Text>
      <Text className="text-2xl font-pregular mt-8 ml-4">
        {" "}
        Criterios de Evaluación
      </Text>
      <CustomFlatlist
        data={data}
        renderContent={renderItem}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        height={480}
      />
      <TonalButton
        containerStyles="self-center mt-8"
        title="Finalizar"
        icon="checkWhite"
      />
    </View>
  );
};

export default screening;
