import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../../scripts/icons.js";
import FormField from "../../components/FormField.jsx";
import CustomButton from "../../components/CustomButton.jsx";
import UserContext from "../../contexts/UserContext.jsx";
import { Link, router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../../scripts/firebase.js";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, setUser } = useContext(UserContext);

  const auth = getAuth();

  const handleLogIn = async () => {
    /*  setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
        .then(async (userCredential) => {
          const docRef = doc(db, "userdata", userCredential.user.uid);
          const docSnap = await getDoc(docRef);
          const userdata = docSnap.data();
          setUser(userdata);
          console.log(userdata);
          navigate(userdata.hasData ? "/main" : "/start");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
        });
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false); */
    router.replace("/home");
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
            />
            <FormField
              title="Contraseña"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-8"
            />
            <CustomButton
              title="Iniciar Sesión"
              handlePress={handleLogIn}
              containerStyles="w-full mt-8 bg-secondary"
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
