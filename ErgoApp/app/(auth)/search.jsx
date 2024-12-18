import React from "react";
import Search from "../../components/Search";
import { useLocalSearchParams } from "expo-router";

const choice = () => {
  const { category, title, context } = useLocalSearchParams();
  return <Search category={category} title={title} context={context} />;
};

export default choice;
