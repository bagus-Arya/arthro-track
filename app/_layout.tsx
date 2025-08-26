import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Mulish-Black": require("../assets/fonts/Mulish-Black.ttf"),
    "Mulish-BlackItalic": require("../assets/fonts/Mulish-BlackItalic.ttf"),
    "Mulish-Bold": require("../assets/fonts/Mulish-Bold.ttf"),
    "Mulish-BoldItalic": require("../assets/fonts/Mulish-BoldItalic.ttf"),
    "Mulish-ExtraBold": require("../assets/fonts/Mulish-ExtraBold.ttf"),
    "Mulish-ExtraBoldItalic": require("../assets/fonts/Mulish-ExtraBoldItalic.ttf"),
    "Mulish-ExtraLight": require("../assets/fonts/Mulish-ExtraLight.ttf"),
    "Mulish-ExtraLightItalic": require("../assets/fonts/Mulish-ExtraLightItalic.ttf"),
    "Mulish-Italic": require("../assets/fonts/Mulish-Italic.ttf"),
    "Mulish-Light": require("../assets/fonts/Mulish-Light.ttf"),
    "Mulish-LightItalic": require("../assets/fonts/Mulish-LightItalic.ttf"),
    "Mulish-Medium": require("../assets/fonts/Mulish-Medium.ttf"),
    "Mulish-MediumItalic": require("../assets/fonts/Mulish-MediumItalic.ttf"),
    "Mulish-Regular": require("../assets/fonts/Mulish-Regular.ttf"),
    "Mulish-SemiBold": require("../assets/fonts/Mulish-SemiBold.ttf"),
    "Mulish-SemiBoldItalic": require("../assets/fonts/Mulish-SemiBoldItalic.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="create_account" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
