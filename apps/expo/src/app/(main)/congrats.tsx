import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  // Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// import { Stack } from "expo-router";

export default function Congrats() {
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = useSafeAreaFrame();

  console.log(top, bottom, width, height, ":::frame sizes");

  return (
    <SafeAreaView className="bg-background">
      <KeyboardAvoidingView behavior={"position"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView className="min-h-screen w-full bg-[#000000]">
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#15BDCF",
                  width: "100%",
                  paddingHorizontal: 20,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 15,
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "white" }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
