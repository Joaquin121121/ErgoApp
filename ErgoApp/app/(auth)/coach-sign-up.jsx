import { View, Text, ScrollView } from "react-native";
import React, { useState, useContext } from "react";
import CoachContext from "../../contexts/CoachContext";
import FormField from "../../components/FormField";
import SelectField from "../../components/SelectField";
import TonalButton from "../../components/TonalButton";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../scripts/firebase";
import { setDoc, doc } from "firebase/firestore";

const coachSignUp = () => {
  const { coachInfo, setCoachInfo } = useContext(CoachContext);
  const [describing, setDescribing] = useState(false);
  const [settingCredentials, setSettingCredentials] = useState(false);
  const [infoError, setInfoError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [specialityError, setSpecialityError] = useState(false);

  const specialities = ["Fitness", "Deporte", "Salud"];

  const onPress = async () => {
    let hasError = false;

    if (!coachInfo.fullName) {
      setNameError(true);
      hasError = true;
    }
    if (!coachInfo.email) {
      setEmailError(true);
      hasError = true;
    }
    if (!coachInfo.password) {
      setPasswordError(true);
      hasError = true;
    }

    if (!coachInfo.info) {
      setInfoError(true);
      hasError = true;
    }

    if (hasError) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        coachInfo.email,
        coachInfo.password
      );

      await setDoc(doc(db, "coaches", userCredential.user.uid), coachInfo);
      await signInWithEmailAndPassword(
        auth,
        coachInfo.email,
        coachInfo.password
      );
      router.replace("coach-add-athletes");
    } catch (error) {
      console.log(error.code);

      switch (error.code) {
        case "auth/weak-password":
          setPasswordError("Tu contraseña es muy débil.");
          break;
        case "auth/email-already-in-use":
          try {
            await signInWithEmailAndPassword(auth, user.email, user.password);
            router.replace("home");
          } catch (error) {}
          setEmailError("Este email ya se encuentra en uso");
          break;
        case "auth/invalid-email":
          setEmailError("Email inválido");
          break;
        default:
          break;
      }
    }
  };

  return (
    <ScrollView
      className="bg-offWhite"
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 40,
      }}
    >
      <View className="w-[80vw] self-center flex mt-10 items-center justify-center ">
        <Text className="text-3xl font-regular ">Registrarse</Text>
        {!describing && !settingCredentials && (
          <>
            <FormField
              title="Nombre"
              value={coachInfo.fullName}
              handleChangeText={(e) => {
                setCoachInfo({ ...coachInfo, fullName: e });
                setNameError(false);
              }}
              otherStyles="mt-8"
              keyboardType="text"
              placeholder="Ingrese su nombre..."
            />
            {nameError && (
              <Text className="text-secondary font-pregular text-16 mt-2 self-center">
                Este campo no puede estar vacío
              </Text>
            )}
            <SelectField
              containerStyles="mt-8"
              title="specialty"
              options={specialities}
              displayTitle="Especialidad"
              context="coach"
            />
            {specialityError && (
              <Text className="text-secondary font-pregular text-16 mt-2 self-center">
                Debe seleccionar una especialidad
              </Text>
            )}
          </>
        )}
        {!settingCredentials && (
          <FormField
            toggleVisibility={() => setDescribing(true)}
            title="Info sobre vos"
            placeholder="Que te motiva a ser coach?"
            value={coachInfo.info}
            handleChangeText={(e) => {
              setCoachInfo({ ...coachInfo, info: e });
              setInfoError(false);
            }}
            otherStyles="mt-6"
            multiline
          />
        )}
        {infoError && (
          <Text className="text-secondary font-pregular text-16 mt-2 self-center">
            Este campo no puede estar vacío
          </Text>
        )}
        {!describing && (
          <>
            <FormField
              toggleVisibility={() => setSettingCredentials(true)}
              title="Email"
              value={coachInfo.email}
              handleChangeText={(e) => {
                setCoachInfo({ ...coachInfo, email: e });
                setEmailError(false);
              }}
              otherStyles="mt-4"
              keyboardType="text"
              placeholder="Ingrese su email..."
            />
            {emailError && (
              <Text className="text-secondary font-pregular text-16 mt-2 self-center">
                Este campo no puede estar vacío
              </Text>
            )}
            <FormField
              toggleVisibility={() => setSettingCredentials(true)}
              title="Contraseña"
              otherStyles="mt-4"
              value={coachInfo.password}
              handleChangeText={(e) => {
                setCoachInfo({ ...coachInfo, password: e });
                setPasswordError(false);
              }}
              placeholder="Ingrese su contraseña..."
            />
            {passwordError && (
              <Text className="text-secondary font-pregular text-16 mt-2 self-center">
                Este campo no puede estar vacío
              </Text>
            )}
          </>
        )}
        {(describing || settingCredentials) && (
          <TonalButton
            containerStyles="mt-6 self-center"
            title="Guardar"
            icon="checkWhite"
            onPress={() => {
              setDescribing(false);
              setSettingCredentials(false);
            }}
          />
        )}
        {!settingCredentials && !describing && (
          <TonalButton
            containerStyles="mt-8 self-center"
            title="Continuar"
            icon="next"
            onPress={onPress}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default coachSignUp;
