import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import icons from "../scripts/icons";
const TonalButton = ({
  title,
  onPress,
  isLoading,
  containerStyles,
  textStyles,
  icon,
  inverse,
  customIcon,
}: {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
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
      containerStyles={`bg-secondary ${containerStyles}`}
      textStyles={`text-white ${textStyles}`}
      icon={icon}
      iconColor="white"
      inverse={inverse}
      customIcon={customIcon}
    />
  );
};

export default TonalButton;
