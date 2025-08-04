import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { categories } from "../scripts/categories";
import React, { useContext, useEffect, useState } from "react";
import OutlinedButton from "../components/OutlinedButton";
import TonalButton from "../components/TonalButton";
import Icon from "../components/Icon";
import { router } from "expo-router";
const screeningParameters = () => {
  const allMovements = categories.studies.find(
    (e) => e.value === "screening"
  ).movements;

  const [editMode, setEditMode] = useState(false);
  const [movements, setMovements] = useState(
    currentStudyData?.availableMovements
      ? allMovements.filter(
          (e) => !currentStudyData.availableMovements.includes(e.name)
        )
      : allMovements
  );

  const { currentStudyData, setCurrentStudyData } = useContext(CoachContext);

  const handleDelete = (movement) => {
    setCurrentStudyData({
      availableMovements: currentStudyData.availableMovements
        ? [...currentStudyData.availableMovements, movement.name]
        : [movement.name],
    });
  };

  const handleAdd = () => {
    setCurrentStudyData({ ...currentStudyData, movements: movements });
    router.push("exerciseSearch?currentStudy=screening");
  };

  useEffect(() => {
    setMovements(
      allMovements.filter(
        (e) => !currentStudyData.availableMovements.includes(e.name)
      )
    );
    setCurrentStudyData({ ...currentStudyData, movements: movements });
  }, [currentStudyData?.availableMovements]);

  return (
    <ScrollView>
      <Text className="text-3xl font-pregular self-center mt-4">Screening</Text>
      <Text className="font-pregular mt-4 text-xl ml-4">
        Movimientos a Evaluar
      </Text>
      <View className="shadow-sm w-[85vw] self-center bg-white rounded-2xl py-6 mt-2">
        {movements.map((movement) => (
          <View className="flex flex-row justify-between items-center px-8 mt-4">
            <Text className="font-plight text-16 mt-2">
              <Text className="text-secondary">- </Text> {movement.name}
            </Text>
            {editMode && (
              <TouchableOpacity onPress={() => handleDelete(movement)}>
                <View className="bg-white rounded-full p-2 shadow-sm">
                  <Icon size={16} icon="close" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <OutlinedButton
          containerStyles="self-center mt-8 w-3/4"
          title={editMode ? "Terminar de Editar" : "Editar Movimientos"}
          icon={editMode ? "check" : "edit"}
          onPress={() => setEditMode(!editMode)}
        />
        {movements.length < allMovements.length && (
          <TonalButton
            title="Agregar Movimiento"
            onPress={handleAdd}
            icon="add"
            containerStyles="self-center w-3/4 mt-4"
          />
        )}
      </View>
      <TonalButton
        title="Continuar"
        icon="arrow-right"
        containerStyles="self-center mt-8"
        onPress={() => router.push("screening")}
      />
    </ScrollView>
  );
};

export default screeningParameters;
