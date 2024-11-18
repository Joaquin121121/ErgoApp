import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";
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
  multiline,
  date,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={` w-full ${otherStyles}`}>
      <Text className="text-darkGray font-pregular mb-1 text-16">{title}</Text>
      <View
        className={`w-full bg-white rounded-2xl shadow-sm flex-row items-center px-4 ${
          multiline ? "min-h-[120px] py-2" : "h-12"
        }`}
      >
        {date ? (
          <TouchableOpacity
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
          </TouchableOpacity>
        ) : (
          <TextInput
            className={`flex-1 text-black font-pregular text-base ${
              multiline ? "h-full text-left" : "h-[90%]"
            }`}
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
            multiline={multiline}
            textAlignVertical={multiline ? "top" : "center"}
            numberOfLines={multiline ? 4 : 1}
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
