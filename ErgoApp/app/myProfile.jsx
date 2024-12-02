import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useContext, useState } from "react";
import icons from "../scripts/icons";
import OutlinedButton from "../components/OutlinedButton";
import UserContext from "../contexts/UserContext.jsx";
import { router } from "expo-router";
import TonalButton from "../components/TonalButton.jsx";
import { auth } from "../scripts/firebase.js";
import CoachContext from "../contexts/CoachContext.jsx";
import ImageUploadButton from "../components/ImageUploadButton.jsx";
import Icon from "../components/Icon.jsx";
const myProfile = () => {
  const characters = [
    { name: "Roger", key: 0 },
    { name: "Emily", key: 1 },
    { name: "Luke", key: 2 },
    { name: "Sophie", key: 3 },
  ];

  const { user, setUser, version, setVersion, resetUser } =
    useContext(UserContext);

  const { coachInfo, resetCoachInfo } = useContext(CoachContext);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [flag, setFlag] = useState(false);

  function getAge(dateString) {
    // Validate input format
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
      throw new Error("Invalid date format. Please use DD/MM/YYYY");
    }

    // Parse the date parts
    const [day, month, year] = dateString.split("/").map(Number);

    // Create date objects
    const birthDate = new Date(year, month - 1, day); // month is 0-indexed in JS
    const today = new Date();

    // Validate the date is not in the future
    if (birthDate > today) {
      throw new Error("Birth date cannot be in the future");
    }

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age if birthday hasn't occurred this year
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  const handleSignOut = async () => {
    await auth.signOut();
    setVersion("");
    resetUser();
    resetCoachInfo();
    router.dismissAll();
    router.replace("versionChoice");
  };

  const userdata = version === "athlete" ? user : coachInfo;

  return (
    <ScrollView className="pl-4">
      <Text className="font-pregular text-h2">Mi Perfil</Text>

      <View className="flex flex-row w-full self-center items-center justify-around pr-4 mt-2">
        <Image
          resizeMode="contain"
          style={{ height: 200, width: 130 }}
          source={icons[`full${user.character}`]}
        />
        <View className="flex-1 ml-8">
          <Text className="font-16regular text-16 mb-2">
            - {userdata.fullName}
          </Text>
          <Text className="font-16regular text-16 mb-2">
            -{" "}
            {version === "athlete"
              ? getAge(userdata.birthDate)
              : `Especialista en ${userdata.specialty}`}
          </Text>
          <Text className="font-16regular text-16 mb-2 pr-4">
            {`- ${
              version === "athlete"
                ? "Jugador de " + user.sport
                : coachInfo.info
            }`}
          </Text>
          {version === "athlete" && (
            <>
              <Text className="font-16regular text-16 mb-1">{`- ${user.weight} ${user.weightUnit}`}</Text>
              <Text className="font-16regular text-16 mb-1">{`- ${user.height} ${user.heightUnit}`}</Text>
              <TouchableOpacity
                onPress={() => {
                  router.replace("myStats");
                }}
              >
                <Text className="text-16 font-pregular text-secondary ">
                  Ver estadísticas
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <OutlinedButton
        title="Editar Información"
        containerStyles="self-center mt-8"
        icon={"edit"}
      ></OutlinedButton>
      {version === "athlete" ? (
        <>
          <Text className="font-pregular text-h2 mt-8">Cambiar Personaje</Text>
          <View style={{ height: 260, marginTop: 16 }}>
            <FlatList
              horizontal
              data={characters}
              keyExtractor={(item) => item.key.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setUser({ ...user, character: item.name })}
                  style={{ marginRight: 10 }}
                >
                  <View
                    className={`bg-white shadow-md flex items-center justify-center rounded-2xl w-32 h-60 ${
                      user.character === item.name
                        ? "border border-secondary"
                        : ""
                    }`}
                  >
                    <Image
                      resizeMode="contain"
                      source={icons[`full${item.name}`]}
                      style={{ width: "90%", height: "90%" }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </>
      ) : (
        <>
          <Text className="font-pregular text-h2 mt-8">Cambiar Imagen</Text>
          <View className="relative self-center w-3/4">
            {coachInfo.image?.length ? (
              <>
                <View className="relative w-32 h-32 mt-4 mb-8 self-center">
                  <Image
                    className="rounded-full w-full h-full"
                    source={{ uri: coachInfo.image }}
                    resizeMethod="contain"
                    onLoadStart={() => setLoading(true)}
                    onLoad={() => {
                      setLoading(false);
                      setFlag(true);
                    }}
                  />
                </View>
                {loading && !flag && (
                  <View className="absolute inset-0 right-[28%] top-5 rounded-full w-32 h-32 flex items-center justify-center border border-secondary">
                    <Icon icon="photo" size={64} />
                  </View>
                )}
              </>
            ) : (
              <View className="w-32 h-32 rounded-full self-center mt-4 mb-8 flex items-center justify-center border border-secondary">
                <Icon icon="photo" size={64} />
              </View>
            )}
            {uploading && (
              <Image
                className="absolute right-0 top-[20%] w-16 h-16"
                source={icons.loading}
                resizeMethod="contain"
              />
            )}
          </View>

          <ImageUploadButton
            containerStyles="self-center mb-4"
            onPress={() => {
              setUploading(true);
            }}
            onUploadSuccess={() => {
              setUploading(false);
            }}
            onUploadCancel={() => {
              setUploading(false);
            }}
          />
        </>
      )}

      <TonalButton
        containerStyles="mt-4 self-center"
        title="Cerrar Sesión"
        onPress={handleSignOut}
        icon="logout"
      />
    </ScrollView>
  );
};

export default myProfile;
