import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { categories } from "../scripts/categories";
import UserContext from "../contexts/UserContext";
import ClassContext from "../contexts/ClassContext";
import CoachContext from "../contexts/CoachContext";
import { router } from "expo-router";
import FormField from "./FormField";
import icons from "../scripts/icons";
import { containsText } from "../scripts/utils";

const Search = ({ category, title, context }) => {
  const [search, setSearch] = useState("");
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

  const options = categories[category];

  useEffect(() => {
    console.log(options);
  }, []);
  return (
    <ScrollView>
      <View className="w-full self-center justify-start pl-4 mb-8">
        <FormField
          placeholder="Buscar disciplina..."
          value={search}
          handleChangeText={(e) => setSearch(e)}
          otherStyles="self-center  w-[90vw] mb-4"
          icon="search"
        />
        {options
          .filter((e) => containsText(e, search))
          .map((e, i) => (
            <TouchableOpacity
              key={i}
              className={`border border-gray border-r-0 border-l-0 border-t-0 w-[95%] h-12 border-opacity-20 flex justify-center ${
                i === options.length - 1 ? "border-b-0" : ""
              }`}
              onPress={() => {
                contexts[context].set({
                  ...contexts[context].get,
                  [title]: e,
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
    </ScrollView>
  );
};

export default Search;
