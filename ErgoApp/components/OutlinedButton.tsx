import { MaterialCommunityIcons } from "@expo/vector-icons";
import icons from "../scripts/icons";
import CustomButton from "./CustomButton";
const OutlinedButton = ({
  title,
  isLoading,
  onPress,
  containerStyles,
  textStyles,
  icon,
  inverse,
  customIcon,
}: {
  title: string;
  isLoading?: boolean;
  onPress: () => void;
  containerStyles?: string;
  textStyles?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  inverse?: boolean;
  customIcon?: keyof typeof icons;
}) => {
  return (
    <CustomButton
      onPress={onPress}
      title={title}
      isLoading={isLoading}
      containerStyles={`bg-offWhite ${containerStyles} border border-lightRed`}
      textStyles={`text-secondary ${textStyles}`}
      icon={icon}
      inverse={inverse}
      customIcon={customIcon}
      iconColor="#e81d23"
      iconSize={24}
    />
  );
};

export default OutlinedButton;
