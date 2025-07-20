import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { categories } from "../scripts/categories";

import { router } from "expo-router";
import FormField from "./FormField";
import icons from "../scripts/icons";
import { containsText } from "../scripts/utils";
import { useUser } from "../contexts/UserContext";
import { useContextAccessor, ContextKey } from "../contexts/contextUtils";

const Search = ({
  category,
  context,
  search,
  setSearch,
  field = "disciplina",
}: {
  category: string;
  context: ContextKey;
  search: string;
  setSearch: (search: string) => void;
  field?: string;
}) => {
  const { getData, setData } = useContextAccessor(context);

  const [selectedOption, setSelectedOption] = useState(
    (getData() as any)?.[category]
  );

  const options = categories?.[category as keyof typeof categories];

  const onPress = ({ i }: { i: number }) => {
    setData({
      ...getData(),
      [category]: options[i],
    });
    router.back();
  };

  return (
    <ScrollView>
      <View className="w-full self-center justify-start mb-8">
        <FormField
          placeholder={`Buscar ${field}...`}
          value={search}
          handleChangeText={(e) => setSearch(e)}
          otherStyles="self-center w-[90vw] "
          icon="search"
        />
        {options
          ?.filter((e) => containsText(e, search))
          .map((e, i) => (
            <TouchableOpacity
              key={i}
              className={`border border-gray border-r-0 border-l-0 border-t-0 w-[95%] h-12 border-opacity-20 flex justify-center ${
                i === options.length - 1 && i !== 0 ? "border-b-0" : ""
              }`}
              onPress={() => onPress({ i })}
            >
              <Text className="text-lg">{e as string}</Text>
              {selectedOption === options[i] && (
                <Image
                  source={icons.check}
                  className="absolute right-5  h-8 w-8"
                  resizeMode="contain"
                ></Image>
              )}
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );
};

export default Search;
