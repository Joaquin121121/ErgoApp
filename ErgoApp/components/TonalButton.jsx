import CustomButton from "./CustomButton";
const TonalButton = ({
  title,
  isLoading,
  onPress,
  containerStyles,
  textStyles,
  icon,
}) => {
  return (
    <CustomButton
      onPress={onPress}
      title={title}
      isLoading={isLoading}
      containerStyles={`bg-secondary ${containerStyles}`}
      textStyles={`text-white ${textStyles}`}
      icon={icon}
    />
  );
};

export default TonalButton;
