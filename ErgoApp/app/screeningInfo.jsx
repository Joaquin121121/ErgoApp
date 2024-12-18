import { View, Text, ScrollView } from "react-native";
import React from "react";

const ScreeningInfo = () => {
  return (
    <ScrollView>
      <View className="w-full self-center justify-start">
        <Text className="text-2xl font-pregular mt-8 self-center">
          Screening
        </Text>
        <Text className="text-2xl font-pregular mt-8 ml-4">Descripción</Text>
        <View className="shadow-sm w-[85vw] self-center h-40 flex items-center justify-center p-4 bg-white rounded-2xl mt-4"></View>
      </View>
    </ScrollView>
  );
};

export default ScreeningInfo;
