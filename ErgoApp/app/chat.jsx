import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { db, auth } from "../scripts/firebase";
import ChatContext from "../contexts/ChatContext";
import Icon from "../components/Icon";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const { currentCoachId } = useContext(ChatContext);

  const currentUserId = auth.currentUser.uid;
  const otherUserId = currentCoachId;

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const getChatId = (uid1, uid2) => {
    return [uid1, uid2].sort().join("_");
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate();
    const now = new Date();

    // Set both dates to midnight for comparison
    const dateAtMidnight = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const nowAtMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Check if message is from today
    if (dateAtMidnight.getTime() === nowAtMidnight.getTime()) {
      return "Hoy";
    }

    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week

    if (date >= startOfWeek) {
      // If message is from current week, show day name in Spanish
      const days = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ];
      return days[date.getDay()];
    } else {
      // Otherwise show date in European format (DD/MM/YYYY)
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  const processMessages = (messageList) => {
    let processed = [];
    let currentDate = null;

    messageList.forEach((message) => {
      if (message.timestamp) {
        const messageDate = message.timestamp.toDate().toDateString();

        if (messageDate !== currentDate) {
          currentDate = messageDate;
          processed.push({
            id: `date-${message.timestamp.seconds}`,
            type: "date",
            timestamp: message.timestamp,
          });
        }
      }

      processed.push({
        ...message,
        type: "message",
      });
    });

    return processed;
  };

  useEffect(() => {
    console.log(auth.currentUser.uid, otherUserId);
    const chatId = getChatId(currentUserId, otherUserId);
    const chatRef = collection(db, `chats/${chatId}/messages`);

    const q = query(chatRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = [];
      snapshot.forEach((doc) => {
        messageList.push({ id: doc.id, ...doc.data() });
      });
      const processedMessages = processMessages(messageList);
      setMessages(processedMessages);
    });

    return () => unsubscribe();
  }, [currentUserId, otherUserId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const chatId = getChatId(currentUserId, otherUserId);
    const chatRef = collection(db, `chats/${chatId}/messages`);

    try {
      await addDoc(chatRef, {
        text: newMessage,
        senderId: currentUserId,
        receiverId: otherUserId,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderItem = ({ item }) => {
    if (item.type === "date") {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
        </View>
      );
    }

    const isMyMessage = item.senderId === currentUserId;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text
          style={isMyMessage ? styles.messageText : styles.theirMessageText}
        >
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <View
        style={[
          styles.inputContainer,
          { marginBottom: Platform.OS === "android" ? keyboardHeight : 0 },
        ]}
      >
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Escriba su mensaje"
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Icon icon="send" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  messagesList: {
    flex: 1,
    padding: 10,
  },
  dateContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    color: "#000000",
    fontSize: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#E81D23",
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  messageText: {
    color: "white",
    fontSize: 16,
  },
  theirMessageText: {
    color: "black",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ChatScreen;
