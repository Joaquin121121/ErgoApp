import { View, Text, ActivityIndicator, Image } from "react-native";
import FormField from "../../components/FormField";
import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import icons from "../../scripts/icons";
import { router } from "expo-router";
import TonalButton from "../../components/TonalButton";

const AthleteCoachLink = () => {
  const [code, setCode] = useState("");
  const { userData } = useUser();
  const [validationStatus, setValidationStatus] = useState<
    "validating" | "valid" | "invalid" | "alreadyRegistered"
  >("invalid");
  const { linkAthleteToCoach } = useUser();
  const validateCode = async () => {
    try {
      setValidationStatus("validating");
      const operationResult = await linkAthleteToCoach(code);
      if (operationResult === "success") {
        setValidationStatus("valid");
        router.push("/sign-up");
      } else if (operationResult === "alreadyRegistered") {
        setValidationStatus("alreadyRegistered");
      } else {
        setValidationStatus("invalid");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderRelevantText = () => {
    switch (validationStatus) {
      case "validating":
        return (
          <View className="flex flex-row items-center justify-center gap-x-4 mt-4">
            <Text className="text-16 font-regular ">Buscando Cuenta...</Text>
            <ActivityIndicator size="small" color="#e81d23" />
          </View>
        );
      case "valid":
        return (
          <>
            <Text className="text-16 font-regular mt-4">
              Bienvenido,{" "}
              <Text className="text-secondary font-medium">
                {userData?.name}
              </Text>
            </Text>
            <View className="flex flex-row items-center justify-center gap-x-4 mt-4">
              <Text className="text-16 font-regular">Iniciando sesión...</Text>
              <ActivityIndicator size="small" color="#e81d23" />
            </View>
          </>
        );
      case "alreadyRegistered":
        return (
          <>
            <Text className="text-16 font-regular mt-4 text-secondary">
              Ya tienes una cuenta, inicia sesión con tu correo
            </Text>
            <TonalButton
              icon="arrow-right"
              containerStyles="mt-8"
              title="Iniciar Sesión"
              onPress={() => router.push("/sign-in")}
            />
          </>
        );
      default:
        return (
          <Text className="text-16 font-regular mt-4 text-secondary">
            Código inválido
          </Text>
        );
    }
  };

  useEffect(() => {
    validateCode();
  }, [code]);

  return (
    <View className="bg-offWhite h-[90vh] w-full flex items-center  py-16 px-4">
      <Image
        source={icons.logoSimplified}
        resizeMode="contain"
        className="w-[120px] h-[120px] self-center"
        style={{ backgroundColor: "transparent" }}
      />
      <Text className="text-3xl font-regular ">
        Bienvenido a <Text className="text-secondary font-medium">ErgoLab</Text>
      </Text>

      <Text className="text-lg font-regular mt-4 px-4 text-center">
        Ingresa el código provisto por tu entrenador para registrarte
      </Text>
      <FormField
        title="Código"
        value={code}
        handleChangeText={(e) => setCode(e)}
        otherStyles="mt-8"
        placeholder="Ingrese el código de su entrenador..."
      />
      {renderRelevantText()}
    </View>
  );
};

export default AthleteCoachLink;
