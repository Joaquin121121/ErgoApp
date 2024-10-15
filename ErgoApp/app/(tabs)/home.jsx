import { useContext, useEffect, useState, useRef } from "react";
import { View, Text, Image, FlatList, ScrollView } from "react-native";
import UserContext from "../../contexts/UserContext";
import StreakDisplay from "../../components/StreakDisplay";
import icons from "../../scripts/icons.js";
import ProgressDisplay from "../../components/ProgressDisplay.jsx";

const Home = () => {
  const { user } = useContext(UserContext);
  const [itemBeingShown, setItemBeingShown] = useState(0);
  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const gamificationFeatures = user.gamificationFeatures;
  const data = Object.keys(gamificationFeatures).map((e, i) => {
    return { key: i.toString(), data: gamificationFeatures[e] };
  });

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setItemBeingShown(viewableItems[0].item.key); // Set the key of the first viewable item
    }
  };

  const flatListRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current.scrollToOffset({ offset: 12, animated: false });
    }, 200);
  }, []);

  return (
    <ScrollView>
      <View className="flex flex-row mt-20 w-full self-center justify-between shadow-lg pl-4 pr-4">
        <View className="flex flex-row gap-4 items-center">
          <Text className="font-pregular text-h2">Hola Aníbal</Text>
          <Image
            resizeMode="contain"
            className="h-10 w-10"
            source={icons.hand}
          />
        </View>
        <View className="w-12 h-12 rounded-full bg-gray"></View>
      </View>
      <Text className="font-pregular text-h3 mt-8  ml-4">Racha</Text>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={{ height: 180, overflow: "hidden" }}
        data={data}
        horizontal={true}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <StreakDisplay gamificationFeatures={user.gamificationFeatures} />
        )}
        snapToAlignment="center"
        snapToInterval={420}
        decelerationRate={"fast"}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        showsHorizontalScrollIndicator={false}
      />
      <View className="w-22 h-3 self-center gap-2 flex-row mt-2">
        {data.map((_, i) => (
          <View
            className={`h-3 w-3 rounded-full bg-${
              i === parseInt(itemBeingShown) ? "secondary" : "gray"
            }`}
          ></View>
        ))}
      </View>
      <Text className="font-pregular text-h3 mt-8 mb-4 ml-4">Mi Progreso</Text>
      <ProgressDisplay />
    </ScrollView>
  );
};

export default Home;
