// app/(tabs)/_layout.jsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useContext } from "react";

import icons from "../../scripts/icons.js";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="w-[25vw] items-center justify-center mt-6">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-pmedium" : "font-pregular"} text-xs`}
        style={{ color: focused ? "black" : "#9E9E9E" }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const router = useRouter();
  const { user, version } = useContext(UserContext);
  const { coachInfo } = useContext(CoachContext);
  const handleProfilePress = () => {
    router.push("myProfile"); // Updated navigation path
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={handleProfilePress}
        className="absolute right-4 top-16 z-50 "
      >
        {!(version === "coach" && !coachInfo.image?.length) ? (
          <Image
            className="w-14 h-14 rounded-full"
            source={
              version === "athlete"
                ? icons[user.character]
                : { uri: coachInfo.image }
            }
            resizeMethod="contain"
          />
        ) : (
          <View className="w-14 h-14 rounded-full bg-darkGray" />
        )}
      </TouchableOpacity>

      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#E81D23",
          tabBarStyle: {
            backgroundColor: "#F9F9F9",
          },
        }}
      >
        <Tabs.Screen
          name="coachHome"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="coachClasses"
          options={{
            title: "Mis Clases",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.dumbbell}
                color={color}
                name="Entrenar"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="coachAthletes"
          options={{
            title: "Mis Alumnos",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.person}
                color={color}
                name="Alumnos"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="coachCalendar"
          options={{
            title: "Calendario",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.calendar}
                color={color}
                name="Calendario"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="coachMessages"
          options={{
            title: "Mensajes",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.chat}
                color={color}
                name="Mensajes"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabsLayout;
