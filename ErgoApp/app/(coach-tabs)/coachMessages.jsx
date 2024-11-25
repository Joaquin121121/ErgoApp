import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import CoachContext from "../../contexts/CoachContext";
import Icon from "../../components/Icon";
import FormField from "../../components/FormField";
import { auth } from "../../scripts/firebase";
import { router } from "expo-router";
import ChatContext from "../../contexts/ChatContext";
const coachMessages = () => {
  const { coachInfo, setCoachInfo } = useContext(CoachContext);
  const [athletes, setAthletes] = useState(coachInfo.athletes);
  const [search, setSearch] = useState("");
  const { setCurrentRecipient } = useContext(ChatContext);

  useEffect(() => {
    setAthletes(
      coachInfo.athletes.filter((athlete) =>
        athlete.name.toLowerCase().includes(search.toLowerCase())
      )
    );
    console.log("athletes", athletes);
  }, [search]);

  return (
    <ScrollView>
      <View className="mt-20 w-full self-center pl-4">
        <Text className="text-2xl font-pregular">Mis Mensajes</Text>
      </View>
      <FormField
        placeholder="Buscar atleta..."
        value={search}
        handleChangeText={(e) => setSearch(e)}
        otherStyles="self-center  w-[90vw] mb-4"
        icon="search"
      />
      {athletes.map((athlete) => (
        <>
          <TouchableOpacity
            className="flex flex-row items-center w-full h-20 bg-white pl-4"
            key={athlete.uid}
            onPress={() => {
              console.log("uid", athlete.uid);
              setCurrentRecipient(athlete.name);
              router.push(
                `/chat?senderId=${auth.currentUser.uid}&receiverId=${athlete.uid}`
              );
            }}
          >
            <View className="flex items-center overflow-hidden justify-center h-18 w-18 rounded-full">
              <Icon icon={athlete.character} size={60} style="mt-4" />
            </View>
            <Text className="text-16 font-pregular ml-8">{athlete.name}</Text>
          </TouchableOpacity>
          <View className="w-[80vw] self-end border-b border-gray border-opacity-50" />
        </>
      ))}
    </ScrollView>
  );
};

export default coachMessages;
