import type { ConfigContext, ExpoConfig } from "@expo/config";

import { ClientEnv, Env } from "./env";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Foundation",
  slug: "enet-miner",
  scheme: "com.enetminer.enet",
  userInterfaceStyle: "automatic",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#F5F5F5",
  },
  web: {
    output: "static",
    bundler: "metro",
  },
  plugins: [
    [
      "expo-router",
      {
        origin: "https://n",
      },
    ],
    [
      "expo-updates",
      {
        username: "fullsnack_mimi",
      },
    ],
  ],
  extra: {
    ...ClientEnv,
    router: {
      origin: "https://n",
    },
    eas: {
      projectId: "8852539f-a61b-4ce3-90d9-52c939c8f2c3",
    },
  },
  owner: "fullsnack_mimi",
  android: {
    package: "com.enetminer.enet",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
    },
  },
  ios: {
    bundleIdentifier: Env.BUNDLE_ID,
    supportsTablet: false,
  },
  updates: {
    url: "https://u.expo.dev/8852539f-a61b-4ce3-90d9-52c939c8f2c3",
    requestHeaders: {
      "expo-channel-name": "preview",
    },
  },
  runtimeVersion: {
    policy: "appVersion",
  },
});
