import { createContext, useContext, useEffect, useState, useRef } from "react";
import UserContext from "./UserContext";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../scripts/firebase";

const ChatContext = createContext();
const COACHES_STORAGE_KEY = "cached_coaches";
const CURRENT_COACH_KEY = "current_coach_id";

export function ChatProvider({ children }) {
  const [coaches, setCoaches] = useState({}); // Changed to object instead of array
  const [currentRecipient, setCurrentRecipient] = useState("");
  const { user } = useContext(UserContext);
  const previousCoaches = useRef([]);

  // Debug logging
  useEffect(() => {
    console.log("Current user:", user);
    console.log("User coaches:", user?.coaches);
    console.log("Current coaches state:", coaches);
  }, [user, coaches]);

  // Load cached data
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const [cached, savedCoachId] = await Promise.all([
          AsyncStorage.getItem(COACHES_STORAGE_KEY),
          AsyncStorage.getItem(CURRENT_COACH_KEY),
        ]);

        console.log("Loaded cached coaches:", cached);
        if (cached) {
          const parsedCoaches = JSON.parse(cached);
          setCoaches(parsedCoaches);
          console.log("Set cached coaches:", parsedCoaches);
        }
      } catch (error) {
        console.error("Error loading cached data:", error);
      }
    };

    loadInitialState();
  }, []);

  // Fetch coaches when user.coaches changes
  useEffect(() => {
    const coachesList = user?.coaches || [];
    console.log("Coaches list from user:", coachesList);

    const fetchCoaches = async () => {
      try {
        if (!user || coachesList.length === 0) {
          console.log("No coaches to fetch, clearing coaches object");
          setCoaches({});
          await AsyncStorage.setItem(COACHES_STORAGE_KEY, "{}");
          return;
        }

        console.log("Fetching coaches for IDs:", coachesList);
        const coachPromises = coachesList.map(async (coachId) => {
          try {
            const coachDoc = await getDoc(doc(db, "coaches", coachId));

            if (!coachDoc.exists()) {
              console.log(`No coach found for ID: ${coachId}`);
              return null;
            }

            const coachData = coachDoc.data();
            console.log(`Coach data for ${coachId}:`, coachData);

            return {
              id: coachId,
              data: {
                name: coachData.name || coachId,
                lastUpdated: Date.now(),
              },
            };
          } catch (error) {
            console.error(`Error fetching coach ${coachId}:`, error);
            return null;
          }
        });

        const coachesData = (await Promise.all(coachPromises))
          .filter(Boolean)
          .reduce((acc, coach) => {
            acc[coach.id] = coach.data;
            return acc;
          }, {});

        console.log("Fetched coaches data:", coachesData);

        if (Object.keys(coachesData).length > 0) {
          setCoaches(coachesData);
          await AsyncStorage.setItem(
            COACHES_STORAGE_KEY,
            JSON.stringify(coachesData)
          );
          console.log("Updated coaches in state and storage:", coachesData);
        }
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };

    // Only fetch if the coaches list has changed
    if (
      JSON.stringify(coachesList) !== JSON.stringify(previousCoaches.current)
    ) {
      console.log("Coaches list changed, updating...");
      previousCoaches.current = coachesList;
      fetchCoaches();
    }
  }, [user?.coaches]);

  const contextValue = {
    coaches,
    currentRecipient,
    setCurrentRecipient,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

export default ChatContext;
