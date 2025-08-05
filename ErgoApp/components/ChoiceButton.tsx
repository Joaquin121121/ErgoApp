import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const ChoiceButton = ({
  text,
  onPress,
  selected,
  outlineColor = "#e81d23",
  backgroundColor = "#FFC1C1",
}: {
  text: string;
  onPress: () => void;
  selected: boolean;
  outlineColor?: string;
  backgroundColor?: string;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className="rounded-2xl flex px-2 py-1 font-light border border-opacity-50 border-1 mx-2"
        style={{
          backgroundColor: selected ? backgroundColor : "transparent",
          borderColor: outlineColor,
        }}
      >
        <Text className="font-pregular" style={{ color: outlineColor }}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChoiceButton;
