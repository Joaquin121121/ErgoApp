import { ScrollView, View, Text } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { TextInput } from "react-native";
import TonalButton from "../components/TonalButton";
import FormField from "../components/FormField";
import SelectField from "../components/SelectField";
import ClassContext from "../contexts/ClassContext";
import OutlinedButton from "../components/OutlinedButton";
import { router } from "expo-router";
const addClass = () => {
  const [nameError, setNameError] = useState(false);
  const [durationError, setDurationError] = useState(false);
  const [placeError, setPlaceError] = useState(false);
  const [difficultyError, setDifficultyError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [describing, setDescribing] = useState(false);

  const { classInfo, setClassInfo } = useContext(ClassContext);

  const places = ["Gimnasio", "Casa", "Parque", "Playa"];

  const onPress = () => {
    let hasError = false;

    if (classInfo.name === "") {
      setNameError(true);
      hasError = true;
    }
    if (classInfo.duration === "") {
      setDurationError(true);
      hasError = true;
    }
    if (classInfo.place === "") {
      setPlaceError(true);
      hasError = true;
    }
    if (classInfo.difficulty === "") {
      setDifficultyError(true);
      hasError = true;
    }
    if (classInfo.description === "") {
      setDescriptionError(true);
      hasError = true;
    }

    if (hasError) return;
    router.push("setClassTime");
  };

  useEffect(() => {
    classInfo.difficulty && setDifficultyError(false);
    classInfo.place && setPlaceError(false);
  }, [classInfo.difficulty, classInfo.place]);

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
              value={classInfo.name}
              handleChangeText={(e) => {
                setClassInfo({ ...classInfo, name: e });
                setNameError(false);
              }}
            />
            {nameError && (
              <Text className="text-secondary font-pregular text-16 mt-2 self-center">
                Ingrese el nombre de la clase
              </Text>
            )}
            <Text className="text-darkGray font-pregular text-16 mt-6 mb-1">
              Duración:
            </Text>
            <View className="flex flex-row items-center">
              <TextInput
                keyboardType="numeric"
                className="mr-4 h-8 bg-white pl-2 w-12 rounded-xl shadow-sm"
                value={classInfo.duration}
                onChangeText={(e) => {
                  setClassInfo({ ...classInfo, duration: e });
                  setDurationError(false);
                }}
              />
              <Text className="text-darkGray font-plight text-16">minutos</Text>
            </View>
            {durationError && (
              <Text className="text-secondary font-pregular text-16 mt-2 self-center">
                Ingrese la duración de la clase
              </Text>
            )}
            <SelectField
              containerStyles="mt-6"
              title="difficulty"
              options={["Baja", "Media", "Elevada"]}
              displayTitle="Dificultad"
              context="class"
            />
            {difficultyError && (
              <Text className="text-secondary font-pregular text-16 mt-2 self-center">
                Seleccione la dificultad de la clase
              </Text>
            )}
            <SelectField
              title="place"
              displayTitle="Lugar"
              containerStyles="mt-6"
              options={places}
              context="class"
            />
            {placeError && (
              <Text className="text-secondary font-pregular text-16 mt-2 self-center">
                Seleccione el lugar de la clase
              </Text>
            )}
          </>
        )}

        <FormField
          toggleVisibility={() => setDescribing(!describing)}
          title="Descripción"
          placeholder="Describa la clase..."
          value={classInfo.description}
          handleChangeText={(e) => {
            setClassInfo({ ...classInfo, description: e });
            setDescriptionError(false);
          }}
          otherStyles="mt-6"
          multiline
        />
        {descriptionError && (
          <Text className="text-secondary font-pregular text-16 mt-2 self-center">
            Ingrese una descripción de la clase
          </Text>
        )}
        {describing && (
          <TonalButton
            containerStyles="mt-6 self-center"
            title="Guardar"
            icon="checkWhite"
            onPress={() => setDescribing(false)}
          />
        )}
      </View>
      {!describing && (
        <View className="w-full mt-8 flex flex-row items-center justify-around">
          <OutlinedButton
            title="Volver"
            icon="arrowBackRed"
            onPress={() => router.back()}
            containerStyles="w-[40%]"
            inverse
          />
          <TonalButton
            title="Continuar"
            containerStyles="w-[40%]"
            icon="next"
            onPress={onPress}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default addClass;
