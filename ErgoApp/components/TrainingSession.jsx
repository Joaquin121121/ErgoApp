import { View, Text, Image } from "react-native";
import React, { useContext } from "react";
import Icon from "./Icon";
import OutlinedButton from "./OutlinedButton";
import TonalButton from "./TonalButton";
import UserContext from "../contexts/UserContext";
import icons from "../scripts/icons";

const TrainingSession = () => {
  const { user } = useContext(UserContext);

  return (
    <View className="shadow-sm w-[90vw] bg-white rounded-2xl mt-2">
      <Text className="text-xl font-pregular self-center mt-2 mb-2">
        Musculación
      </Text>
      <View className="w-[95%] flex flex-row justify-between items-center mt-4">
        <View className="w-[45%] h-[180px]">
          <Image
            style={{ width: "90%", height: "90%" }}
            resizeMode="contain"
            source={icons[`full${user.character}`]}
          ></Image>
        </View>
        <View className="w-[55%] h-[180px] flex justify-around">
          <View className="flex flex-row items-center">
            <Icon icon="heart" size={32}></Icon>
            <Text className="font-pregular text-sm text-darkGray ml-2">
              Prevención de lesiones
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <Icon icon="dumbbellRed" size={32}></Icon>
            <Text className="font-pregular text-sm text-darkGray ml-2">
              Aumento de masa muscular
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <Icon icon="stonks" size={32}></Icon>
            <Text className="font-pregular text-sm text-darkGray ml-2">
              Aceleración de metabolismo
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-8 flex flex-row w-full justify-around mb-4">
        <OutlinedButton
          icon="plan"
          title="Ver Plan"
          containerStyles="w-[40%]"
        />
        <TonalButton
          icon="dumbbell"
          title="Entrenar"
          containerStyles="w-[40%]"
        />
      </View>
    </View>
  );
};

export default TrainingSession;
