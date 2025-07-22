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

import DateTimePicker from "@react-native-community/datetimepicker";
import TonalButton from "../../components/TonalButton";
import { useUser } from "../../contexts/UserContext";
import { Athlete } from "../../types/Athletes";

const VALIDATION_LIMITS = {
  height: {
    cm: { max: 250 },
    ft: { max: 8 },
  },
  weight: {
    kgs: { max: 300 },
    lbs: { max: 660 },
  },
};

const SignUp = () => {
  const { user, setUserData, userData } = useUser();

  const [date, setDate] = useState(
    new Date(Date.now() - 25 * 365.25 * 24 * 60 * 60 * 1000)
  );
  const [displayDate, setDisplayDate] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [keyboardActiveOn, setKeyboardActiveOn] = useState<string | null>(null);
  const [prevHeightUnit, setPrevHeightUnit] = useState<"cm" | "ft">("cm");
  const [prevHeight, setPrevHeight] = useState("");
  const [prevWeightUnit, setPrevWeightUnit] = useState<"kgs" | "lbs">("kgs");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const signIn = () => {
    router.replace("/(auth)/sign-in");
  };

  const toggleVisibility = () => {
    setPickerVisible(!pickerVisible);
  };

  const onChange = (
    { type }: { type: string },
    selectedDate: Date | undefined
  ) => {
    if (type === "set") {
      setDate(selectedDate ?? new Date());
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
    setUserData({ ...userData, birthDate: date } as Athlete);
  };

  const onContinue = () => {
    if (!userData?.name) {
      setNameError(true);
      return;
    }
    router.push("/(auth)/sign-up-2");
  };

  const handleInputChange = (field: keyof Athlete, value: string | Date) => {
    const athlete = userData as Athlete;

    if (field === "name" && typeof value === "string" && /\d/.test(value)) {
      setErrors({ ...errors, name: "numbers" });
      return;
    }
    if (
      field === "height" &&
      athlete?.heightUnit === "ft" &&
      typeof value === "string" &&
      value.length > 0
    ) {
      // Split the value into an array of characters
      const chars = value.split("");

      // If length is 4 (e.g., "5'11"), check if the second to last char is '1'
      // and the last char is between '0' and '1'
      if (value.length === 4) {
        const secondToLast = chars[value.length - 2];
        const last = chars[value.length - 1];

        if (secondToLast !== "1" || (last !== "0" && last !== "1")) {
          return;
        }
      }

      // Don't allow inputs longer than 4 characters (e.g., "5'111")
      if (value.length > 4) {
        return;
      }
    }
    if (
      (field === "weight" || field === "height") &&
      value !== "" &&
      !/^\d+$/.test(String(value)) &&
      // Allow the feet/inches format (e.g., "5'11")
      !(
        field === "height" &&
        athlete?.heightUnit === "ft" &&
        /^\d'?\d*$/.test(String(value))
      )
    ) {
      return;
    }

    if (field === "height" && typeof value === "string" && value !== "") {
      if (athlete?.heightUnit === "cm") {
        const numValue = parseFloat(value);
        if (numValue > VALIDATION_LIMITS.height.cm.max) {
          return;
        }
      } else if (athlete?.heightUnit === "ft") {
        const [feet, inches = "0"] = value.split("'");
        const feetNum = parseInt(feet);
        const inchesNum = parseInt(inches);
        if (!isNaN(feetNum) && !isNaN(inchesNum)) {
          const newHeight = Math.round(feetNum * 30.48 + inchesNum * 2.54);
          if (newHeight > VALIDATION_LIMITS.height.cm.max) {
            return;
          }
        }
        // Only validate the feet part when there's a single digit
        if (
          value.length === 1 &&
          parseInt(value) > VALIDATION_LIMITS.height.ft.max
        ) {
          return;
        }
      }
    }

    if (field === "weight" && typeof value === "string" && value !== "") {
      const numValue = parseFloat(value);
      const maxValue =
        VALIDATION_LIMITS.weight[athlete?.weightUnit as "kgs" | "lbs"]?.max;
      if (numValue > maxValue) {
        return;
      }
    }

    if (field === "heightUnit") {
      setPrevHeightUnit(athlete?.heightUnit);
    }
    if (field === "weightUnit") {
      setPrevWeightUnit(athlete?.weightUnit);
    }

    setUserData({ ...userData, [field]: value } as Athlete);
    setErrors({ ...errors, [field]: "" });
  };

  useEffect(() => {
    setNameError(false);
  }, [userData?.name]);

  // Auto-format height when typing in feet mode
  useEffect(() => {
    const athlete = userData as Athlete;
    if (
      athlete?.heightUnit === "ft" &&
      athlete?.height?.length === 1 &&
      prevHeight.length === 0
    ) {
      setUserData({ ...userData, height: `${athlete.height}'` } as Athlete);
    }
    setPrevHeight(athlete?.height || "");
  }, [(userData as Athlete)?.height]);

  // Handle height unit conversion
  useEffect(() => {
    const athlete = userData as Athlete;
    if (athlete?.heightUnit === "ft" && prevHeightUnit === "cm") {
      const heightNum = parseFloat(athlete?.height || "");
      if (!isNaN(heightNum)) {
        const feet = Math.floor(heightNum / 30.48);
        const inches = Math.round((heightNum % 30.48) / 2.54);
        setUserData({ ...userData, height: `${feet}'${inches}` } as Athlete);
      }
    }
    if (athlete?.heightUnit === "cm" && prevHeightUnit === "ft") {
      const [feet, inches = "0"] = (athlete?.height || "").split("'");
      const feetNum = parseInt(feet);
      const inchesNum = parseInt(inches);
      if (!isNaN(feetNum) && !isNaN(inchesNum)) {
        const newHeight = Math.round(
          feetNum * 30.48 + inchesNum * 2.54
        ).toString();
        setUserData({ ...userData, height: newHeight } as Athlete);
      }
    }
  }, [(userData as Athlete)?.heightUnit]);

  // Handle weight unit conversion
  useEffect(() => {
    const athlete = userData as Athlete;
    if (prevWeightUnit === "kgs" && athlete?.weightUnit === "lbs") {
      const weightNum = athlete?.weight;
      if (!isNaN(parseFloat(weightNum))) {
        setUserData({
          ...userData,
          weight: Math.round(2.2 * parseFloat(weightNum)).toString(),
        } as Athlete);
      }
    }
    if (prevWeightUnit === "lbs" && athlete?.weightUnit === "kgs") {
      const weightNum = athlete?.weight;
      if (!isNaN(parseFloat(weightNum))) {
        setUserData({
          ...userData,
          weight: Math.round(0.45392 * parseFloat(weightNum)).toString(),
        } as Athlete);
      }
    }
  }, [(userData as Athlete)?.weightUnit]);

  return (
    <View className="bg-offWhite h-[90vh] w-full flex items-center justify-center">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="absolute inset-0 z-0" />
      </TouchableWithoutFeedback>
      <ScrollView
        className="w-[80%] z-10"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="w-full flex items-center justify-center ">
          <Text className="text-2xl font-regular ">Registrarse</Text>

          {!pickerVisible && (
            <>
              <FormField
                title="Nombre"
                value={userData?.name}
                handleChangeText={(e) => handleInputChange("name", e)}
                otherStyles="mt-8"
                placeholder="Ingrese su nombre..."
                onFocusInput={setKeyboardActiveOn}
                onBlurInput={() => setKeyboardActiveOn(null)}
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
                <TonalButton
                  title={"Guardar"}
                  containerStyles="mt-8 "
                  icon="next"
                  onPress={saveChanges}
                ></TonalButton>
              )}
            </>
          )}

          {!pickerVisible && !keyboardActiveOn && (
            <>
              <SelectField
                category="country"
                displayTitle="País"
                containerStyles="mt-8"
              />
              <SelectField
                category="state"
                displayTitle="Estado"
                containerStyles="mt-8"
                disabled={!(userData as Athlete)?.country}
              />
            </>
          )}

          {!pickerVisible && (
            <>
              <View className="flex mt-8 flex-row self-start pl-4 items-center gap-x-2">
                <FormField
                  title="Altura"
                  value={(userData as Athlete)?.height}
                  placeholder="Altura..."
                  otherStyles=" w-32 "
                  handleChangeText={(e) => handleInputChange("height", e)}
                  onFocusInput={setKeyboardActiveOn}
                  onBlurInput={() => setKeyboardActiveOn(null)}
                  keyboardType="numeric"
                />
                <CustomButton
                  containerStyles={`mr-4 ml-6 mt-6 w-12 ${
                    (userData as Athlete)?.heightUnit === "cm"
                      ? "bg-lightRed"
                      : "bg-offWhite border border-lightRed"
                  }`}
                  textStyles={`text-secondary ${
                    (userData as Athlete)?.heightUnit === "cm" &&
                    "font-psemibold"
                  }`}
                  title={"cm"}
                  onPress={() => {
                    handleInputChange("heightUnit", "cm");
                  }}
                />
                <CustomButton
                  containerStyles={`w-12 mt-6 ${
                    (userData as Athlete)?.heightUnit === "ft"
                      ? "bg-lightRed"
                      : "bg-offWhite border border-lightRed"
                  }`}
                  title={"ft"}
                  textStyles={`text-secondary ${
                    (userData as Athlete)?.heightUnit === "ft" &&
                    "font-psemibold"
                  }`}
                  onPress={() => {
                    handleInputChange("heightUnit", "ft");
                  }}
                />
              </View>
              <View className="flex mt-8 flex-row self-start pl-4 items-center gap-x-2">
                <FormField
                  title="Peso"
                  value={(userData as Athlete)?.weight}
                  placeholder="Peso..."
                  otherStyles=" w-32 "
                  handleChangeText={(e) => handleInputChange("weight", e)}
                  onFocusInput={setKeyboardActiveOn}
                  onBlurInput={() => setKeyboardActiveOn(null)}
                  keyboardType="numeric"
                />
                <CustomButton
                  containerStyles={`mr-4 ml-6 mt-6 w-12 ${
                    (userData as Athlete)?.weightUnit === "kgs"
                      ? "bg-lightRed"
                      : "bg-offWhite border border-lightRed"
                  }`}
                  textStyles={`text-secondary ${
                    (userData as Athlete)?.weightUnit === "kgs" &&
                    "font-psemibold"
                  }`}
                  title={"kgs"}
                  onPress={() => {
                    handleInputChange("weightUnit", "kgs");
                  }}
                />
                <CustomButton
                  containerStyles={`w-12 mt-6 ${
                    (userData as Athlete)?.weightUnit === "lbs"
                      ? "bg-lightRed"
                      : "bg-offWhite border border-lightRed"
                  }`}
                  title={"lbs"}
                  textStyles={`text-secondary ${
                    (userData as Athlete)?.weightUnit === "lbs" &&
                    "font-psemibold"
                  }`}
                  onPress={() => {
                    handleInputChange("weightUnit", "lbs");
                  }}
                />
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
                  <Text className="text-md text-secondary">Iniciar Sesión</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;
