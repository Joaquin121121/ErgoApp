import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../../scripts/icons.js";
import FormField from "../../components/FormField.jsx";
import CustomButton from "../../components/CustomButton.jsx";
import { Link } from "expo-router";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="bg-offWhite mt-10 h-[85vh] w-full flex items-center justify-center">
        <ScrollView className="w-[80%] ">
          <View className="w-full flex items-center justify-center ">
            <Image
              source={icons.logoRed}
              resizeMode="contain"
              className="w-[80%]"
            />
            <Text className="text-3xl font-regular ">Iniciar Sesión</Text>
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
            />
            <FormField
              title="Contraseña"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
            />
            <CustomButton
              title="Iniciar Sesión"
              handlePress={() => {}}
              containerStyles="w-full mt-7 bg-secondary"
              textStyles="text-white"
            ></CustomButton>

            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-md">No tienes cuenta?</Text>
              <Link href="/sign-up" className="text-md text-secondary">
                Registrarse
              </Link>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignIn;
