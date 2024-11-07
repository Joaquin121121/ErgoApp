import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Icon from "../../components/Icon";
import TonalButton from "../../components/TonalButton";
const Targets = () => {
  const targets = [
    "Ganar músculo",
    "Aumentar fuerza",
    "Bajar de peso",
    "Saltar más alto",
    "Mejorar resistencia",
    "Aumentar flexibilidad",
    "Mejorar postura",
    "Mejorar equilibrio",
    "Ganar velocidad",
    "Desarrollar explosividad",
    "Mejorar coordinación",
    "Incrementar agilidad",
    "Ganar resistencia cardiovascular",
    "Mejorar movilidad articular",
    "Aumentar potencia",
  ];

  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [indexBeingShown, setIndexBeingShown] = useState(0);
  return (
    <View className="w-full">
      <Text className="self-center font-pregular text-2xl">Tus Objetivos</Text>
      <Text className="self-center font-plight text-16 text-darkGray">
        Selecciona al menos un objetivo
      </Text>
      <View className="self-center mt-8 w-full">
        {targets.slice(indexBeingShown, indexBeingShown + 5).map((e) => (
          <TouchableOpacity
            onPress={() => {
              !selectedIndexes.includes(targets.indexOf(e))
                ? setSelectedIndexes([...selectedIndexes, targets.indexOf(e)])
                : setSelectedIndexes(
                    selectedIndexes.filter((num) => num !== targets.indexOf(e))
                  );
            }}
            className={`w-[85%] h-16 self-center mb-4 bg-white shadow-sm rounded-2xl justify-center  ${
              selectedIndexes.includes(targets.indexOf(e)) &&
              "border border-secondary"
            }`}
          >
            <Text className="font-pregular text-16 pl-4">{e}</Text>
          </TouchableOpacity>
        ))}
        <View className="flex flex-row items-center w-[85%] self-center ">
          <TouchableOpacity
            className={`flex flex-1 ${indexBeingShown === 0 && "opacity-70"}`}
            onPress={() => {
              setIndexBeingShown(indexBeingShown - 5);
            }}
            disabled={indexBeingShown === 0}
          >
            <Icon icon={"leftArrow"} size={32} />
          </TouchableOpacity>
          <Text className="font-plight text-darkGray text-16 mr-1">
            {`Mostrando ${indexBeingShown + 1} - ${indexBeingShown + 5} de ${
              targets.length
            } objetivos`}
          </Text>
          <TouchableOpacity
            className={`flex flex-1 ${
              indexBeingShown + 5 >= targets.length && "opacity-70"
            }`}
            disabled={indexBeingShown + 5 >= targets.length}
            onPress={() => {
              setIndexBeingShown(indexBeingShown + 5);
            }}
          >
            <Icon icon={"rightArrow"} size={32} />
          </TouchableOpacity>
        </View>
        <TonalButton
          title="Continuar"
          icon="next"
          containerStyles="self-center mt-8"
        />
      </View>
    </View>
  );
};

export default Targets;
