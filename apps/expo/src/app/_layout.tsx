import "../styles.css";

import { router, Stack } from "expo-router";
import * as Updates from "expo-updates";
// Convex provider and client

import { ConvexProvider, ConvexReactClient } from "convex/react";

import "react-native-get-random-values";

import { useEffect } from "react";
import { Alert } from "react-native";
import { getData } from "@/storageUtils";
import { Env } from "@env";

const convex = new ConvexReactClient(Env.CONVEX_URL, {
  unsavedChangesWarning: false,
});

export default function Layout() {
  useEffect(() => {
    // Check if user is logged in
    onFetchUpdateAsync().catch((result) =>
      console.log(result, ":::_layout.tsx file"),
    );

    function checkUserLoggedIn() {
      const user = getData("@enet-store/user", true) as Record<string, any>;
      if (user) {
        router.replace({ pathname: "/(main)/dashboard", params: { ...user } });
      }
    }

    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          Alert.alert(
            "Updating app",
            "Wait for latest update to be fetched...",
          );
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        } else {
          checkUserLoggedIn();
        }
      } catch (error: any) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        Alert.alert("Update error", `Error fetching latest update: ${error}`, [
          {
            text: "Continue to app",
            onPress() {
              checkUserLoggedIn();
            },
          },
        ]);
      }
    }
  }, []);

  return (
    <ConvexProvider client={convex}>
      <Stack
        initialRouteName="/(onboarding)/"
        // initialRouteName="tasks"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="tasks" options={{ headerShown: false }} /> */}
      </Stack>
    </ConvexProvider>
  );
}
