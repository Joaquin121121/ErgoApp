import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import React, { useContext, useState } from "react";

import { Link, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import UserContext from "../../contexts/UserContext";
import FormField from "../../components/FormField";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import TonalButton from "../../components/TonalButton";

const SignUp2 = () => {
  const { user, setUser } = useContext(UserContext);

  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [visibility, setVisibility] = useState(true);

  const auth = getAuth();

  const signIn = () => {
    setUser({
      fullName: "",
      sport: "Football",
      category: "Amateur",
      birthDate: "01/01/1999",
    });
    router.replace("sign-in");
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, user.email, user.password);
    } catch (error) {
      switch (error.code) {
        case "auth/weak-password":
          setEmailError("");
          break;
        case "auth/email-already-in-use":
          break;
        default:
          break;
      }
    }
  };

  const toggleVisibility = () => {
    setVisibility(!visibility);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="bg-offWhite mt-10 h-[85vh] w-full flex items-center justify-center">
        <ScrollView className="w-[80%] ">
          <View className="w-full flex items-center justify-center ">
            <Text className="text-3xl font-regular ">Registrarse</Text>
            {visibility && (
              <>
                <View className="mt-8 flex flex-row items-end w-full">
                  <FormField
                    title="Altura"
                    value={user.height}
                    handleChangeText={(e) => setUser({ ...user, height: e })}
                    otherStyles="w-[40%] mr-8"
                    keyboardType="numeric"
                  />
                  <CustomButton
                    containerStyles={`mr-6 w-16 ${
                      heightUnit === "cm"
                        ? "bg-lightRed"
                        : "bg-offWhite border border-lightRed"
                    }`}
                    textStyles="text-secondary"
                    title={"cm"}
                    handlePress={() => setHeightUnit("cm")}
                  />
                  <CustomButton
                    containerStyles={`w-16  ${
                      heightUnit === "ft"
                        ? "bg-lightRed"
                        : "bg-offWhite border border-lightRed"
                    }`}
                    title={"ft"}
                    textStyles="text-secondary"
                    handlePress={() => setHeightUnit("ft")}
                  />
                </View>
                <View className="mt-8 flex flex-row items-end w-full">
                  <FormField
                    title="Peso"
                    value={user.weight}
                    handleChangeText={(e) => setUser({ ...user, weight: e })}
                    otherStyles="w-[40%] mr-8"
                    keyboardType="numeric"
                  />
                  <CustomButton
                    containerStyles={`mr-6 w-16 ${
                      heightUnit === "kg"
                        ? "bg-lightRed"
                        : "bg-offWhite border border-lightRed"
                    }`}
                    textStyles="text-secondary"
                    title={"kg"}
                    handlePress={() => setHeightUnit("kg")}
                  />
                  <CustomButton
                    containerStyles={`w-16  ${
                      heightUnit === "lbs"
                        ? "bg-lightRed"
                        : "bg-offWhite border border-lightRed"
                    }`}
                    title={"lbs"}
                    textStyles="text-secondary"
                    handlePress={() => setHeightUnit("lbs")}
                  />
                </View>
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
              <Text className="text-secondary mt-2">{emailError.message}</Text>
            )}
            <FormField
              title="Contraseña"
              value={user.password}
              handleChangeText={(e) => setUser({ ...user, password: e })}
              onChange={() => {
                setPasswordError(null);
              }}
              toggleVisibility={toggleVisibility}
              otherStyles="mt-8"
            />
            {passwordError && (
              <Text className="text-secondary mt-2">{passwordError}</Text>
            )}
            <CustomButton
              title="Registrarse"
              handlePress={() => {
                handleRegister();
              }}
              containerStyles="w-full mt-8 bg-secondary"
              textStyles="text-white"
            ></CustomButton>
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-md">Ya tienes cuenta?</Text>
              <Pressable onPress={signIn}>
                <Text className="text-md text-secondary">Iniciar Sesión</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUp2;
