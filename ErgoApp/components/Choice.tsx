import { View, Text, Image, ScrollView } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../scripts/icons";
import { router } from "expo-router";
import { GetCountries, GetState } from "react-country-state-city";

import { categories } from "../scripts/categories";
import { useUser } from "../contexts/UserContext";
import { Athlete } from "../types/Athletes.js";
import { Coach } from "../types/Coach.js";
import { getPropertyValue } from "../utils/utils";
import { ContextKey, useContextAccessor } from "../contexts/contextUtils";
import Search from "./Search";

const Choice = ({
  category,
  title,
  context = "user",
}: {
  category: string;
  title: string;
  context?: ContextKey;
}) => {
  const { userData, setUserData } = useUser();
  const { getData, setData } = useContextAccessor(context);

  const [selectedOption, setSelectedOption] = useState(
    (getData() as any)?.[category]
  );
  const [options, setOptions] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadOptions = async () => {
      if (category === "country") {
        try {
          const countries = await GetCountries();
          setOptions(countries.map((country: any) => country.name));
        } catch (error) {
          console.error("Error loading countries:", error);
          setOptions([]);
        }
      } else if (category === "state") {
        const currentData = getData() as Athlete;
        if (currentData?.country) {
          try {
            const countryList = await GetCountries();
            const selectedCountry = countryList.find(
              (c: any) => c.name === currentData.country
            );
            if (selectedCountry) {
              const states = await GetState(selectedCountry.id);
              setOptions(states.map((state: any) => state.name));
            } else {
              setOptions([]);
            }
          } catch (error) {
            console.error("Error loading states:", error);
            setOptions([]);
          }
        } else {
          setOptions([]);
        }
      } else {
        setOptions((categories as any)[category] || []);
      }
    };

    loadOptions();
  }, [category, getData()]);

  const filterOptions = (options: string[], search: string) => {
    if (search === "") {
      return options;
    }

    if (!options || options.length === 0) {
      return [];
    }

    return options?.filter((option) =>
      option.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <ScrollView
      className="w-full bg-white h-[90vh]"
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {options.length > 5 && (
        <Search
          category={category}
          context={context}
          search={search}
          setSearch={setSearch}
          field={title}
        />
      )}
      {filterOptions(options, search).map((e: any, i: number) => (
        <TouchableOpacity
          key={i}
          className={`border border-gray border-r-0 border-l-0 border-t-0 w-[95%] h-12 border-opacity-20 flex justify-center ${
            i === options.length - 1 ? "border-b-0" : ""
          }`}
          onPress={() => {
            const currentData = getData();
            if (currentData) {
              setData({
                ...currentData,
                [category]: e,
              });
            }
            router.back();
          }}
        >
          <Text className="text-lg">{e}</Text>
          {selectedOption === e && (
            <Image
              source={icons.check}
              className="absolute right-5  h-8 w-8"
              resizeMode="contain"
            ></Image>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Choice;
