import { View, Text, Modal, ScrollView } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import TonalButton from "./TonalButton";
import Icon from "./Icon";

const PendingStudy = ({ studies, studyKey }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View className="shadow-sm w-[85vw] self-center h-[180px] bg-white rounded-2xl flex flex-row items-center pl-4 border border-secondary">
          <Icon icon="documentRed" size={80} />
          <View className="flex-1 h-full flex justify-evenly ml-4">
            <Text className="text-16 font-pregular">
              Realizar{" "}
              <Text className="text-secondary">{studies[studyKey].name}s</Text>
            </Text>
            <Text className="text-secondary text-16 font-psemibold">
              Ver lista de pendientes
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-5 w-[80%] max-h-[70%]">
            <Text className="text-xl font-pregular text-center mb-4">
              Lista de Atletas
            </Text>

            <ScrollView className="max-h-[90%]">
              {studies[studyKey].athletes?.map((athlete, index) => (
                <View
                  key={index}
                  className="py-2.5 border-b border-darkGray border-opacity-0  justify-around"
                >
                  <Text className="text-16 font-plight ">{athlete}</Text>
                  <View className="absolute right-5 top-2 flex flex-row">
                    <Icon icon="timer" />
                    <Text className="text-16 font-plight ml-2 ">
                      {studies[studyKey].time}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TonalButton
              containerStyles="w-[40vw] self-center mt-8"
              title="Cerrar"
              onPress={() => setModalVisible(false)}
              icon="closeWhite"
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PendingStudy;
