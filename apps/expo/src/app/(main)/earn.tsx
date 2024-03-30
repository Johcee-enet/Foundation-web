import { Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "@/components/header";
import { FontAwesome6 } from "@expo/vector-icons";

export default function EarnPage() {
  const { top } = useSafeAreaInsets();

  return (
    <SafeAreaView className="bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView className="min-h-screen w-full bg-[#F5F5F5]">
            <Stack.Screen
              options={{
                headerShown: true,
                header: () => <Header top={top} />,
              }}
            />
            <View className="flex w-full flex-col px-[20px] py-4">
              <View className="w-full items-center justify-center gap-2">
                <Text className="text-center font-[nunito] font-light text-black">
                  Total XP
                </Text>
                <Text className="text-center font-[nunito] text-xl font-medium text-black">
                  420,000,000
                </Text>
                <Text className="text-center font-[nunito] text-lg font-light">
                  Simple task for more points {"\n"} The more points you have,
                  the higher you will climb on the leaderboard and get a bigger
                  $EN Airdrop.
                </Text>
              </View>

              <View className="my-3" />

              <View className="flex w-full flex-row flex-wrap items-start justify-center gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <View
                    key={index}
                    className="flex w-[48%] flex-col items-center justify-between rounded-lg bg-[#EBEBEB] p-2"
                  >
                    <View className="flex w-full flex-row items-center justify-start gap-4 rounded-lg bg-[#DADADA]">
                      <FontAwesome6
                        name="square-x-twitter"
                        size={24}
                        color="black"
                      />
                      {index === 0 && <Text>Make a post</Text>}
                      {index === 1 && <Text>Like & Repost</Text>}
                      {index === 2 && <Text>Comment on post</Text>}
                      {index === 3 && <Text>Like post</Text>}
                    </View>
                    <Text className="my-6 font-[nunito] text-2xl font-medium tracking-wider">
                      +{index % 2 === 0 ? "100" : "50"} Xp
                    </Text>

                    <TouchableOpacity
                      disabled={index !== 1}
                      className="w-full items-center justify-center rounded-md bg-black p-2 disabled:bg-black/30"
                    >
                      <Text className="font-[nunito] font-medium text-white">
                        {index === 1 ? "Claim" : "Go"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
