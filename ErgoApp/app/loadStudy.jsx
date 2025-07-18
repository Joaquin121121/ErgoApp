import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { categories } from "../scripts/categories";
import { containsText } from "../scripts/utils";
import Icon from "../components/Icon";
import FormField from "../components/FormField";
import TonalButton from "../components/TonalButton";
import { router } from "expo-router";

const loadStudy = () => {
  const [search, setSearch] = useState("");
  const studies = categories.studies;

  const onPress = (name) => {
    router.push(name + "Info");
  };

  return (
    <ScrollView>
      <View className="w-full self-center justify-start">
        <Text className="text-2xl font-pregular mt-8 self-center">
          Cargar Estudios
        </Text>
        <FormField
          placeholder="Buscar estudio..."
          value={search}
          handleChangeText={(e) => setSearch(e)}
          otherStyles="self-center w-[90vw] mb-8"
          icon="search"
        />
        {studies
          .filter((athlete) => containsText(athlete.name, search))
          .map((e) => (
            <TouchableOpacity onPress={() => onPress(e.value)}>
              <View className="self-center mb-4 bg-white w-[85vw] rounded-2xl shadow-sm">
                <Text className="font-pregular text-h3 self-center mt-2 mb-4">
                  {e.name}
                </Text>
                <View className="flex flex-row  items-start mb-4">
                  <View className="flex items-center overflow-hidden justify-center h-20 w-20 rounded-full ml-4 mr-8">
                    <Icon icon={e.value} size={80} style="mt-4" />
                  </View>
                  <View className="flex items-start">
                    <View className="flex flex-row justify-evenly items-center mb-2">
                      <Icon icon="timer" />
                      <Text className="font-pregular text-sm text-darkGray ml-2">
                        {e.duration}
                      </Text>
                    </View>

                    <View className="flex flex-row justify-evenly items-center mb-2">
                      <Icon icon="tools" />
                      <Text className="font-pregular text-sm text-darkGray ml-2">
                        {e.equipment}
                      </Text>
                    </View>
                    <View className="flex flex-row justify-evenly items-center mb-2">
                      <Icon icon="lightbulb" />
                      <Text className="font-pregular text-sm text-darkGray ml-2">
                        {e.focus}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );
};

export default loadStudy;
