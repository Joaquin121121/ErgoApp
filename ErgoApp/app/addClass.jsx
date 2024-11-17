import { ScrollView, View, Text } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native";
import TonalButton from "../components/TonalButton";
import FormField from "../components/FormField";
import SelectField from "../components/SelectField";
import { router } from "expo-router";
const addClass = () => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [place, setPlace] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");
  const [describing, setDescribing] = useState(false);

  const places = ["Gimnasio", "Casa", "Parque", "Playa"];

  const onPress = () => {};

  return (
    <ScrollView>
      <View className="w-3/4 self-center">
        {!describing && (
          <>
            <Text className="text-xl font-pregular self-center mt-8 mb-4">
              Añadir Clase
            </Text>
            <FormField
              title="Nombre"
              placeholder="Ingrese el nombre de la clase..."
              value={name}
              handleChangeText={setName}
            />
            <Text className="text-darkGray font-pregular text-16 mt-6 mb-1">
              Duración:
            </Text>
            <View className="flex flex-row items-center">
              <TextInput
                keyboardType="numeric"
                className=" mr-4 h-8 bg-white pl-2 w-12 rounded-xl shadow-sm"
              />
              <Text className="text-darkGray font-plight text-16">minutos</Text>
            </View>
            <SelectField
              containerStyles="mt-6"
              title="Dificultad"
              options={["Baja", "Media", "Alta"]}
              displayTitle="Seleccionar Dificultad"
            />
            <SelectField
              displayTitle="Seleccionar Lugar"
              containerStyles="mt-6"
              options={places}
            />
          </>
        )}

        <FormField
          toggleVisibility={() => setDescribing(!describing)}
          title="Descripción"
          placeholder="Describa la clase..."
          value={description}
          handleChangeText={setDescription}
          otherStyles="mt-6"
          multiline
        />
        {describing && (
          <TonalButton
            containerStyles="mt-6 self-center"
            title="Guardar"
            icon="checkWhite"
            onPress={() => setDescribing(false)}
          />
        )}
        {!describing && (
          <TonalButton
            title="Continuar"
            containerStyles="mt-6 self-center"
            icon="next"
            onPress={() => router.push("setClassTime")}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default addClass;
