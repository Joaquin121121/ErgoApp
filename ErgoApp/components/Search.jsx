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

const Search = ({
  category,
  title,
  context,
  currentStudy,
  field = "disciplina",
}) => {
  const [search, setSearch] = useState("");
  const { user, setUser } = useContext(UserContext);
  const { classInfo, setClassInfo } = useContext(ClassContext);
  const { coachInfo, setCoachInfo, currentStudyData, setCurrentStudyData } =
    useContext(CoachContext);

  const contexts = {
    user: { get: user, set: setUser },
    class: { get: classInfo, set: setClassInfo },
    coach: { get: coachInfo, set: setCoachInfo },
  };
  const [selectedOption, setSelectedOption] = useState(
    currentStudy ? "" : contexts[context].get[title]
  );

  const getOptions = () => {
    if (currentStudy) {
      if (currentStudy === "screening") {
        return currentStudyData.availableMovements;
      }
    }
    return categories?.[category];
  };

  const options = getOptions();

  const onPress = ({ i }) => {
    if (currentStudy) {
      if (currentStudy === "screening") {
        console.log(options[i]);
        setCurrentStudyData({
          ...currentStudyData,
          availableMovements: currentStudyData.availableMovements.filter(
            (e) => e !== options[i]
          ),
        });
      }
    } else {
      contexts[context].set({
        ...contexts[context].get,
        [title]: e,
      });
    }
    router.back();
  };

  useEffect(() => {
    console.log(currentStudy, currentStudyData.availableMovements);
  }, []);
  return (
    <ScrollView>
      <View className="w-full self-center justify-start pl-4 mb-8">
        <FormField
          placeholder={`Buscar ${field}...`}
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
                i === options.length - 1 && i !== 0 ? "border-b-0" : ""
              }`}
              onPress={() => onPress({ i })}
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
