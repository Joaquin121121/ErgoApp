import { View, Text } from "react-native";
import { useSearchParams } from "expo-router"; // Change this line
import { useContext, useEffect } from "react";
import ChatContext from "../contexts/ChatContext";

export const ChatHeader = () => {
  const { currentRecipient } = useContext(ChatContext);
  return (
    <View className="flex flex-row items-center absolute left-2">
      <View className="w-8 h-8 rounded-full bg-darkGray mr-4" />
      <Text className=" text-16 font-pmedium">
        {currentRecipient || "Chat"}
      </Text>
    </View>
  );
};

export default ChatHeader;
