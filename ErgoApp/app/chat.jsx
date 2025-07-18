import React, { useState, useEffect, useContext } from "react";
import chatBackground from "../assets/images/chatBackground.png";
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
  Alert,
  ImageBackground,
} from "react-native";
import Icon from "../components/Icon";
import { useLocalSearchParams } from "expo-router";

const ChatScreen = () => {
  const { senderId, receiverId } = useLocalSearchParams();
  const { version } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const currentUserId = senderId;
  const otherUserId = receiverId;

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

  // Update read status when user opens the chat
  useEffect(() => {
    const markMessagesAsRead = async () => {
      const chatId = getChatId(currentUserId, otherUserId);
      const chatRef = collection(db, `chats/${chatId}/messages`);

      // Query for unread messages sent to current user
      const q = query(
        chatRef,
        where("receiverId", "==", currentUserId),
        where("readAt", "==", null)
      );

      const querySnapshot = await getDocs(q);
      const batch = [];

      querySnapshot.forEach((document) => {
        const messageRef = doc(db, `chats/${chatId}/messages`, document.id);
        batch.push(
          updateDoc(messageRef, {
            readAt: serverTimestamp(),
          })
        );
      });

      // Execute all updates
      await Promise.all(batch);
    };

    markMessagesAsRead();
  }, [currentUserId, otherUserId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate();
    const now = new Date();

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

    if (dateAtMidnight.getTime() === nowAtMidnight.getTime()) {
      return "Hoy";
    }

    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay());

    if (date >= startOfWeek) {
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

  const handleError = (error, customMessage) => {
    console.error(customMessage, error);
    Alert.alert(
      "Error",
      "Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo."
    );
    setIsSending(false);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "" || isSending) return;
    setIsSending(true);

    const chatId = getChatId(currentUserId, otherUserId);
    const batch = writeBatch(db);

    try {
      // 1. First verify the chat ID matches the security rule pattern
      if (!chatId.includes(currentUserId)) {
        throw new Error("Invalid chat ID formation");
      }

      // 2. Set up refs based on version
      const isAthlete = version === "athlete";
      const [senderRef, receiverRef] = isAthlete
        ? [doc(db, "userdata", currentUserId), doc(db, "coaches", otherUserId)]
        : [doc(db, "coaches", currentUserId), doc(db, "userdata", otherUserId)];

      // 3. Verify documents exist
      const [senderDoc, receiverDoc] = await Promise.all([
        getDoc(senderRef),
        getDoc(receiverRef),
      ]);

      if (!senderDoc.exists() || !receiverDoc.exists()) {
        throw new Error("User documents not found");
      }

      // 4. Create message with explicit sender verification
      const messageRef = doc(collection(db, `chats/${chatId}/messages`));
      const messageData = {
        text: newMessage,
        senderId: currentUserId, // Must match auth.uid in rules
        receiverId: otherUserId,
        timestamp: serverTimestamp(),
        readAt: null,
      };
      batch.set(messageRef, messageData);

      // 5. Update notifications with minimal data
      const notification = {
        type: "message",
        title: `${senderDoc.data().fullName} te envió un mensaje`,
        message: newMessage,
        imageDisplay: isAthlete
          ? senderDoc.data().character
          : senderDoc.data().image,
        uid: currentUserId,
        timestamp: new Date().toISOString(),
      };

      // Only update the notifications field
      batch.update(receiverRef, {
        notifications: arrayUnion(notification),
      });

      await batch.commit();
      setNewMessage("");
      setIsSending(false);
    } catch (error) {
      handleError(error, "Error sending message and notification");
    }
  };
  const getReadStatus = (message) => {
    if (message.senderId !== currentUserId) return null;
    return message.readAt ? (
      <Icon size={16} icon="doubleCheckGray" />
    ) : (
      <Icon size={16} icon="checkWhite" />
    );
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
        {isMyMessage && (
          <View style={styles.statusContainer}>{getReadStatus(item)}</View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground source={chatBackground} style={styles.background}>
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
            editable={!isSending}
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
            disabled={isSending}
          >
            <Icon icon="send" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    opacity: 1,
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
    backgroundColor: "#EE464B",
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
  statusContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#E81D23",
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  sendButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ChatScreen;
