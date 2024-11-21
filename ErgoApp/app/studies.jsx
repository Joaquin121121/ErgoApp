import { View, Text, ScrollView } from "react-native";
import React, { useContext } from "react";
import CustomFlatlist from "../components/CustomFlatlist";
import CoachContext from "../contexts/CoachContext";
import StudySummary from "../components/StudySummary";
import TonalButton from "../components/TonalButton";

const studies = () => {
  const { selectedAthlete } = useContext(CoachContext);
  return (
    <ScrollView>
      <Text className="font-pregular text-[28px] ml-4">{selectedAthlete}</Text>
      <Text className="font-pregular mt-4 text-xl ml-4">Estudios</Text>
      <StudySummary />
      <TonalButton
        title="Realizar Estudio"
        icon="add"
        containerStyles="mt-8 self-center"
      />
    </ScrollView>
  );
};

export default studies;
