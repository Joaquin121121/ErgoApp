import { View, Text, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../scripts/icons";
import { router } from "expo-router";
import UserContext from "../contexts/UserContext";

const Choice = ({ options, title }) => {
  const { user, setUser } = useContext(UserContext);
  const [selectedOption, setSelectedOption] = useState(user[title]);

  return (
    <View className="flex items-end justify-center w-full bg-white ">
      {options.map((e, i) => (
        <TouchableOpacity
          key={i}
          className={`border border-gray border-r-0 border-l-0 border-t-0 w-[95%] h-12 border-opacity-20 flex justify-center ${
            i === options.length - 1 ? "border-b-0" : ""
          }`}
          onPress={() => {
            setUser({ ...user, [title]: options[i] });
            router.back();
          }}
        >
          <Text className="text-lg">{e}</Text>
          {selectedOption === options[i] && (
            <Image
              source={icons.check}
              className="absolute right-5  h-8 w-8"
              resizeMode="contain"
            ></Image>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Choice;
