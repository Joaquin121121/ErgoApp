import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { Link, router } from "expo-router";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import SelectField from "../../components/SelectField";
import UserContext from "../../contexts/UserContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import TonalButton from "../../components/TonalButton";
const SignUp = () => {
  const { user, setUser } = useContext(UserContext);

  const [date, setDate] = useState(
    new Date(Date.now() - 25 * 365.25 * 24 * 60 * 60 * 1000)
  );
  const [displayDate, setDisplayDate] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState(1);

  const numbers = Array.from({ length: 5 }, (_, i) => i + 1);
  const signIn = () => {
    router.replace("sign-in");
  };

  const toggleVisibility = () => {
    setPickerVisible(!pickerVisible);
  };

  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      setDate(selectedDate);
      if (Platform.OS === "android") {
        saveChanges();
      }
    } else {
      toggleVisibility();
    }
  };

  const saveChanges = () => {
    toggleVisibility();
    setDisplayDate(date.toDateString());
    setUser({ ...user, birthDate: date.toDateString() });
  };

  const onContinue = () => {
    if (!user.fullName) {
      setNameError(true);
      return;
    }
    router.push("targets");
  };

  useEffect(() => {
    setNameError(false);
  }, [user.fullName]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="bg-offWhite h-[85vh] w-full flex items-center justify-center">
        <ScrollView className="w-[80%] ">
          <View className="w-full flex items-center justify-center ">
            <Text className="text-2xl font-regular ">Registrarse</Text>
            {!pickerVisible && (
              <>
                <FormField
                  title="Nombre"
                  value={user.fullName}
                  handleChangeText={(e) => setUser({ ...user, fullName: e })}
                  otherStyles="mt-8"
                  keyboardType="text"
                  placeholder="Ingrese su nombre..."
                />
                {nameError && (
                  <Text className="text-secondary font-pregular text-16 mt-2 self-center">
                    Por favor ingrese su nombre
                  </Text>
                )}
              </>
            )}
            <FormField
              title="Fecha de nacimiento"
              date
              value={date.toLocaleDateString("es-ES")}
              toggleVisibility={toggleVisibility}
              pickerVisible={pickerVisible}
              otherStyles="mt-8"
            ></FormField>
            {pickerVisible && (
              <>
                <DateTimePicker
                  maximumDate={new Date()}
                  locale="es-ES"
                  mode="date"
                  display="spinner"
                  value={date}
                  onChange={onChange}
                ></DateTimePicker>
                {Platform.OS === "ios" && (
                  <CustomButton
                    title={"Guardar"}
                    containerStyles="w-full mt-8 bg-secondary"
                    textStyles="text-white"
                    onPress={saveChanges}
                  ></CustomButton>
                )}
              </>
            )}

            {!pickerVisible && (
              <>
                <SelectField
                  containerStyles="mt-8"
                  title="sport"
                  category="sports"
                  displayTitle="Disciplina"
                  action="search"
                ></SelectField>
                <SelectField
                  containerStyles="mt-8"
                  category="competitionLevels"
                  displayTitle="Categoría"
                  title="category"
                ></SelectField>
                <Text className="mt-12 font-pregular text-16 self-center">
                  Nivel de experiencia
                </Text>
                <Text className="self-center font-plight text-16 text-darkGray">
                  Seleccione un número del 1-5
                </Text>
                <View className="mt-6 w-[95%] h-10 self-center flex flex-row items-center justify-between rounded-2xl border border-secondary overflow-hidden">
                  {numbers.map((e) => (
                    <View
                      className={`flex flex-1 justify-center border-r border-lightRed h-full ${
                        e === experienceLevel && "bg-lightRed"
                      } ${e === 5 && "border-0"}`}
                    >
                      <TouchableOpacity onPress={() => setExperienceLevel(e)}>
                        <Text className="self-center font-pregular text-16 text-secondary">
                          {e}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                <TonalButton
                  title="Continuar"
                  onPress={onContinue}
                  icon="next"
                  containerStyles="self-center mt-8"
                />
                <View className="justify-center pt-5 flex-row gap-2">
                  <Text className="text-md">Ya tienes cuenta?</Text>
                  <TouchableOpacity onPress={signIn}>
                    <Text className="text-md text-secondary">
                      Iniciar Sesión
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
