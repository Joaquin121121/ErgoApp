import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import icons from "../scripts/icons.js";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  toggleVisibility,
  pickerVisible,
  onChange,
  maxLength,
  onEnter,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 w-full ${otherStyles}`}>
      <Text className="text-base text-black-100 font-p-medium">
        {title === "Fecha" ? "Fecha de Nacimiento" : title}
      </Text>
      <View className="w-full h-16 px-4 bg-white rounded-2xl shadow-sm flex-row items-center">
        {title === "Fecha" ? (
          <Pressable
            className="w-full h-full flex-row items-center"
            onPress={toggleVisibility}
          >
            <Text className="flex-1 text-black font-pregular text-base ">
              {value}
            </Text>
            <Image
              source={icons.calendar}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </Pressable>
        ) : (
          <TextInput
            className="flex-1 text-black font-pregular text-base h-[90%]"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#9E9E9E"
            onChangeText={handleChangeText}
            autoCapitalize="none"
            secureTextEntry={title === "Contraseña" && !showPassword}
            onFocus={toggleVisibility}
            onBlur={toggleVisibility}
            onChange={onChange}
            onSubmitEditing={onEnter}
            {...(maxLength !== undefined && { maxLength })}
          />
        )}

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
