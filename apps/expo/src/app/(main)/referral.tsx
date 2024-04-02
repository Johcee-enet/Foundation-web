// import DashboardHeader from "@/components/dashboard_header";
import {
  Alert,
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
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { Stack, useLocalSearchParams } from "expo-router";
import Header from "@/components/header";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";

import type { Id } from "@acme/api/convex/_generated/dataModel";
import { api } from "@acme/api/convex/_generated/api";

export default function ReferralPage() {
  const { top } = useSafeAreaInsets();
  const params = useLocalSearchParams();

  // Fetch users data
  const userDetail = useQuery(api.queries.getUserDetails, {
    userId: params?.userId as Id<"user">,
  });

  const historyDetails = useQuery(api.queries.getOnlyXpHistory, {
    userId: params?.userId as Id<"user">,
  });

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(userDetail?.referralCode ?? "");
  };

  return (
    <SafeAreaView className="bg-background">
      <KeyboardAvoidingView behavior={"position"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView className="min-h-screen w-full bg-[#F5F5F5]">
            <Stack.Screen
              options={{
                headerShown: true,
                header: () => <Header top={top} />,
              }}
            />

            <View className="flex h-full w-full flex-1 flex-col py-4">
              <View
                style={{ gap: 10 }}
                className="flex w-full flex-col px-[20px]"
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "500" }}
                  className="font-[nunito]"
                >
                  Refer your friends and share up to 1000XPs on each referrals
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: "400" }}
                  className="font-[nunito]"
                >
                  Your friends get 500 Xp when they signup with your referral
                  code
                </Text>
              </View>

              <View style={{ marginVertical: 10 }} />
              <View className="px-[20px]">
                <TouchableOpacity
                  onPress={async () => {
                    await copyToClipboard();
                    Alert.alert("Link copied to clipboard");
                  }}
                  className="flex w-36 flex-row items-center justify-center gap-2 rounded-lg bg-black px-3 py-2"
                >
                  <SimpleLineIcons name="share-alt" size={18} color="white" />
                  <Text
                    style={{ fontSize: 13 }}
                    className="font-[nunito] text-white"
                  >
                    Share code
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginVertical: 20 }} />
              <View className="flex w-full flex-1 flex-col gap-4 rounded-t-3xl bg-white px-[20px] py-5 pb-24">
                <View className="flex flex-row items-center justify-between">
                  <Text className="font-[nunito] text-lg">Referrals</Text>
                  <Text className="font-[nunito] text-lg font-normal">
                    {(userDetail?.referralCount ?? 0).toLocaleString("en-US")}
                  </Text>
                </View>

                <FlashList
                  data={historyDetails ?? []}
                  renderItem={({ item }) => (
                    <View className="my-2 flex flex-row items-center justify-between rounded-lg bg-[#EBEBEB] p-4">
                      <View className="flex flex-row items-center justify-center gap-2">
                        {/* <Text className="font-[nunito]">{index + 1}.</Text> */}
                        <Text
                          style={{ fontSize: 14, fontWeight: "400" }}
                          className="font-[nunito]"
                        >
                          {item?.message}
                        </Text>
                      </View>

                      <Text
                        style={{ fontSize: 14, fontWeight: "600" }}
                        className="font-[nunito]"
                      >
                        +{item?.extra} XP
                      </Text>
                    </View>
                  )}
                  estimatedItemSize={
                    historyDetails ? historyDetails.length + 200 : 200
                  }
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
