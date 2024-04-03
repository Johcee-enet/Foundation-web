import type { BottomSheetMethods } from "@devvie/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import * as WebBrowser from "expo-web-browser";
// import { checkCountdown } from "@/appUtils";
import ClaimModal from "@/components/claim_modal";
import DashboardHeader from "@/components/dashboard_header";
import LoadingModal from "@/components/loading_modal";
import { Overview } from "@/components/overview_card";
import { StatsCard } from "@/components/stats_card";
import TaskBoostCard, {
  icons,
  TaskRenderer,
} from "@/components/task_boost_card";
import BottomSheet from "@devvie/bottom-sheet";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { useAction, useMutation, useQuery } from "convex/react";
import { addHours, differenceInSeconds, formatDuration } from "date-fns";

import type { Doc, Id } from "@acme/api/convex/_generated/dataModel";
import { api } from "@acme/api/convex/_generated/api";

export type EventType = Partial<Doc<"events">> & {
  company: Partial<Doc<"company">> & { logoUrl: string };
};
// type Network = "twitter" | "discord" | "telegram" | "website";
// type ActionType = "follow" | "post" | "join" | "visit";

export default function DashboardPage() {
  const params = useLocalSearchParams();
  console.log(params, ":::Params");
  const { top, bottom } = useSafeAreaInsets();
  const { height, width } = useSafeAreaFrame();
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch users data
  const userDetail = useQuery(api.queries.getUserDetails, {
    userId: params?.userId as Id<"user">,
  });

  console.log(userDetail, ":::Userdetails");

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

  // Embeding
  // const [tweetEmbedHeight, setTweetEmbedHeight] = useState<number>();
  const [remaining, setRemaining] = useState<string>();
  // countdown
  useEffect(() => {
    // Function to check if the countdown has ended

    if (userDetail?.mineActive) {
      checkCountdown({
        startTime: userDetail.mineStartTime ?? Date.now(),
        countdownDuration: userDetail?.mineHours,
      });
    }

    function checkCountdown({
      startTime,
      countdownDuration = 6,
    }: {
      startTime: number;
      countdownDuration: number;
    }) {
      // Set the start time of the countdown
      // const startTime = new Date();

      // Define the duration for the countdown (6 hours)
      // const countdownDuration = 6;

      // Calculate the end time for the countdown
      const endTime = addHours(startTime, countdownDuration);

      const currentTime = Date.now();
      const remainingTime = differenceInSeconds(endTime, currentTime);

      if (remainingTime <= 0) {
        console.log("Countdown ended. Performing action...");
        // Perform the action here
      } else {
        const formattedRemainingTime = formatDuration(
          { seconds: remainingTime },
          { format: ["hours", "minutes", "seconds"] },
        );
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;
        console.log(`${hours} hours, ${minutes} minutes, ${seconds} seconds`);
        console.log(`Time remaining: ${formattedRemainingTime}`);
        // Check again after 1 second
        setTimeout(
          () => checkCountdown({ startTime, countdownDuration }),
          1000,
        );

        setRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    }
  }, [userDetail, remaining]);

  // handle tasks cycle
  const [isLoadingModalVisible, setLoadingModalVisible] = useState(false);
  const rewardTaskXpCount = useMutation(api.mutations.rewardTaskXp);

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
                height: 90,
                bottom: 90 - Math.max(bottom, 17),
              }}
              className="absolute left-0 right-0 z-50 flex w-full flex-col items-center justify-center gap-1 bg-white"
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
                    Mining at {userDetail?.miningRate} $FOUND/hr
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
                      Claim reward $FOUND {userDetail?.redeemableCount}
                    </Text>
                    {/* <Octicons name="database" size={20} color="white" /> */}
                  </TouchableOpacity>
                )}
              <Text className="font-[nunito]">
                {
                  userDetail && userDetail?.mineActive && remaining

                  // format(
                  //   userDetail?.mineStartTime
                  //     ? userDetail.mineStartTime
                  //     : Date.now(),
                  //   "HH mm ss",
                  // )
                }

                {userDetail && !userDetail?.mineActive && "5h 59m 59s"}
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
                          <Text className="flex items-center text-lg font-normal text-black">
                            {userDetail?.miningRate} $FOUND/
                            {userDetail?.mineHours}hour
                          </Text>
                          {/* <Text className="font-lighter text-sm text-black">
                            Mined by Auto Bot
                          </Text> */}
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
                          "Boost your Mining Speed to earn more $FOUND per hour",
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
                      nickname={
                        userDetail?.nickname ?? (params.nickname as string)
                      }
                    />
                  ),
                }}
              />

              <TouchableOpacity
                activeOpacity={1}
                className="flex h-full w-full flex-col px-[20px] pb-32"
              >
                <StatsCard
                  minedCount={userDetail?.minedCount ?? 0}
                  miningRate={userDetail?.miningRate ?? 0}
                  xpEarned={userDetail?.xpCount ?? 0}
                  redeemableCount={userDetail?.redeemableCount ?? 0}
                />

                <View
                  style={{ marginTop: 17 }}
                  className="flex w-full flex-col gap-2"
                >
                  <Text
                    style={{ fontSize: 16, fontWeight: "600" }}
                    className="font-[nunito]"
                  >
                    Overview
                  </Text>
                  <Overview
                    totalUsers={userDetail?.totalUserCount ?? 0}
                    referrals={userDetail?.referralCount ?? 0}
                    referralCode={userDetail?.referralCode ?? "REFCOD"}
                    globalRank={userDetail?.globalRank ?? 1000}
                  />
                </View>

                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: "/(main)/referral", params })
                  }
                  style={{ marginTop: 37 }}
                  className="flex w-full flex-row items-center justify-start gap-4 rounded-xl border border-dashed border-[#B3B2B2]/50 bg-[#EBEBEB] p-4"
                >
                  <Image
                    source={require("../../../assets/main/invite.png")}
                    style={{ width: 50, height: 50 }}
                    alt="Referre"
                  />
                  <View className="flex flex-1 flex-col items-start justify-center gap-1">
                    <Text
                      style={{ fontSize: 15, fontWeight: "400" }}
                      className="font-[nunito] text-black"
                    >
                      Invite Friends
                    </Text>
                    <Text
                      style={{ fontSize: 13, fontWeight: "400" }}
                      className="text-light text-wrap font-[nunito] text-[10.5px] text-[#989898]"
                    >
                      The more users you refer, the more $FOUND you earn
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Task and boosts */}
                <View style={{ marginTop: 36 }} className="w-full flex-1">
                  <TaskBoostCard
                    // eventSheetRef={eventSheetRef}
                    onEventPressed={(eventIndex: number) => {
                      console.log(eventIndex, ":::events index");
                      setEventSheetContent((fetchEvents ?? [])[eventIndex]);
                      // @ts-expect-error eventsheet open
                      eventSheetRef.current.open();
                    }}
                    onTaskPressed={async (taskIndex: number) => {
                      console.log(taskIndex, ":::task Index");
                      const task = (fetchTasks ?? [])[taskIndex];

                      if (!task) {
                        return Alert.alert("No task found");
                      }

                      if (
                        task?.action.channel !== "twitter" &&
                        task?.action.type !== "post"
                      ) {
                        // Handle all other channel and actions

                        WebBrowser.openBrowserAsync(task?.action.link ?? "")
                          .then(async (result) => {
                            console.log(result, ":::Task_come back result");

                            await rewardTaskXpCount({
                              userId: params.userId as Id<"user">,
                              taskId: task?._id,
                              xpCount: task?.reward,
                            });
                          })
                          .catch((err) => {
                            console.log(err, ":::Error occurred in task");
                            Alert.alert(
                              "An error occurred trying to finish task",
                            );
                          });
                      } else if (
                        task?.action.channel === "twitter" &&
                        task?.action.type === "follow"
                      ) {
                        // Call twitter follow API handler
                        console.log("Handle follow API");
                        setLoadingModalVisible(true);
                        setTimeout(() => {
                          setLoadingModalVisible(false);
                        }, 2000);
                        await rewardTaskXpCount({
                          userId: params.userId as Id<"user">,
                          taskId: task?._id,
                          xpCount: task?.reward,
                        });
                      } else {
                        setTaskSheetContent(task);
                        // @ts-expect-error eventsheet open
                        taskSheetRef.current.open();
                      }
                    }}
                    tasks={fetchTasks}
                    events={fetchEvents}
                  />
                  <LoadingModal
                    isLoadingModalVisible={isLoadingModalVisible}
                    setLoadingModalVisible={setLoadingModalVisible}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: 180,
                        left: 6,
                        right: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        minHeight: 200,
                        borderRadius: 20,
                        gap: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          fontFamily: "nunito",
                          color: "black",
                        }}
                      >
                        Finishing task...
                      </Text>
                      <ActivityIndicator size={"large"} color={"black"} />
                    </View>
                  </LoadingModal>
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
      {/* Tasks sheet */}
      <BottomSheet
        ref={taskSheetRef}
        height="90%"
        style={{ backgroundColor: "white", zIndex: 50 }}
      >
        <TaskRenderer
          task={taskSheetContent!}
          // @ts-expect-error eventsheet open
          onCloseEvent={() => taskSheetRef.current.close()}
          renderView={({ task, embedData }) => {
            console.log(width, task, ":::Ref width");

            return (
              <View className="flex h-full w-full flex-col gap-4">
                <View className="flex w-full flex-1 overflow-hidden bg-green-400">
                  <WebView
                    originWhitelist={["*"]}
                    scalesPageToFit={false}
                    source={{ html: embedData?.html ?? "" }}
                  />
                </View>
                <View className="flex flex-col gap-2">
                  <Text className="font-[nunito] text-lg font-bold">
                    Instructions
                  </Text>
                  <Text className="font-[nunito] text-sm font-medium">
                    Press the LIKE & REPOST button to automatically LIKE &
                    REPOST without redirecting you.
                  </Text>
                  <Text className="font-[nunito] text-sm font-medium">
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
