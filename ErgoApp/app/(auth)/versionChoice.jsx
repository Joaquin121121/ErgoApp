import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import icons from "../../scripts/icons";
import Icon from "../../components/Icon";
import TonalButton from "../../components/TonalButton";

const versionChoice = () => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [error, setError] = useState(false);

  const onPress = () => {
    if (!selectedVersion) {
      setError(true);
      return;
    }
    router.replace(`${selectedVersion === "coach" ? "coachHome" : "home"}`);
  };

  useEffect(() => {
    setError(false);
  }, [selectedVersion]);
  return (
    <ScrollView className="pt-20">
      <Image
        source={icons.logoRed}
        resizeMode="contain"
        className="w-[80vw] self-center"
      />
      <Text className=" font-pregular text-[32px] self-center">
        Bienvenido!
      </Text>
      <Text className="mt-2 font-plight text-16 text-darkGray self-center">
        Elige una opción para continuar
      </Text>
      <TouchableOpacity
        onPress={() => {
          setSelectedVersion("coach");
        }}
      >
        <View
          className={`w-[80vw] h-40 mt-12 self-center bg-white rounded-2xl shadow-sm flex flex-row items-center ${
            selectedVersion === "coach" && "border border-secondary"
          }`}
        >
          <View className="w-2/5 h-full" />
          <View className="w-3/5 h-full justify-evenly items-center">
            <Text className="font-pmedium text-xl ">
              Modo <Text className="text-secondary">Coach</Text>
            </Text>
            <Icon icon="sports" size={60} />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setSelectedVersion("athlete");
        }}
      >
        <View
          className={`w-[80vw] h-40 mt-8 self-center bg-white rounded-2xl shadow-sm flex flex-row items-center ${
            selectedVersion === "athlete" && "border border-secondary"
          }`}
        >
          <View className="w-2/5 h-full" />
          <View className="w-3/5 h-full justify-evenly items-center">
            <Text className="font-pmedium text-xl ">
              Modo <Text className="text-secondary">Atleta</Text>
            </Text>
            <Icon icon="dumbbellRed" size={48} />
          </View>
        </View>
      </TouchableOpacity>
      <Text
        className={`mt-12 mb-2 self-center text-secondary font-psemibold ${
          !error && "opacity-0"
        }`}
      >
        Debe elegir una opción
      </Text>
      <TonalButton
        containerStyles="self-center"
        icon="checkWhite"
        title="Continuar"
        onPress={onPress}
      />
    </ScrollView>
  );
};

export default versionChoice;
