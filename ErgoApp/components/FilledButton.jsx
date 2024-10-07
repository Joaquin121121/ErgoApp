import CustomButton from "./CustomButton";
const FilledButton = ({
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
      containerStyles={`bg-secondary ${containerStyles}`}
      textStyles={`text-primary ${textStyles}`}
    />
  );
};

export default FilledButton;
