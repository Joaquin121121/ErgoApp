import { useContext, useEffect } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { FlatList } from "react-native-web";
import UserContext from "../../contexts/UserContext";
import StreakDisplay from "../../components/StreakDisplay";
const Home = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <View className="w-full h-16 mt-16">
      <StreakDisplay></StreakDisplay>
    </View>
  );
};

export default Home;
