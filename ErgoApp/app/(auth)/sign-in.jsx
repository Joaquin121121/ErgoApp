import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import icons from "../../scripts/icons.js";
import FormField from "../../components/FormField.jsx";
import CustomButton from "../../components/CustomButton.jsx";
import UserContext from "../../contexts/UserContext.jsx";
import { Link, router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../scripts/firebase.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { isLoading } from "expo-font";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const { user, setUser } = useContext(UserContext);

  const db = getFirestore(app);
  const auth = getAuth();

  const handleLogIn = async () => {
    if (form.email === "") {
      setEmailError("Ingrese un email");
      return;
    }
    if (form.password === "") {
      setPasswordError("Ingrese una contaseña");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password).then(
        async (userCredential) => {
          const docRef = doc(db, "userdata", userCredential.user.uid);
          const docSnap = await getDoc(docRef);
          const userdata = docSnap.data();
          setUser(userdata);
          console.log(userdata);
          router.replace("/home");
        }
      );
    } catch (error) {
      console.log(error.code);
      switch (error.code) {
        case "auth/invalid-email":
          setEmailError("Email inválido");
          break;
        case "auth/invalid-credential":
          setEmailError("Email y/o contraseña incorrectos");
        default:
          break;
      }
    }
    setLoading(false);
  };

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
            />
            {passwordError && (
              <Text className="text-secondary mt-2">{passwordError}</Text>
            )}
            <CustomButton
              title="Iniciar Sesión"
              onPress={handleLogIn}
              containerStyles="mt-8 bg-secondary"
              textStyles="text-white"
              isLoading={loading}
              icon="next"
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
