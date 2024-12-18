import { Text, View, ScrollView } from "react-native";
import CoachContext from "../contexts/CoachContext";
import { useContext } from "react";
import TonalButton from "../components/TonalButton";
import Icon from "../components/Icon";
import OutlinedButton from "../components/OutlinedButton";
import { router } from "expo-router";
export default function AthleteInfo() {
  const { coachInfo, setCoachInfo, selectedAthlete } = useContext(CoachContext);

  const athlete = coachInfo.athletes.find(
    (athlete) => athlete.name === selectedAthlete
  );

  const colorScale = (value) => {
    switch (value) {
      case 1:
      case 2:
        return "text-secondary";
      case 3:
        return "text-fire";
      case 4:
      case 5:
        return "text-green";
    }
  };

  const inverseColorScale = (value) => {
    switch (value) {
      case 4:
      case 5:
        return "text-secondary";
      case 3:
        return "text-fire";
      case 1:
      case 2:
        return "text-green";
    }
  };

  const getScaleText = (value, feminine = false) => {
    switch (value) {
      case 5:
        return feminine ? "Muy buena" : "Muy bueno";
      case 4:
        return feminine ? "Buena" : "Bueno";
      case 3:
        return "Regular";
      case 2:
        return feminine ? "Mala" : "Malo";
      case 1:
        return feminine ? "Muy mala" : "Muy malo";
      default:
        return "N/A";
    }
  };

  const getInverseScaleText = (value, feminine = false) => {
    switch (value) {
      case 1:
        return feminine ? "Muy baja" : "Muy bajo";
      case 2:
        return feminine ? "Baja" : "Bajo";
      case 3:
        return "Regular";
      case 4:
        return feminine ? "Alta" : "Alto";
      case 5:
        return feminine ? "Muy alta" : "Muy alto";
      default:
        return "N/A";
    }
  };

  const feeding = getScaleText(athlete.feelings.feeding, true);
  const sleep = getScaleText(athlete.feelings.sleep);
  const fatigue = getInverseScaleText(athlete.feelings.fatigue, true);

  const feedingColor = colorScale(athlete.feelings.feeding);
  const sleepColor = colorScale(athlete.feelings.sleep);
  const fatigueColor = inverseColorScale(athlete.feelings.fatigue);

  return (
    <ScrollView>
      <Text className="font-pregular text-[28px] ml-4">{selectedAthlete}</Text>
      <Text className="font-pregular mt-4 text-xl ml-4">
        Solución de Entrenamiento
      </Text>
      <View className="shadow-sm w-[85vw] self-center bg-white rounded-2xl p-4 mt-2 ">
        <Text className="font-pregular text-sm text-secondary">
          {" "}
          - Objetivo:{" "}
          <Text className="text-darkGray">
            {athlete.trainingSolutions.target[0]}
          </Text>
        </Text>
        {athlete.trainingSolutions.additionals.slice(0, 2).map((additional) => (
          <Text className="font-pregular text-sm text-darkGray mt-2">
            {" "}
            - {additional}
          </Text>
        ))}
        <TonalButton
          containerStyles="self-center mt-8 mb-1 w-1/2"
          icon="next"
          title="Ver Todo"
          onPress={() => {
            router.push("trainingSolution");
          }}
        />
      </View>
      <Text className="mt-8 ml-4 font-pregular text-xl">Esta Semana</Text>
      <View className="shadow-sm w-[85vw] self-center bg-white rounded-2xl p-4 pl-8  flex mt-2 ">
        <View className="flex flex-row items-center mb-4">
          <Icon icon="food" />
          <Text className="text-darkGray font-pmedium text-sm ml-4">
            Alimentación: <Text className={feedingColor}>{feeding}</Text>
          </Text>
        </View>
        <View className="flex flex-row items-center mb-4">
          <Icon icon="sleep" />
          <Text className="text-darkGray font-pmedium text-sm ml-4">
            Sueño: <Text className={sleepColor}>{sleep}</Text>
          </Text>
        </View>
        <View className="flex flex-row items-center">
          <Icon icon="velocimeter" />
          <Text className="text-darkGray font-pmedium text-sm ml-4">
            Fatigua: <Text className={fatigueColor}>{fatigue}</Text>
          </Text>
        </View>
      </View>
      <OutlinedButton
        containerStyles="self-center mt-8"
        title="Ver Estudios"
        icon="plan"
        onPress={() => {
          router.push("studies");
        }}
      />
      <TonalButton
        containerStyles="self-center mt-4"
        title="Realizar Estudio"
        icon="add"
        onPress={() => {
          router.push("loadStudy");
        }}
      />
    </ScrollView>
  );
}
