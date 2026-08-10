import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

import ConditionIcon from "@/assets/images/tabIcons/condition.svg";
import HomeIcon from "@/assets/images/tabIcons/home.svg";
import ManageIcon from "@/assets/images/tabIcons/manage.svg";
import MissionIcon from "@/assets/images/tabIcons/mission.svg";
import MyIcon from "@/assets/images/tabIcons/my.svg";
import { Colors } from "@/constants/theme";

const DEFAULT_ICON_COLOR = "#9FA3A8";
const SELECTED_ICON_COLOR = "#725AF5";

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>홈</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: <HomeIcon fill={DEFAULT_ICON_COLOR} />,
            selected: <HomeIcon fill={SELECTED_ICON_COLOR} />,
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="mission">
        <NativeTabs.Trigger.Label>미션</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: <MissionIcon fill={DEFAULT_ICON_COLOR} />,
            selected: <MissionIcon fill={SELECTED_ICON_COLOR} />,
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="condition">
        <NativeTabs.Trigger.Label>컨디션</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: <ConditionIcon fill={DEFAULT_ICON_COLOR} />,
            selected: <ConditionIcon fill={SELECTED_ICON_COLOR} />,
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="manage">
        <NativeTabs.Trigger.Label>관리</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: <ManageIcon fill={DEFAULT_ICON_COLOR} />,
            selected: <ManageIcon fill={SELECTED_ICON_COLOR} />,
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="my">
        <NativeTabs.Trigger.Label>마이</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          src={{
            default: <MyIcon fill={DEFAULT_ICON_COLOR} />,
            selected: <MyIcon fill={SELECTED_ICON_COLOR} />,
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
