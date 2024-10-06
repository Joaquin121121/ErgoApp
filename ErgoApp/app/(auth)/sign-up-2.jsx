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

const SignUp2 = () => {
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const { user, setUser } = useContext(UserContext);

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="bg-offWhite mt-10 h-[85vh] w-full flex items-center justify-center">
        <ScrollView className="w-[80%] ">
          <View className="w-full flex items-center justify-center ">
            <Text className="text-3xl font-regular ">Registrarse</Text>
            <FormField
              title="Email"
              value={user.email}
              handleChangeText={(e) => setUser({ ...user, email: e })}
              otherStyles="mt-8"
              onChange={() => setEmailError(null)}
              keyboardType="email-address"
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
