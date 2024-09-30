import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import icons from "../scripts/icons.js";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 w-full ${otherStyles}`}>
      <Text className="text-base text-black-100 font-p-medium">{title}</Text>
      <View className="w-full h-16 px-4 bg-white rounded-2xl focus:border-red-600 flex-row  items-center">
        <TextInput
          className="flex-1 text-black font-pregular text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#9E9E9E"
          onChangeText={handleChangeText}
          autoCapitalize="none"
          secureTextEntry={title === "Password" && !showPassword}
        />

        {title === "Contraseña" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
