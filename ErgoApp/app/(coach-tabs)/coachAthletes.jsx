import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import icons from "../../scripts/icons";
import UserContext from "../../contexts/UserContext";
import FormField from "../../components/FormField";
import Icon from "../../components/Icon";
import CoachContext from "../../contexts/CoachContext";
import { router } from "expo-router";
const coachAthletes = () => {
  const { user } = useContext(UserContext);
  const { coachInfo, setSelectedAthlete } = useContext(CoachContext);

  const [search, setSearch] = useState("");

  const athletes = coachInfo.athletes;

  const onPress = (athlete) => {
    setSelectedAthlete(athlete.name);
    router.push("/athleteInfo");
  };

  return (
    <ScrollView>
      <View className="mt-20 w-full self-center justify-start pl-4">
        <View className="flex flex-row gap-4 items-center">
          <Text className="font-pregular text-h2">Hola {user.fullName}!</Text>
          <Image
            resizeMode="contain"
            className="h-10 w-10"
            source={icons.hand}
          />
        </View>
      </View>
      <FormField
        placeholder="Buscar atleta..."
        value={search}
        handleChangeText={(e) => setSearch(e)}
        otherStyles="self-center  w-[90vw]"
        icon="search"
      />

      <Text className="font-pregular text-darkGray text-16 self-center mt-8 mb-4">
        Toca para ver información
      </Text>
      {athletes
        .filter((athlete) =>
          athlete.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((e) => (
          <TouchableOpacity onPress={() => onPress(e)}>
            <View className="self-center mb-4 bg-white w-[85vw] rounded-2xl shadow-sm">
              <Text className="font-pregular text-h3 self-center mt-2 mb-4">
                {e.name}
              </Text>
              <View className="flex flex-1 flex-row justify-evenly items-start mb-4">
                <View className="flex items-center overflow-hidden justify-center h-20 w-20 rounded-full">
                  <Icon icon={e.character} size={80} style="mt-4" />
                </View>
                <View>
                  <Text className="font-pregular text-sm text-darkGray mb-2">
                    - {e.age} años
                  </Text>
                  <Text className="font-pregular text-sm text-darkGray mb-2">
                    - {e.sport}
                  </Text>
                  <Text className="font-pregular text-sm text-darkGray mb-2">
                    - {e.category}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

export default coachAthletes;
