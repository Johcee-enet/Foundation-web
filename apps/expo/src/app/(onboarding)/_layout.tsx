import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function OnboardingLayout() {
  // const { colorScheme } = useColorScheme();
  // console.log(colorScheme, ":::Color scheme");
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="otp" options={{}} />
        <Stack.Screen name="password" options={{}} />
        <Stack.Screen name="welcome" options={{}} />
      </Stack>
      <StatusBar
        style="dark"
        // backgroundColor="black"
        translucent
        hideTransitionAnimation="fade"
      />
    </SafeAreaProvider>
  );
}
