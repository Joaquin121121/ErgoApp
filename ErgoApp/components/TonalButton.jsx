import CustomButton from "./CustomButton";
const TonalButton = ({
  title,
  isLoading,
  onPress,
  containerStyles,
  textStyles,
  icon,
  inverse,
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
