import {
  StyleSheet,
  Text,
  TouchableOpacity,
  // Platform,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router, Stack, useGlobalSearchParams } from "expo-router";

export default function Congrats() {
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = useSafeAreaFrame();
  const params = useGlobalSearchParams();

  console.log(top, bottom, width, height, ":::frame sizes");

  return (
    <SafeAreaView
      edges={["right", "bottom", "left"]}
      style={{ flex: 1, backgroundColor: "yellow" }}
      className="bg-background"
    >
      <Stack.Screen
        options={{
          headerShown: false,
          // statusBarColor: "black",
          // statusBarTranslucent: true,
          statusBarStyle: "dark",
        }}
      />
      <View
        style={{
          backgroundColor: "#000000",
          width: "100%",
          height: height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            marginTop: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <View
            style={{
              position: "relative",
              height: 300,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../../../assets/congrats/congrats_checkmark.png")}
              style={{
                width: 216,
                height: 216,
                // position: "absolute",
                // top: 0,
                // bottom: 0,
              }}
              resizeMode="contain"
            />
            <Image
              source={require("../../../assets/congrats/square.png")}
              style={{
                width: 16,
                height: 16,
                position: "absolute",
                top: 90,
                left: -20,
                // bottom: 0,
              }}
              resizeMode="contain"
            />
            <Image
              source={require("../../../assets/congrats/square.png")}
              style={{
                width: 24,
                height: 24,
                position: "absolute",
                bottom: 60,
                left: -20,
                // bottom: 0,
              }}
              resizeMode="contain"
            />
            <Image
              source={require("../../../assets/congrats/square.png")}
              style={{
                width: 24,
                height: 24,
                position: "absolute",
                top: 90,
                right: -30,
                // bottom: 0,
              }}
              resizeMode="contain"
            />
            <Image
              source={require("../../../assets/congrats/square.png")}
              style={{
                width: 14,
                height: 14,
                position: "absolute",
                bottom: 110,
                right: -20,
                // bottom: 0,
              }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              color: "#A8A8A8",
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            You Earned
          </Text>
          <Text
            style={{
              color: "#18EAFF",
              fontSize: 35,
              fontWeight: "700",
            }}
          >
            +{Number(params?.xpCount ?? 1000).toLocaleString("en-US")} XP
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.replace({
              pathname: "/(main)/dashboard",
              params: { ...params },
            });
          }}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#15BDCF",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "nunito",
    color: "white",
  },
});
