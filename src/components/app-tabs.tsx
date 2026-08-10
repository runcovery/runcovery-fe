import { useColorScheme } from "react-native";

import ConditionIcon from "@/assets/images/tabIcons/condition.svg";
import HomeIcon from "@/assets/images/tabIcons/home.svg";
import ManageIcon from "@/assets/images/tabIcons/manage.svg";
import MissionIcon from "@/assets/images/tabIcons/mission.svg";
import MyIcon from "@/assets/images/tabIcons/my.svg";
import { Colors } from "@/constants/theme";
import { Tabs } from "expo-router";

const DEFAULT_ICON_COLOR = "#9FA3A8";
const SELECTED_ICON_COLOR = "#725AF5";

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: SELECTED_ICON_COLOR,
        tabBarInactiveTintColor: DEFAULT_ICON_COLOR,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => (
            <HomeIcon width={28} height={28} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="mission"
        options={{
          title: "미션",
          tabBarIcon: ({ color }) => (
            <MissionIcon width={20} height={27} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="condition"
        options={{
          title: "컨디션",
          tabBarIcon: ({ color }) => (
            <ConditionIcon width={27} height={27} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="manage"
        options={{
          title: "사후관리",
          tabBarIcon: ({ color }) => (
            <ManageIcon width={26} height={26} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="my"
        options={{
          title: "마이페이지",
          tabBarIcon: ({ color }) => (
            <MyIcon width={26} height={26} fill={color} />
          ),
        }}
      />
    </Tabs>
  );
}
