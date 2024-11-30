import { View, Text, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../scripts/icons";
import { router } from "expo-router";
import UserContext from "../contexts/UserContext";
import ClassContext from "../contexts/ClassContext";
import CoachContext from "../contexts/CoachContext";
const Choice = ({ options, title, context = "user" }) => {
  const { user, setUser } = useContext(UserContext);
  const { classInfo, setClassInfo } = useContext(ClassContext);
  const { coachInfo, setCoachInfo } = useContext(CoachContext);

  const contexts = {
    user: { get: user, set: setUser },
    class: { get: classInfo, set: setClassInfo },
    coach: { get: coachInfo, set: setCoachInfo },
  };
  const [selectedOption, setSelectedOption] = useState(
    contexts[context].get[title]
  );

  useEffect(() => {
    console.log("title:", title);
  }, [title]);

  return (
    <View className="flex items-end justify-center w-full bg-white ">
      {options.map((e, i) => (
        <TouchableOpacity
          key={i}
          className={`border border-gray border-r-0 border-l-0 border-t-0 w-[95%] h-12 border-opacity-20 flex justify-center ${
            i === options.length - 1 ? "border-b-0" : ""
          }`}
          onPress={() => {
            contexts[context].set({
              ...contexts[context].get,
              [title]: options[i],
            });
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
