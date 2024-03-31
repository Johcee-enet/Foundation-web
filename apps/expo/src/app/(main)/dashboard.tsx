import type { BottomSheetMethods } from "@devvie/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import {
  // useWindowDimensions,
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  // Modal,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  SafeAreaView,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import ClaimModal from "@/components/claim_modal";
import DashboardHeader from "@/components/dashboard_header";
import { Overview } from "@/components/overview_card";
import { StatsCard } from "@/components/stats_card";
import TaskBoostCard, {
  icons,
  TaskRenderer,
} from "@/components/task_boost_card";
import BottomSheet from "@devvie/bottom-sheet";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { useAction, useMutation, useQuery } from "convex/react";
import { format } from "date-fns";

import type { Doc, Id } from "@acme/api/convex/_generated/dataModel";
import { api } from "@acme/api/convex/_generated/api";

export type EventType = Partial<Doc<"events">> & {
  company: Partial<Doc<"company">> & { logoUrl: string };
};
// type Network = "twitter" | "discord" | "telegram" | "website";
// type ActionType = "follow" | "post" | "join" | "visit";

export default function DashboardPage() {
  const params = useLocalSearchParams();
  const { top, bottom } = useSafeAreaInsets();
  const { height } = useSafeAreaFrame();
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch users data
  const userDetail = useQuery(api.queries.getUserDetails, {
    userId: params?.userId as Id<"user">,
  });
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [eventSheetContent, setEventSheetContent] = useState<
    EventType | undefined
  >();
  const [taskSheetContent, setTaskSheetContent] = useState<
    Doc<"tasks"> | undefined
  >();

  const claimReward = useMutation(api.mutations.claimRewards);
  const triggerMiner = useAction(api.mutations.triggerMining);

  // Get tasks and events
  const fetchTasks = useQuery(api.queries.fetchTasks);
  const fetchEvents = useQuery(api.queries.fetchEvents);

  useEffect(() => {
    if (
      !(userDetail?.mineActive ?? false) &&
      (userDetail?.redeemableCount ?? 0) > 0
    ) {
      setClaimModalVisible(true);
    }
  }, [userDetail?.mineActive, userDetail?.redeemableCount, userDetail]);

  // EVent bottom sheet
  const eventSheetRef = useRef<BottomSheetMethods>(null);
  const taskSheetRef = useRef<BottomSheetMethods>(null);

  // console.log(bottom, top, ":::Bottom Top, size", height, height - top);

  return (
    <SafeAreaView
      className="bg-background"
      edges={["right", "bottom", "left"]}
      style={{ flex: 1, backgroundColor: "yellow" }}
    >
      <KeyboardAvoidingView behavior={"position"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{ height: height }}
            className="relative h-screen min-h-screen w-full"
          >
            <View
              // style={{ bottom: bottom + 92 }}
              style={{
                height: 100,
                bottom: 100 - Math.max(bottom, 17),
              }}
              className="absolute left-0 right-0 z-50 flex w-full flex-col items-center justify-center gap-3 bg-white"
            >
              {!userDetail?.mineActive &&
                (userDetail?.redeemableCount ?? 0) <= 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Start mining",
                        "Are you sure you want to start mining?",
                        [
                          {
                            text: "Cancel",
                            style: "cancel",
                            onPress: () => {
                              /**/
                            },
                          },
                          {
                            text: "Start",
                            // style: "destructive",
                            onPress: () => {
                              (async () => {
                                // DONE✅: Mining logic
                                await triggerMiner({
                                  userId:
                                    userDetail?._id ??
                                    (params?.userId as Id<"user">),
                                });
                              })().catch((error) => console.log(error));
                            },
                          },
                        ],
                      );
                    }}
                    className="flex flex-row items-center gap-3 rounded-full border border-gray-600 px-4 py-3 shadow-lg drop-shadow-md"
                  >
                    <Text className="font-[nunito]">Start Mining</Text>
                    <Octicons name="database" size={20} color="black" />
                  </TouchableOpacity>
                )}

              {userDetail?.mineActive && userDetail?.redeemableCount >= 0 && (
                <TouchableOpacity className="flex flex-row items-center gap-3 rounded-full border border-gray-600 bg-black px-4 py-3 shadow-lg drop-shadow-md">
                  <Text className="font-[nunito] font-medium text-white">
                    Mining at {userDetail?.miningRate} $EN/hr
                  </Text>
                  <Octicons name="database" size={20} color="white" />
                </TouchableOpacity>
              )}

              {!userDetail?.mineActive &&
                (userDetail?.redeemableCount ?? 0) > 0 && (
                  <TouchableOpacity
                    onPress={() => setClaimModalVisible(true)}
                    className="flex flex-row items-center gap-3 rounded-full border border-gray-600 bg-black px-4 py-3 shadow-lg drop-shadow-md"
                  >
                    <Text className="font-[nunito] font-medium text-white">
                      Claim reward $EN {userDetail?.redeemableCount}
                    </Text>
                    {/* <Octicons name="database" size={20} color="white" /> */}
                  </TouchableOpacity>
                )}
              <Text className="font-[nunito]">
                {userDetail &&
                  format(
                    userDetail?.mineStartTime
                      ? userDetail.mineStartTime
                      : Date.now(),
                    "HH mm ss",
                  )}
              </Text>

              <ClaimModal
                isClaimModalVisible={claimModalVisible}
                setClaimModalVisible={setClaimModalVisible}
              >
                {/*<View className="w-full relative items-center justify-center flex-1"> */}

                <LinearGradient
                  colors={["#000000", "#D9D9D9"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{
                    display: "flex",
                    position: "absolute",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    top: 160,
                    left: 6,
                    right: 6,
                    borderRadius: 10,
                    padding: 8,
                    height: 114,
                  }}
                >
                  <View className="flex h-full w-full flex-col items-center justify-between rounded-md bg-white p-3">
                    <View className="flex w-full flex-row items-center justify-between">
                      <View className="flex flex-row items-center justify-center gap-2">
                        <Image
                          source={require("../../../assets/main/icons/claim-icon.png")}
                          style={{ width: 47, height: 47 }}
                          contentFit="cover"
                        />
                        <View className="flex flex-col items-start justify-center gap-1">
                          <Text className="text-lg font-normal text-black">
                            {userDetail?.miningRate} $EN/hour
                          </Text>
                          <Text className="font-lighter text-sm text-black">
                            Mined by Auto Bot
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        className="items-center justify-center rounded-xl bg-black px-8 py-3"
                        onPress={async () => {
                          setClaimModalVisible(false);
                          try {
                            await claimReward({
                              userId: params?.userId as Id<"user">,
                            });
                          } catch (e: any) {
                            return Alert.alert(
                              "Claim error",
                              e.message ?? e.toString(),
                            );
                          }
                          Alert.alert(
                            "Claim rewards",
                            "Your reward has been successfuly claimed, you can restart mining at any time",
                          );
                        }}
                      >
                        <Text className="text-white">Claim</Text>
                      </TouchableOpacity>
                    </View>
                    <Text>
                      {
                        [
                          "Boost your Auto Mining Bot to increase your mining time",
                          "Auto Mining will be enabled after one hour of inactivity.",
                          "Boost your Mining Speed to earn more $EN per hour",
                        ][Math.floor(Math.random() * 3)]
                      }
                    </Text>
                  </View>
                </LinearGradient>

                {/* </View> */}
              </ClaimModal>
            </View>
            <ScrollView
              className="z-40 min-h-full w-full bg-[#F5F5F5]"
              contentInsetAdjustmentBehavior="always"
              style={{ height: height - top }}
            >
              <Stack.Screen
                options={{
                  headerShown: true,
                  header: () => (
                    <DashboardHeader
                      top={top}
                      modalVisible={modalVisible}
                      setModalVisible={setModalVisible}
                      nickname={userDetail?.nickname ?? ""}
                    />
                  ),
                }}
              />

              <TouchableOpacity
                activeOpacity={1}
                className="flex h-full w-full flex-col px-[20px] py-6 pb-32"
              >
                <StatsCard
                  minedCount={userDetail?.minedCount ?? 0}
                  miningRate={userDetail?.miningRate ?? 0}
                  xpEarned={userDetail?.xpCount ?? 0}
                  redeemableCount={userDetail?.redeemableCount ?? 0}
                />

                <View className="my-4" />

                <View className="mt-4 flex w-full flex-col gap-2">
                  <Text className="font-[nunito] text-xl font-medium">
                    Overview
                  </Text>
                  <Overview
                    totalUsers={userDetail?.totalUserCount ?? 0}
                    referrals={userDetail?.referralCount ?? 0}
                    referralCode={userDetail?.referralCode ?? "REFCOD"}
                    globalRank={userDetail?.globalRank ?? 1000}
                  />
                </View>

                <View className="my-6" />

                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: "/(main)/referral", params })
                  }
                  className="flex w-full flex-row items-start justify-start gap-3 rounded-xl border border-dashed border-[#B3B2B2]/50 bg-[#EBEBEB] p-4"
                >
                  <Image
                    source={require("../../../assets/main/invite.png")}
                    style={{ width: 50, height: 50 }}
                    alt="Referre"
                  />
                  <View className="flex flex-col items-start justify-center gap-1">
                    <Text className="font-[nunito] text-lg font-normal text-black">
                      Invite Friends
                    </Text>
                    <Text className="text-light font-[nunito] text-sm text-[#989898]">
                      The more users you refer, the more star you earn
                    </Text>
                  </View>
                </TouchableOpacity>
                <View className="my-6" />
                {/* Task and boosts */}
                <View className="mt-6 w-full flex-1">
                  <TaskBoostCard
                    // eventSheetRef={eventSheetRef}
                    onEventPressed={(eventIndex: number) => {
                      console.log(eventIndex, ":::events index");
                      setEventSheetContent((fetchEvents ?? [])[eventIndex]);
                      // @ts-expect-error eventsheet open
                      eventSheetRef.current.open();
                    }}
                    onTaskPressed={(taskIndex: number) => {
                      console.log(taskIndex, ":::task Index");
                      setTaskSheetContent((fetchTasks ?? [])[taskIndex]);
                      // @ts-expect-error eventsheet open
                      taskSheetRef.current.open();
                    }}
                    tasks={fetchTasks}
                    events={fetchEvents}
                  />
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <BottomSheet ref={eventSheetRef} height="70%">
        <View className="flex h-full w-full flex-col items-center justify-between gap-4 rounded-lg p-4">
          {/* <Text>{eventSheetContent && eventSheetContent.title}</Text> */}
          <View className="flex w-full flex-row items-center justify-center gap-4">
            <View className="rounded-lg bg-gray-700/30 p-2">
              <Image
                source={{ uri: eventSheetContent?.company?.logoUrl }}
                style={{ width: 50, height: 50 }}
                resizeMode="cover"
              />
            </View>
            <View className="flex flex-col items-start justify-center gap-2">
              <Text className="font-[nunito] text-lg font-bold text-black">
                {eventSheetContent?.title}
              </Text>
              <Text className=" font-[nunito]">
                +
                {// @ts-expect-error eventsheet open
                eventSheetContent?.reward.toLocaleString("en-US")}{" "}
                XP
              </Text>
            </View>
          </View>
          <View className="w-full gap-4">
            {eventSheetContent &&
              eventSheetContent?.actions?.map((action, index) => (
                <TouchableOpacity
                  onPress={() => {
                    // router.push({ pathname: task.link, params });
                  }}
                  key={index}
                  className="flex w-full flex-row items-center justify-center gap-4"
                >
                  <View className="rounded-xl bg-[#EBEBEB] p-5">
                    {
                      // @ts-expect-error eventsheet open
                      icons[action?.channel]
                    }
                  </View>
                  <View className="flex flex-col items-start justify-center gap-2">
                    <Text className="font-[nunito] text-lg">
                      {action?.name}
                    </Text>
                    {/* <Text className=" font-[nunito]">
                  +{action?.reward.toLocaleString("en-US")} XP
                </Text> */}
                  </View>
                  <View className="flex-1" />
                  <MaterialIcons
                    name="keyboard-arrow-right"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              ))}
          </View>
          <View className="w-full flex-1">
            <Button
              // @ts-expect-error eventsheet close
              onPress={() => eventSheetRef.current.close()}
              title="Completed"
              color="#000000"
            />
          </View>
        </View>
      </BottomSheet>
      <BottomSheet
        ref={taskSheetRef}
        height="90%"
        style={{ backgroundColor: "white", zIndex: 50 }}
      >
        <TaskRenderer
          task={taskSheetContent!}
          // @ts-expect-error eventsheet open
          onCloseEvent={() => taskSheetRef.current.close()}
          renderView={({ task }) => {
            // console.log(taskSheetRef, ":::Ref");
            return (
              <View className="flex h-full w-full flex-col gap-4">
                <View className="flex w-full flex-1 gap-4 overflow-hidden">
                  <WebView
                    originWhitelist={["*"]}
                    className="h-full w-full"
                    source={{ uri: task?.action?.link }}
                  />
                </View>
                <View className="flex flex-col gap-2">
                  <Text className="font-[nunito] text-xl font-bold">
                    Instructions
                  </Text>
                  <Text className="font-[nunito] text-lg font-medium">
                    Press the LIKE & REPOST button to automatically LIKE &
                    REPOST without redirecting you.
                  </Text>
                  <Text className="font-[nunito] text-lg font-medium">
                    Press the Proceed button to verify{" "}
                  </Text>
                </View>
                <View className="flex w-full flex-col gap-3">
                  <View className="flex w-full flex-row gap-3">
                    <View className="flex-1">
                      <Button
                        onPress={() => {
                          // Mark
                          // Alert.alert("Liking post....");
                        }}
                        title="Like"
                        color="#000000"
                      />
                    </View>

                    <View className="flex-1">
                      <Button
                        onPress={() => {
                          // Mark
                        }}
                        title="Repost"
                        color="#000000"
                      />
                    </View>
                  </View>
                  <Button
                    onPress={() => {
                      // Mark
                      // @ts-expect-error eventsheet close
                      taskSheetRef.current.close();
                    }}
                    title="Proceed"
                    color="#000000"
                  />
                </View>
              </View>
            );
          }}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}
