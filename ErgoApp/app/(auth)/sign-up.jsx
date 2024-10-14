import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { Link, router } from "expo-router";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import SelectField from "../../components/SelectField";
import UserContext from "../../contexts/UserContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";

const SignUp = () => {
  const sports = ["Football", "Voley"];
  const categories = ["Amateur", "Professional"];

  const { user, setUser } = useContext(UserContext);

  const [date, setDate] = useState(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);

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
    setUser({ ...user, birthDate: date.toDateString() });
  };

  const handleLogIn = async () => {
    await createUserWithEmailAndPassword(auth);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="bg-offWhite mt-10 h-[85vh] w-full flex items-center justify-center">
        <ScrollView className="w-[80%] ">
          <View className="w-full flex items-center justify-center ">
            <Text className="text-3xl font-regular ">Registrarse</Text>
            {!pickerVisible && (
              <>
                <FormField
                  title="Nombre"
                  value={user.fullName}
                  handleChangeText={(e) => setUser({ ...user, fullName: e })}
                  otherStyles="mt-8"
                  keyboardType="text"
                />
                <SelectField
                  title="sport"
                  options={sports}
                  displayTitle="Disciplina"
                ></SelectField>
                <SelectField
                  title="category"
                  options={categories}
                  displayTitle="Categoría"
                ></SelectField>
              </>
            )}
            <FormField
              title="Fecha"
              value={date}
              toggleVisibility={toggleVisibility}
              pickerVisible={pickerVisible}
              otherStyles="mt-8"
            ></FormField>
            {pickerVisible && (
              <>
                <DateTimePicker
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
                    handlePress={saveChanges}
                  ></CustomButton>
                )}
              </>
            )}
            {!pickerVisible && (
              <>
                <CustomButton
                  title="Continuar"
                  handlePress={() => {
                    router.push("sign-up-2");
                  }}
                  containerStyles="w-full mt-8 bg-secondary"
                  textStyles="text-white"
                ></CustomButton>
                <View className="justify-center pt-5 flex-row gap-2">
                  <Text className="text-md">Ya tienes cuenta?</Text>
                  <Pressable onPress={signIn}>
                    <Text className="text-md text-secondary">
                      Iniciar Sesión
                    </Text>
                  </Pressable>
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
