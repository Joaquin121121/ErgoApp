import { View, Text } from "react-native";
import React from "react";
import ProgressDonut from "../../ProgressDonut";
import { TouchableOpacity } from "react-native";

const ProgressToTarget = () => {
  return (
    <View className="shadow-sm w-[85vw] self-center h-40 bg-white rounded-xl flex flex-row ">
      <View className="w-[40%] h-full flex justify-center items-end">
        <ProgressDonut progress={75} size={120} strokeWidth={10} />
      </View>
      <View className="w-[60%] h-full flex justify-center items-center">
        <Text className="font-pregular text-darkGray text-16">
          de progreso{"\n"}hacia tu{" "}
          <Text className="text-secondary font-pregular text-16">objetivo</Text>
        </Text>
      </View>
    </View>
  );
};

export default ProgressToTarget;
