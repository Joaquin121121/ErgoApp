import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import icons from "../scripts/icons";
import OutlinedButton from "../components/OutlinedButton";
import { RelativePathString, router } from "expo-router";
import TonalButton from "../components/TonalButton";
import ImageUploadButton from "../components/ImageUploadButton.jsx";
import Icon from "../components/Icon";
import { useUser } from "../contexts/UserContext";
import { Athlete } from "../types/Athletes";
import { getAge } from "../utils/utils";
import { formattedDisciplines } from "../constants/data";

const myProfile = () => {
  const characters = [
    { name: "Roger", key: 0 },
    { name: "Emily", key: 1 },
    { name: "Luke", key: 2 },
    { name: "Sophie", key: 3 },
  ];

  const { userData, saveAthleteDataAsUser, logout } = useUser();

  // Safely cast userData to Athlete with null check
  const athleteData = userData as Athlete | null;

  const handleSignOut = async () => {
    await logout();
    router.replace("/(auth)/versionChoice" as RelativePathString);
  };

  return (
    <ScrollView className="pl-4">
      {athleteData ? (
        <>
          <Text className="font-pregular text-h2">Mi Perfil</Text>

          <View className="flex flex-row w-full self-center items-center justify-around pr-4 mt-2">
            <Image
              resizeMode="contain"
              style={{ height: 200, width: 130 }}
              source={
                icons[
                  `full${athleteData.character || "Emily"}` as keyof typeof icons
                ]
              }
            />
            <View className="flex-1 ml-8">
              <Text className="font-16regular text-16 mb-2">
                - {athleteData.name || "Sin nombre"}
              </Text>
              <Text className="font-16regular text-16 mb-2">
                - {getAge(athleteData.birthDate)} años
              </Text>
              <Text className="font-16regular text-16 mb-2 pr-4">
                {`- ${
                  formattedDisciplines.find(
                    (discipline) => discipline.id === athleteData.discipline
                  )?.label || "Sin disciplina"
                }`}
              </Text>

              <>
                <Text className="font-16regular text-16 mb-1">
                  {`- ${athleteData.weight || "0"} ${athleteData.weightUnit}`}
                </Text>
                <Text className="font-16regular text-16 mb-1">
                  {`- ${athleteData.height || "0"} ${athleteData.heightUnit}`}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.replace("myStats" as any);
                  }}
                >
                  <Text className="text-16 font-pregular text-secondary ">
                    Ver estadísticas
                  </Text>
                </TouchableOpacity>
              </>
            </View>
          </View>
          <OutlinedButton
            title="Editar Información"
            containerStyles="self-center mt-8"
            icon="pen"
            isLoading={false}
            onPress={() => {
              router.push("/(auth)/sign-up?from=myProfile");
            }}
            textStyles=""
            inverse={false}
          />

          <Text className="font-pregular text-h2 mt-8">Cambiar Personaje</Text>
          <View style={{ height: 260, marginTop: 16 }}>
            <FlatList
              horizontal
              data={characters}
              keyExtractor={(item) => item.key.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    saveAthleteDataAsUser({ ...athleteData, character: item.name })
                  }
                  style={{ marginRight: 10 }}
                >
                  <View
                    className={`bg-white shadow-md flex items-center justify-center rounded-2xl w-32 h-60 ${
                      athleteData.character === item.name
                        ? "border border-secondary"
                        : ""
                    }`}
                  >
                    <Image
                      resizeMode="contain"
                      source={icons[`full${item.name}` as keyof typeof icons]}
                      style={{ width: "90%", height: "90%" }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          <TonalButton
            containerStyles="mt-4 self-center"
            title="Cerrar Sesión"
            onPress={handleSignOut}
            icon="logout"
          />
        </>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="font-pregular text-h2">Cargando perfil...</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default myProfile;