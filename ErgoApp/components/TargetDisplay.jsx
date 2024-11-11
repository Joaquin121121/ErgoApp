import { View, Text } from "react-native";
import React, { useContext } from "react";
import UserContext from "../contexts/UserContext";
import TargetCard from "./TargetCard";

const TargetDisplay = () => {
  const { user, setUser } = useContext(UserContext);
  const colors = ["green", "fire", "blue"];
  return (
    <View className="w-[85vw] h-[300] flex justify-between">
      {user.targets.map((e, i) => (
        <TargetCard
          name={e.name}
          target={e.target}
          current={e.current}
          color={colors[i]}
        />
      ))}
    </View>
  );
};

export default TargetDisplay;
