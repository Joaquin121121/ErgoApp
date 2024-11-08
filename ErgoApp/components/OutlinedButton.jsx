import CustomButton from "./CustomButton";
const OutlinedButton = ({
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
      containerStyles={`bg-offWhite ${containerStyles} border border-lightRed`}
      textStyles={`text-secondary ${textStyles}`}
      icon={icon}
      inverse={inverse}
    />
  );
};

export default OutlinedButton;
