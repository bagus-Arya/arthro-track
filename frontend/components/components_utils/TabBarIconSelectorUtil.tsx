import { Icon } from "react-native-paper";

export default function TabBarIconSeletorUtil(name_route: string, color: string, size: number) {
  if (name_route == "home") {
    return <Icon source="home-circle-outline" color={color} size={size} />;
  } else if (name_route == "timers") {
    return <Icon source="timer-outline" color={color} size={size} />;
  } else if (name_route == "penyiraman") {
    return <Icon source="water-pump" color={color} size={size} />;
  } else {
    return <Icon source="history" color={color} size={size} />;
  }
}
