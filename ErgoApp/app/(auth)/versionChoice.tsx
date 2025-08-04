import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { router } from "expo-router";
import icons from "../../scripts/icons";
import Icon from "../../components/Icon";
import { useRouter } from "expo-router";
import { useUser } from "../../contexts/UserContext";
import { VideoView, useVideoPlayer } from "expo-video";

const versionChoice = () => {
  const router = useRouter();
  const [selectedVersion, setSelectedVersion] = useState<
    "coach" | "athlete" | null
  >(null);
  const { isLoggedIn } = useUser();

  // Video sources
  const coachVideoSource =
    "https://github.com/Joaquin121121/ErgoCharacters/raw/refs/heads/main/chico%20con%20lentes%20lee.mp4";
  const athleteVideoSource =
    "https://github.com/Joaquin121121/ErgoCharacters/raw/refs/heads/main/musculoso%20pose%20largo.mp4";

  // Video players
  const coachPlayer = useVideoPlayer(coachVideoSource, (player) => {
    player.play();
  });

  const athletePlayer = useVideoPlayer(athleteVideoSource, (player) => {
    player.play();
  });

  // Delayed loops for both videos
  useEffect(() => {
    const coachInterval = setInterval(() => {
      coachPlayer.currentTime = 0;
      coachPlayer.play();
    }, 5000);

    const athleteInterval = setInterval(() => {
      athletePlayer.currentTime = 0;
      athletePlayer.play();
    }, 5000);

    return () => {
      clearInterval(coachInterval);
      clearInterval(athleteInterval);
    };
  }, []);

  const handleVersionSelect = (version: "coach" | "athlete") => {
    setSelectedVersion(version);
    if (isLoggedIn) {
      router.push("/home");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <ScrollView className="pt-20">
      <Image
        source={icons.logoSimplified}
        resizeMode="contain"
        className="w-[120px] h-[120px] self-center"
        style={{ backgroundColor: "transparent" }}
      />
      <Text className=" font-pregular text-[32px] self-center">
        Bienvenido!
      </Text>
      <Text className="mt-2 font-plight text-16 text-darkGray self-center">
        Elige una opción para continuar
      </Text>
      <TouchableOpacity onPress={() => handleVersionSelect("coach")}>
        <View
          className={`w-[80vw] h-40 mt-12 self-center bg-white rounded-2xl shadow-sm flex flex-row items-center `}
        >
          <View className="w-2/5 h-full relative overflow-hidden pl-4">
            <VideoView
              player={coachPlayer}
              style={{ width: "100%", height: "100%", pointerEvents: "none" }}
            />
          </View>
          <View className="w-3/5 h-full justify-evenly items-center">
            <Text className="font-pmedium text-xl ">
              Modo <Text className="text-secondary">Coach</Text>
            </Text>
            <Icon icon="sports" size={60} />
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleVersionSelect("athlete")}>
        <View
          className={`w-[80vw] h-40 mt-8 self-center bg-white rounded-2xl shadow-sm flex flex-row items-center`}
        >
          <View className="w-2/5 h-full relative overflow-hidden pl-4">
            <VideoView
              player={athletePlayer}
              style={{
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            />
          </View>
          <View className="w-3/5 h-full justify-evenly items-center">
            <Text className="font-pmedium text-xl ">
              Modo <Text className="text-secondary">Atleta</Text>
            </Text>
            <Icon icon="dumbbellRed" size={48} />
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default versionChoice;
