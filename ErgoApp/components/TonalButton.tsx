import CustomButton from "./CustomButton";
const TonalButton = ({
  title,
  onPress,
  isLoading,
  containerStyles,
  textStyles,
  icon,
  inverse,
}: {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  containerStyles?: string;
  textStyles?: string;
  icon?: string;
  inverse?: boolean;
}) => {
  return (
    <CustomButton
      onPress={onPress}
      title={title}
      isLoading={isLoading}
      containerStyles={`bg-secondary ${containerStyles}`}
      textStyles={`text-white ${textStyles}`}
      icon={icon}
      inverse={inverse}
    />
  );
};

export default TonalButton;
