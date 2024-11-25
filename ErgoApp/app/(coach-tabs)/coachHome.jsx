import { View, Text, ScrollView, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CustomFlatlist from "../../components/CustomFlatlist";
import UserContext from "../../contexts/UserContext";
import icons from "../../scripts/icons";
import ActivitySummary from "../../components/ActivitySummary";
import NotificationDisplay from "../../components/NotificationDisplay";
import CoachContext from "../../contexts/CoachContext";
const coachHome = () => {
  const { user, setUser } = useContext(UserContext);
  const { coachInfo, setCoachInfo } = useContext(CoachContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeNotificationIndex, setActiveNotificationIndex] = useState(0);
  const day = new Date()
    .toLocaleString("es", { weekday: "long" })
    .replace(/^(\w)/, (c) => c.toUpperCase());
  const activitiesToday = coachInfo.classes.filter((activity) =>
    activity.time[0].days.includes(day)
  );
  const flatlistData = activitiesToday
    ? Array.from({ length: activitiesToday.length }, (_, i) => ({
        key: i,
      }))
    : [];

  const notificationsFlatlistData = coachInfo.notifications
    ? Array.from({ length: coachInfo.notifications.length }, (_, i) => ({
        key: i,
      }))
    : [];

  const renderActivities = (activity) => (
    <ActivitySummary index={activity?.key} />
  );
  const renderNotifications = (notification) => (
    <NotificationDisplay index={notification?.key} />
  );

  return (
    <ScrollView>
      <View className="mt-20 w-full self-center justify-start pl-4">
        <View className="flex flex-row gap-4 items-center">
          <Text className="font-pregular text-h2">Hola {user.fullName}!</Text>
          <Image
            resizeMode="contain"
            className="h-10 w-10"
            source={icons.hand}
          />
        </View>
      </View>
      <Text className="text-2xl font-pregular mt-8 ml-4">
        Actividades de Hoy
      </Text>
      {activitiesToday.length === 0 ? (
        <View className="shadow-sm w-[85vw] self-center h-40 flex items-center justify-center p-4 bg-white rounded-2xl mt-4">
          <Text className="text-16 font-plight  ">
            No tienes actividades programadas para hoy
          </Text>
        </View>
      ) : (
        <CustomFlatlist
          data={flatlistData}
          renderContent={renderActivities}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          height={240}
        />
      )}

      <Text className="font-pregular text-h3 mt-4 ml-4">Notificaciones</Text>
      <CustomFlatlist
        data={notificationsFlatlistData}
        renderContent={renderNotifications}
        activeIndex={activeNotificationIndex}
        setActiveIndex={setActiveNotificationIndex}
        height={220}
      />
    </ScrollView>
  );
};

export default coachHome;
