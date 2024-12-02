// ImageUploadButton.js
import React, { useContext, useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db, storage } from "../scripts/firebase";
import OutlinedButton from "./OutlinedButton";
import CoachContext from "../contexts/CoachContext";

const ImageUploadButton = ({
  onUploadSuccess,
  onUploadCancel,
  containerStyles,
  onPress,
}) => {
  const [uploading, setUploading] = useState(false);
  const { coachInfo, setCoachInfo } = useContext(CoachContext);
  const auth = getAuth();

  const pickImage = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in to upload an image");
      return;
    }

    try {
      if (onPress) onPress();

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to access your photos"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (result.canceled) {
        if (onUploadCancel) onUploadCancel();
        return;
      }

      const downloadURL = await uploadImage(result.assets[0].uri);
      if (downloadURL) {
        setCoachInfo({ ...coachInfo, image: downloadURL });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error(error);
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      const userId = auth.currentUser.uid;
      console.log("Starting upload process for user:", userId);

      // Convert URI to blob
      const fetchResponse = await fetch(uri);
      const blob = await fetchResponse.blob();
      console.log("Blob created successfully, size:", blob.size);

      // Use exact path matching storage rules
      const filename = `coach_profiles/${userId}/profile_image`;
      console.log("Using storage path:", filename);

      const storageRef = ref(storage, filename);

      // Simple metadata
      const metadata = {
        contentType: "image/jpeg",
      };

      console.log("Beginning upload...");
      await uploadBytes(storageRef, blob, metadata);
      console.log("Upload successful");

      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL obtained:", downloadURL);

      // Update Firestore
      const coachRef = doc(db, "coaches", userId);
      await updateDoc(coachRef, {
        image: downloadURL,
        imageUpdatedAt: new Date().toISOString(),
      });

      Alert.alert("Éxito", "Imagen cargada exitosamente!");
      onUploadSuccess?.(downloadURL);

      return downloadURL; // Add this line to return the URL
    } catch (error) {
      console.error("Upload error details:", error);

      if (error.code === "storage/unauthorized") {
        Alert.alert(
          "Error",
          "Permission denied. Please check your account permissions."
        );
      } else if (error.code === "storage/canceled") {
        Alert.alert("Error", "Upload was canceled.");
      } else if (error.code === "storage/unknown") {
        Alert.alert(
          "Error",
          "An unknown error occurred. Please check your internet connection and try again."
        );
      } else {
        Alert.alert("Error", "Failed to upload image. Please try again.");
      }
      return null; // Add this to handle error case
    } finally {
      setUploading(false);
    }
  };
  return (
    <OutlinedButton
      title="Subir Imagen"
      icon="upload"
      onPress={pickImage}
      containerStyles={containerStyles}
    >
      {uploading ? (
        <>
          <ActivityIndicator
            color="#ffffff"
            size="small"
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: "#ffffff" }}>Uploading...</Text>
        </>
      ) : (
        <Text style={{ color: "#ffffff" }}>Upload Profile Image</Text>
      )}
    </OutlinedButton>
  );
};

export default ImageUploadButton;
