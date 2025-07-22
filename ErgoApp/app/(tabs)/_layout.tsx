// app/(tabs)/_layout.tsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useUser } from "../../contexts/UserContext";
import icons from "../../scripts/icons.js";

interface TabIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
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
  const { userData } = useUser();

  const handleProfilePress = () => {
    router.push("/myProfile"); // Updated navigation path
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={handleProfilePress}
        className="absolute right-4 top-16 z-50 rounded-full overflow-hidden bg-white"
      >
        <Image
          className="w-14 h-14"
          source={
            icons[
              ((userData as any)?.character || "Emily") as keyof typeof icons
            ]
          }
          resizeMode="contain"
        />
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
          name="train"
          options={{
            title: "Entrenar",
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
          name="myMessages"
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
