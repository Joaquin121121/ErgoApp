import { View, Text, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
import CustomFlatlist from "../components/CustomFlatlist";
import CoachDisplay from "../components/CoachDisplay";

const MyMessages = () => {
  const { coaches } = useContext(ChatContext);
  const [activeIndex, setActiveIndex] = useState(0);

  const flatlistData = Object.values(coaches).map((e, i) => {
    return { data: e.name, key: i.toString() };
  });

  const renderItem = (item) => <CoachDisplay name={item.data} />;
  return (
    <ScrollView>
      <View className="mt-20 w-full self-center pl-4">
        <Text className="font-pregular text-h2">Mensajes</Text>
        <Text className="mt-2 font-plight text-16">
          Te hiciste algún estudio?
        </Text>
        <Text className="text-secondary font-plight text-16 mb-4">
          Contale a tu coach
        </Text>
      </View>
      <CustomFlatlist
        data={flatlistData}
        renderContent={renderItem}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        height={310}
      />
    </ScrollView>
  );
};

export default MyMessages;
