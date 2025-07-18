import { View, Text } from "react-native";
import React, { useContext } from "react";

import TargetCard from "./TargetCard";

const TargetDisplay = ({ start = 0, finish = 3 }) => {
  const { user, setUser } = useContext(UserContext);
  const colors = ["green", "fire", "blue"];
  return (
    <View
      className={`w-[85vw] h-[300] flex justify-${
        user.targets[finish - 1]
          ? "between"
          : user.targets[finish - 2]
          ? "evenly"
          : "center"
      }`}
    >
      {user.targets.slice(start, finish).map((e, i) => (
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
