import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <SafeAreaView edges={["bottom"]}>
      <View className="bg-white flex flex-row py-2" style={{ elevation: 3, borderTopWidth: 1, borderTopColor: "#E0E0E0" }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          // Define icon + label once
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
          let tabLabel = "Home";
          if (route.name === "profile") {
            iconName = "person-outline";
            tabLabel = "Profile";
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 justify-center items-center"
            >
              <View
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: 80,
                  borderRadius: 12, // always keep radius
                  backgroundColor: isFocused ? "#DBFAFF" : "#FFFFFF", // never transparent
                  borderColor: "#E0E0E0",
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                }}
              >
                <Ionicons name={iconName} color="#000000" size={30} />
                <Text className="text-sm font-mulish_regular text-black">{tabLabel}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default CustomTabBar;
