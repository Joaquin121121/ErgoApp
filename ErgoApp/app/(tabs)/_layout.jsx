import { View, Text, Image } from "react-native";
import { Tabs, Redirect } from "expo-router";

import icons from "../../scripts/icons.js";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-1 mt-3">
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
  return (
    <>
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
          name="home"
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
          name="myStudies"
          options={{
            title: "Estudios",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.myStudies}
                color={color}
                name="Estudios"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="myStats"
          options={{
            title: "Progreso",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.myStats}
                color={color}
                name="Progreso"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="myProfile"
          options={{
            title: "Mi Perfil",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.myProfile}
                color={color}
                name="Mi Perfil"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
