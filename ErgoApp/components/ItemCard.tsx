import React from "react";
import { View, Text } from "react-native";

interface ItemCardProps {
  percentage: string;
  label: string;
  color: "blue" | "green";
}

const ItemCard: React.FC<ItemCardProps> = ({ percentage, label, color }) => {
  const colorClasses = {
    blue: "border-blue text-blue",
    green: "border-green text-green",
  };

  return (
    <View
      className={`shadow-sm self-center mt-4 border-${color} border-2 border-t-[10px] h-24 w-[90%] rounded-2xl flex flex-row items-center`}
    >
      <Text
        className={`text-3xl ${colorClasses[color]} font-psemibold w-1/3 text-center`}
      >
        {percentage}
      </Text>
      <Text
        className={`${colorClasses[color]} text-16 font-psemibold w-2/3 text-center px-2`}
      >
        {label}
      </Text>
    </View>
  );
};

export default ItemCard;
