// import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function MainLayout() {
  return (
    <SafeAreaProvider>
      {/* <GestureHandlerRootView> */}
      <Stack screenOptions={{}}>
        <Stack.Screen name="dashboard" options={{}} />
        <Stack.Screen name="history" options={{ headerShown: false }} />
        <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
        <Stack.Screen name="earn" options={{ headerShown: false }} />
      </Stack>
      {/* </GestureHandlerRootView> */}
      <StatusBar style="dark" translucent hideTransitionAnimation="fade" />
    </SafeAreaProvider>
  );
}
