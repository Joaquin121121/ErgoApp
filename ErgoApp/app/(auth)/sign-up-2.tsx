import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

import { router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import { useUser } from "../../contexts/UserContext";
import FormField from "../../components/FormField";

const SignUp2 = () => {
  const { signup, login } = useUser();
  const [form, setForm] = useState({ email: "", password: "" });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = () => {
    router.replace("/sign-in");
  };

  const handleRegister = async () => {
    if (form.password === "") {
      setPasswordError("Ingrese una contraseña");
      return;
    }
    if (form.email === "") {
      setEmailError("Ingrese un email");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signup(form.email, form.password);
      if (error) {
        switch (error.message) {
          case "Password should be at least 6 characters":
            setPasswordError("Tu contraseña debe tener al menos 6 caracteres");
            break;
          case "User already registered":
            setEmailError("Este email ya se encuentra en uso");
            break;
          case "Invalid email":
            setEmailError("Email inválido");
            break;
          default:
            setEmailError("Error al crear la cuenta");
            break;
        }
      } else {
        // Registration successful, redirect to home or next step
        await login(form.email, form.password);
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setEmailError("Error al crear la cuenta");
    }
    setLoading(false);
  };

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
          <Text className="text-2xl font-regular mb-8">Registrarse</Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-8"
            onChange={() => setEmailError("")}
            keyboardType="email-address"
          />
          {emailError && (
            <Text className="text-secondary mt-2">{emailError}</Text>
          )}
          <FormField
            title="Contraseña"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            onChange={() => {
              setPasswordError("");
            }}
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
            isLoading={loading}
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
  );
};

export default SignUp2;
