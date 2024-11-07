import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useContext } from "react";
import icons from "../scripts/icons";
import OutlinedButton from "../components/OutlinedButton";
import UserContext from "../contexts/UserContext.jsx";

const myProfile = () => {
  const characters = [
    { name: "Roger", key: 0 },
    { name: "Emily", key: 1 },
    { name: "Luke", key: 2 },
    { name: "Sophie", key: 3 },
  ];

  const { user, setUser } = useContext(UserContext);

  return (
    <ScrollView className="pl-4">
      <Text className="font-pregular text-h2">Mi Perfil</Text>

      <View className="flex flex-row w-full self-center items-center justify-around pr-4 mt-8">
        <Image
          resizeMode="contain"
          style={{ height: 200, width: 130 }}
          source={icons[`full${user.character}`]}
        />
        <View>
          <Text className="font-16regular text-16 mb-1">- Joaquín Del Río</Text>
          <Text className="font-16regular text-16 mb-1">- 20 años</Text>
          <Text className="font-16regular text-16 mb-1">
            - Jugador de basket
          </Text>
          <Text className="font-16regular text-16 mb-1">- 75 kg</Text>
          <Text className="font-16regular text-16 mb-1">- 178 cm</Text>
          <TouchableOpacity>
            <Text className="text-16 font-pregular text-secondary ">
              Ver estadísticas
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <OutlinedButton
        title="Editar Información"
        containerStyles="self-center mt-8"
        icon={"edit"}
      ></OutlinedButton>
      <Text className="font-pregular text-h2 mt-8">Cambiar Personaje</Text>
      <View style={{ height: 250, marginTop: 10 }}>
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
                  user.character === item.name ? "border border-secondary" : ""
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
    </ScrollView>
  );
};

export default myProfile;
