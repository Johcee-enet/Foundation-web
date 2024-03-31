import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import Header from "@/components/header";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";

import type { Doc, Id } from "@acme/api/convex/_generated/dataModel";
import { api } from "@acme/api/convex/_generated/api";

export default function HistoryPage() {
  const params = useLocalSearchParams();
  const { top } = useSafeAreaInsets();

  const getHistory: Doc<"activity">[] | undefined = useQuery(
    api.queries.getHistory,
    {
      userId: params?.userId as Id<"user">,
    },
  );

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
                header: () => <Header top={top} title="History" />,
              }}
            />
            <View className="flex w-full flex-col px-[20px] py-4">
              <Text className="font-[nunito] text-lg font-normal text-black">
                Today
              </Text>
              <View className="w-full flex-1 pb-24">
                <FlashList
                  data={getHistory ? getHistory : []}
                  renderItem={({ item }) => (
                    <View className="my-2 flex w-full flex-row gap-3 rounded-lg bg-white p-3">
                      {item.type === "xp" && (
                        <View className="h-[32px] w-[32px] items-center justify-center rounded-lg bg-[#E2DEF0] p-3">
                          <Image
                            source={require("../../../assets/main/icons/redo.png")}
                            style={{ width: 18, height: 18 }}
                          />
                        </View>
                      )}
                      {item.type === "rank" && (
                        <View className="h-[32px] w-[32px] items-center justify-center rounded-lg bg-[#D5EEF0] p-3">
                          <Image
                            source={require("../../../assets/main/icons/microscope.png")}
                            style={{ width: 18, height: 18 }}
                          />
                        </View>
                      )}

                      {item.type === "xp" && (
                        <View className="flex flex-1 flex-col items-start justify-start">
                          <Text className="text-start font-[nunito] text-lg font-normal">
                            {item.message}
                          </Text>
                          <Text className="font-[nunito] text-black/60">
                            {new Date(item._creationTime).toLocaleTimeString()}
                          </Text>
                        </View>
                      )}

                      {item.type === "rank" && (
                        <View className="flex flex-1 flex-col items-start justify-start">
                          <Text className="text-start font-[nunito] text-lg font-normal">
                            {item.message}
                          </Text>
                          <Text className="font-[nunito]">
                            {new Date(item._creationTime).toLocaleTimeString()}
                          </Text>
                        </View>
                      )}

                      {item.type === "xp" && (
                        <Text className="mt-4 font-[nunito] text-lg font-medium">
                          {item?.extra} XP
                        </Text>
                      )}
                    </View>
                  )}
                  estimatedItemSize={getHistory ? getHistory.length + 200 : 200}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
