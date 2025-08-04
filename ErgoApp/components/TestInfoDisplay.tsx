import { View, Text } from "react-native";
import React from "react";
import { TestMeasures } from "../types/Studies";
import OutlinedButton from "./OutlinedButton";

const TestInfoDisplay = ({
  testInfo,
  onPress,
}: {
  testInfo: TestMeasures;
  onPress: () => void;
}) => {
  return (
    <View className="shadow-sm w-[85vw] self-center h-40 bg-white rounded-2xl flex flex-row items-center  ">
      <View className="flex items-center justify-center w-2/5">
        <Text className="text-secondary text-2xl text-center">
          {testInfo.displayName}
        </Text>
      </View>
      <View className="flex items-center justify-center w-3/5 ">
        <Text className="text-darkGray text-16 my-4 text-center px-2">
          Mide: <Text className="text-tertiary">{testInfo.measures}</Text>
        </Text>
        <OutlinedButton
          title="Ver Info"
          onPress={onPress}
          containerStyles="w-[90%]"
          icon="information-outline"
        />
      </View>
    </View>
  );
};

export default TestInfoDisplay;
