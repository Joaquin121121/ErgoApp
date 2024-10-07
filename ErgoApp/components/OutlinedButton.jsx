import CustomButton from "./CustomButton";
const OutlinedButton = ({
  title,
  isLoading,
  handlePress,
  containerStyles,
  textStyles,
}) => {
  return (
    <CustomButton
      onPress={handlePress}
      title={title}
      isLoading={isLoading}
      containerStyles={`bg-offWhite ${containerStyles}`}
      textStyles={`text-secondary ${textStyles}`}
    />
  );
};

export default OutlinedButton;
