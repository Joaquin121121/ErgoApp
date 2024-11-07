import CustomButton from "./CustomButton";
const FilledButton = ({
  title,
  isLoading,
  onPress,
  containerStyles,
  textStyles,
}) => {
  return (
    <CustomButton
      onPress={onPress}
      title={title}
      isLoading={isLoading}
      containerStyles={`bg-secondary ${containerStyles}`}
      textStyles={`text-primary ${textStyles}`}
    />
  );
};

export default FilledButton;
