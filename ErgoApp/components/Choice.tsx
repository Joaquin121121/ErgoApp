import { View, Text, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../scripts/icons";
import { router } from "expo-router";

import { categories } from "../scripts/categories";
import { useUser } from "../contexts/UserContext";
import { Athlete } from "../types/Athletes.js";
import { Coach } from "../types/Coach.js";
import { getPropertyValue } from "../utils/utils";

const Choice = ({
  category,
  title,
  context = "user",
}: {
  category: string;
  title: string;
  context?: string;
}) => {
  const { userData, setUserData } = useUser();
  const contexts: Record<
    string,
    {
      get: Athlete | Coach | null;
      set: React.Dispatch<React.SetStateAction<Athlete | Coach | null>>;
    }
  > = {
    user: { get: userData, set: setUserData },
  };

  const [selectedOption, setSelectedOption] = useState(
    getPropertyValue(contexts[context].get, title)
  );

  const options = (categories as any)[category] || [];

  return (
    <View className="flex items-end justify-center w-full bg-white ">
      {options.map((e: any, i: number) => (
        <TouchableOpacity
          key={i}
          className={`border border-gray border-r-0 border-l-0 border-t-0 w-[95%] h-12 border-opacity-20 flex justify-center ${
            i === options.length - 1 ? "border-b-0" : ""
          }`}
          onPress={() => {
            const currentData = contexts[context].get;
            if (currentData) {
              contexts[context].set({
                ...currentData,
                [title]: options[i],
              } as Athlete | Coach);
            }
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
