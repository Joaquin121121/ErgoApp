import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import icons from "../../scripts/icons.js";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../../utils/supabase";
import { useUser } from "../../contexts/UserContext";
const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const { selectedVersion } = useLocalSearchParams();
  const { login } = useUser();
  const handleLogIn = async () => {
    if (form.email === "") {
      setEmailError("Ingrese un email");
      return;
    }
    if (form.password === "") {
      setPasswordError("Ingrese una contraseña");
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/home");
    } catch (error) {
      setPasswordError("Email o contraseña incorrectos");
    }
    setLoading(false);
  };

  return (
    <View className="bg-offWhite mt-10 h-[90vh] w-full flex items-center justify-center">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="absolute inset-0 z-0" />
      </TouchableWithoutFeedback>
      <ScrollView
        className="w-[80%] z-10"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="w-full flex items-center justify-center py-16 ">
          <Image
            source={icons.logoSimplified}
            resizeMode="contain"
            className="w-[120px] h-[120px] self-center"
            style={{ backgroundColor: "transparent" }}
          />
          <Text className="text-2xl font-regular ">Iniciar Sesión</Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-8"
            keyboardType="email-address"
            onChange={() => setEmailError(null)}
          />
          {emailError && (
            <Text className="text-secondary mt-2">{emailError}</Text>
          )}
          <FormField
            title="Contraseña"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            onChange={() => setPasswordError(null)}
            otherStyles="mt-8"
            onEnter={handleLogIn}
          />
          {passwordError && (
            <Text className="text-secondary mt-2">{passwordError}</Text>
          )}
          <CustomButton
            title="Iniciar Sesión"
            onPress={handleLogIn}
            containerStyles="mt-16 bg-secondary z-50"
            textStyles="text-white"
            isLoading={loading}
            icon="next"
          ></CustomButton>

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-md">No tienes cuenta?</Text>
            <TouchableOpacity
              onPress={() =>
                router.push(
                  `${
                    selectedVersion === "coach"
                      ? "/coach-sign-up"
                      : "/athlete-coach-link"
                  }`
                )
              }
            >
              <Text className="text-secondary">Registrarse</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignIn;
