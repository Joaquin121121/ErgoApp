import CustomButton from "./CustomButton";
const TonalButton = ({
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
      containerStyles={`bg-lightRed ${containerStyles}`}
      textStyles={`text-secondary ${textStyles}`}
    />
  );
};

export default TonalButton;
