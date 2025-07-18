import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";

import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import SelectField from "../../components/SelectField";

import FormField from "../../components/FormField";

const SignUp2 = () => {
  const { user, setUser } = useContext(UserContext);

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [visibility, setVisibility] = useState(true);
  const [prevHeight, setPrevHeight] = useState(user.height);
  const [prevHeightUnit, setPrevHeightUnit] = useState(null);
  const [prevWeightUnit, setPrevWeightUnit] = useState(null);

  const auth = getAuth();
  const db = getFirestore(app);

  const signIn = () => {
    router.replace("sign-in");
  };

  const handleRegister = async () => {
    console.log("eyouu", user.email, user.password);
    if (user.password === "") {
      setPasswordError("Ingrese una contraseña");
      return;
    }
    if (user.email === "") {
      setEmailError("Ingrese un email");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      console.log("checkk");

      await setDoc(doc(db, "userdata", userCredential.user.uid), user);
      console.log("check");
      await signInWithEmailAndPassword(auth, user.email, user.password);
      router.replace("/home");
    } catch (error) {
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

  const toggleVisibility = () => {
    setVisibility(true);
  };

  useEffect(() => {
    if (
      user.heightUnit === "ft" &&
      user.height.toString().length === 1 &&
      prevHeight.toString().length === 0
    ) {
      setUser({ ...user, height: `${user.height}'` });
    }
  }, [user.height]);

  useEffect(() => {
    if (user.heightUnit === "ft" && prevHeightUnit === "cm") {
      const newHeight =
        Math.floor(user.height / 30.48).toString() +
        "'" +
        Math.round((user.height % 30.48) / 2.54).toString();
      setUser({ ...user, height: newHeight });
    }
    if (user.heightUnit === "cm" && prevHeightUnit === "ft") {
      const inches =
        user.height.toString().charAt(2) + user.height.toString().charAt(3);
      const inchesToCm = inches ? parseInt(inches) : 0;
      const newHeight = Math.round(
        parseInt(user.height.toString().charAt(0)) * 30.48 + inchesToCm * 2.54
      );
      setUser({ ...user, height: newHeight });
    }
  }, [user.heightUnit]);

  useEffect(() => {
    if (prevWeightUnit === "kg" && user.weightUnit === "lbs") {
      setUser({ ...user, weight: Math.round(2.2 * parseInt(user.weight)) });
    }
    if (prevWeightUnit === "lbs" && user.weightUnit === "kg") {
      setUser({ ...user, weight: Math.round(0.45392 * parseInt(user.weight)) });
    }
  }, [user.weightUnit]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="bg-offWhite  h-[85vh] w-full flex items-center justify-center">
        <ScrollView className="w-[80%] ">
          <View className="w-full flex items-center justify-center ">
            <Text className="text-2xl font-regular mb-8">Registrarse</Text>
            {visibility && (
              <>
                <View className="flex flex-row items-center w-full">
                  <FormField
                    title="Altura"
                    value={user.height.toString()}
                    handleChangeText={(e) => {
                      setUser({ ...user, height: e });
                      setPrevHeight(user.height);
                    }}
                    otherStyles="w-[40%] mr-8"
                    keyboardType="numeric"
                    maxLength={4}
                  />
                  <CustomButton
                    containerStyles={`mr-6 mt-6 w-16 ${
                      user.heightUnit === "cm"
                        ? "bg-lightRed"
                        : "bg-offWhite border border-lightRed"
                    }`}
                    textStyles={`text-secondary ${
                      user.heightUnit === "cm" && "font-psemibold"
                    }`}
                    title={"cm"}
                    onPress={() => {
                      setPrevHeightUnit(user.heightUnit);
                      setUser({ ...user, heightUnit: "cm" });
                    }}
                  />
                  <CustomButton
                    containerStyles={`w-16 mt-6 ${
                      user.heightUnit === "ft"
                        ? "bg-lightRed"
                        : "bg-offWhite border border-lightRed"
                    }`}
                    title={"ft"}
                    textStyles={`text-secondary ${
                      user.heightUnit === "ft" && "font-psemibold"
                    }`}
                    onPress={() => {
                      setPrevHeightUnit(user.heightUnit);
                      setUser({ ...user, heightUnit: "ft" });
                    }}
                  />
                </View>
                <View className="mt-8 flex flex-row items-center w-full">
                  <FormField
                    title="Peso"
                    value={user.weight.toString()}
                    handleChangeText={(e) => setUser({ ...user, weight: e })}
                    otherStyles="w-[40%] mr-8"
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  <CustomButton
                    containerStyles={`mr-6 mt-6 w-16 ${
                      user.weightUnit === "kg"
                        ? "bg-lightRed"
                        : "bg-offWhite border border-lightRed"
                    }`}
                    textStyles="text-secondary"
                    title={"kg"}
                    onPress={() => {
                      setPrevWeightUnit(user.weightUnit);
                      setUser({ ...user, weightUnit: "kg" });
                    }}
                  />
                  <CustomButton
                    containerStyles={`w-16 mt-6 ${
                      user.weightUnit === "lbs"
                        ? "bg-lightRed"
                        : "bg-offWhite border border-lightRed"
                    } z-20`}
                    title={"lbs"}
                    textStyles="text-secondary"
                    onPress={() => {
                      setPrevWeightUnit(user.weightUnit);
                      setUser({ ...user, weightUnit: "lbs" });
                    }}
                  />
                </View>
                <SelectField
                  containerStyles="mt-8"
                  category="genders"
                  displayTitle="Género"
                  title="gender"
                ></SelectField>
              </>
            )}

            <FormField
              title="Email"
              value={user.email}
              handleChangeText={(e) => setUser({ ...user, email: e })}
              otherStyles="mt-8"
              onChange={() => setEmailError(null)}
              keyboardType="email-address"
              toggleVisibility={toggleVisibility}
            />
            {emailError && (
              <Text className="text-secondary mt-2">{emailError}</Text>
            )}
            <FormField
              title="Contraseña"
              value={user.password}
              handleChangeText={(e) => setUser({ ...user, password: e })}
              onChange={() => {
                setPasswordError(null);
              }}
              toggleVisibility={toggleVisibility}
              otherStyles="mt-6"
              onEnter={handleRegister}
            />
            {passwordError && (
              <Text className="text-secondary mt-2">{passwordError}</Text>
            )}
            <CustomButton
              title="Registrarse"
              onPress={handleRegister}
              containerStyles="mt-8 bg-secondary"
              textStyles="text-white"
              icon="add"
              iconSize={28}
            ></CustomButton>
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-md">Ya tienes cuenta?</Text>
              <TouchableOpacity onPress={signIn}>
                <Text className="text-md text-secondary">Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUp2;
