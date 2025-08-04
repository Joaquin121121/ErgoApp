import TonalButton from "../../components/TonalButton";
import React, { useState, useContext, useEffect } from "react";
import FormField from "../../components/FormField";
import {
  View,
  Text,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomButton from "../../components/CustomButton";
import OutlinedButton from "../../components/OutlinedButton";

import Icon from "../../components/Icon";
import { router } from "expo-router";

const InjuryHistory = () => {
  const [addInjury, setAddInjury] = useState(false);
  const [injury, setInjury] = useState({});
  const [date, setDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState("");
  const [pickerVisible, setPickerVisible] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [statusError, setStatusError] = useState(false);

  const options = ["No", "Parcialmente", "Sí"];

  const { user, setUser } = useContext(UserContext);

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
    setInjury({ ...injury, date: date.toDateString() });
  };

  const handleDelete = (i) => {
    setUser({
      ...user,
      injuryHistory: user.injuryHistory.filter((_, index) => index !== i),
    });
  };

  const onContinue = () => {
    if (!injury.name || !injury.name.length) {
      setNameError(true);
      return;
    }
    if (!injury.recoveryStatus) {
      setStatusError(true);
      return;
    }
    setUser({
      ...user,
      injuryHistory: user.injuryHistory
        ? [...user.injuryHistory, { ...injury, date: date.toDateString() }]
        : [{ ...injury, date: date.toDateString() }],
    });
    setInjury({});
    setAddInjury(false);
  };

  useEffect(() => {
    setNameError(false);
  }, [injury.name]);

  useEffect(() => {
    setStatusError(false);
  }, [injury.recoveryStatus]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="bg-offWhite h-[90vh] w-full flex items-center justify-center">
        <ScrollView className="w-[80vw] ">
          <View className="w-full flex items-center justify-center ">
            <Text className="text-2xl font-regular">Lesiones</Text>
            {!addInjury && (
              <>
                <Text className="text-xl font-regular mt-12">
                  {user.injuryHistory && user.injuryHistory.length > 0
                    ? "Historial"
                    : "¿Tiene o ha tenido alguna lesión?"}
                </Text>

                {user.injuryHistory &&
                  user.injuryHistory.length > 0 &&
                  user.injuryHistory.map((e, i) => (
                    <View
                      key={i}
                      className="flex-row items-center justify-between mb-4 w-full mt-8"
                    >
                      <Text className="text-16 font-pregular  max-w-[80%]">
                        {e.name}, el día{" "}
                        {new Date(e.date).toLocaleDateString("es-ES")}.{" "}
                        {e.recoveryStatus === "Sí"
                          ? "Completamente recuperado."
                          : `${e.recoveryStatus} recuperado`}
                      </Text>
                      <TouchableOpacity onPress={() => handleDelete(i)}>
                        <View className="bg-white rounded-full p-2 shadow-sm">
                          <Icon icon="close" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}

                <OutlinedButton
                  title="Registrar Lesión"
                  icon="addRed"
                  onPress={() => setAddInjury(true)}
                  containerStyles="mt-8"
                />
                <TonalButton
                  title="Continuar"
                  icon="arrow-right"
                  containerStyles="mt-16"
                  onPress={() => router.push("/sign-up-2")}
                />
              </>
            )}
            {addInjury && (
              <>
                <Text className="text-xl font-regular mt-12">
                  Registrar Lesión
                </Text>
                <FormField
                  title="Nombre de la lesión"
                  value={injury.name}
                  handleChangeText={(e) => {
                    setInjury({ ...injury, name: e });
                  }}
                  otherStyles="mt-8"
                />
                {nameError && (
                  <Text className="text-secondary font-pregular text-16 mt-2 self-center">
                    Ingrese el nombre de la lesión
                  </Text>
                )}
                <FormField
                  title="Fecha de la lesión"
                  date
                  value={date.toLocaleDateString("es-ES")}
                  toggleVisibility={toggleVisibility}
                  pickerVisible={pickerVisible}
                  otherStyles="mt-8"
                />
                {pickerVisible && (
                  <>
                    <DateTimePicker
                      maximumDate={new Date()}
                      locale="es-ES"
                      mode="date"
                      display="spinner"
                      value={date}
                      onChange={onChange}
                    />
                    {Platform.OS === "ios" && (
                      <CustomButton
                        title="Guardar"
                        containerStyles="w-full mt-8 bg-secondary"
                        textStyles="text-white"
                        onPress={saveChanges}
                      />
                    )}
                  </>
                )}
                <Text className="mt-12 font-pregular text-16 self-center">
                  ¿Estás recuperado?
                </Text>
                <View className="mt-6 w-[95%] h-10 self-center flex flex-row items-center justify-between rounded-2xl border border-secondary overflow-hidden">
                  {options.map((option, index) => (
                    <View
                      key={option}
                      className={`flex justify-center border-r border-lightRed h-full ${
                        option === injury.recoveryStatus && "bg-lightRed"
                      } ${index === options.length - 1 && "border-0"} ${
                        option === "Parcialmente" ? "flex-[2]" : "flex-1"
                      }`}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          setInjury({ ...injury, recoveryStatus: option })
                        }
                      >
                        <Text className="self-center font-pregular text-16 text-secondary">
                          {option}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                {statusError && (
                  <Text className="text-secondary font-pregular text-16 mt-2 self-center">
                    Ingrese el estado de su recuperación
                  </Text>
                )}
                <View className="w-full flex flex-row justify-between mt-12">
                  <OutlinedButton
                    containerStyles="w-[45%]"
                    title="Cancelar"
                    icon="close"
                    onPress={() => setAddInjury(false)}
                  />
                  <TonalButton
                    title="Guardar"
                    icon="add"
                    containerStyles="w-[45%]"
                    onPress={onContinue}
                  />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InjuryHistory;
