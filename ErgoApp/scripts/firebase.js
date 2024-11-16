import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqITMscQgYZ7NUWBtcfUFlWUCzIxU2u14",
  authDomain: "ergoapp-a441f.firebaseapp.com",
  projectId: "ergoapp-a441f",
  storageBucket: "ergoapp-a441f.appspot.com",
  messagingSenderId: "4617838189",
  appId: "1:4617838189:web:d4c61676e33ea5e0c32964",
  measurementId: "G-SQNJ60PV3E",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
export { auth, app, db };
