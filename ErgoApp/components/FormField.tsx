import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { KeyboardTypeOptions, TextInput } from "react-native";
import icons from "../scripts/icons.js";
import Icon from "./Icon";
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
  icon,
  keyboardType,
  onFocusInput,
  onBlurInput,
  ...props
}: {
  title?: string;
  value?: string;
  placeholder?: string;
  handleChangeText?: (text: string) => void;
  otherStyles?: string;
  toggleVisibility?: () => void;
  pickerVisible?: boolean;
  onChange?: (e: any) => void;
  maxLength?: number;
  onEnter?: () => void;
  multiline?: boolean;
  date?: boolean;
  icon?: keyof typeof icons;
  keyboardType?: KeyboardTypeOptions;
  onFocusInput?: (title: string) => void;
  onBlurInput?: () => void;
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
            onFocus={() => {
              if (onFocusInput && title) onFocusInput(title);
            }}
            onBlur={() => {
              if (onBlurInput) onBlurInput();
            }}
            onChange={onChange}
            onSubmitEditing={onEnter}
            {...(maxLength !== undefined && { maxLength })}
            multiline={multiline}
            textAlignVertical={multiline ? "top" : "center"}
            numberOfLines={multiline ? 4 : 1}
            keyboardType={keyboardType}
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
        {icon && <Icon icon={icon} size={24} style={{ marginRight: 10 }} />}
      </View>
    </View>
  );
};

export default FormField;
