import type { EventType } from "@/app/(main)/dashboard";
import type { EmbedResponse } from "@/twitterUtils";
import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
// import { BottomSheetMethods } from "@devvie/bottom-sheet";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { tweetEmbed } from "@/twitterUtils";
import {
  AntDesign,
  FontAwesome5,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";

import type { Doc } from "@acme/api/convex/_generated/dataModel";

// import { useMutation, useQuery } from "convex/react";
// import { api } from "@acme/api/src/convex/_generated/api";

interface ITaskBoostCardProps {
  renderTasks?: () => React.ReactNode;
  renderBoosts?: () => React.ReactNode;
  data?: Record<string, any>[];
  // eventSheetRef: React.MutableRefObject<BottomSheetMethods>;
  events: EventType[] | undefined;
  tasks: Doc<"tasks">[] | undefined;
  onEventPressed: (eventIndex: number) => void;
  onTaskPressed: (eventIndex: number) => void;
}
export default function TaskBoostCard({
  tasks,
  events,
  onEventPressed,
  onTaskPressed,
}: ITaskBoostCardProps) {
  const { userId, ...params } = useLocalSearchParams();
  const sliderRef = useRef(null);
  const { width, height } = useSafeAreaFrame();
  const [sliderIndex, setSliderIndex] = useState(0);

  // const speedBoost = useMutation(api.mutations.speedBoost);
  // const botBoost = useMutation(api.mutations.botBoost);

  // const boosterList = [
  //   {
  //     name: "Mining Speed",
  //     cost: 50,
  //     icon: <Feather name="zap" size={24} color="black" />,
  //     action: async () => {
  //       await speedBoost({ userId: userId as Id<"user"> });
  //     },
  //   },
  //   {
  //     name: "Auto Mining Bot",
  //     cost: 500,
  //     icon: <Octicons name="database" size={24} color="black" />,
  //     action: async () => {
  //       await botBoost({ userId: userId as Id<"user"> });
  //     },
  //   },
  // ];

  return (
    <View className="mb-32 flex w-full flex-col gap-2">
      <View style={{ borderRadius: 12 }} className="w-full bg-white p-2">
        <View
          style={{
            backgroundColor: "#EBEBEB",
            borderRadius: 11,
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: sliderIndex === 0 ? "black" : "transparent",
              borderRadius: 11,
            }}
            className="flex w-1/3 flex-row items-center justify-center gap-1 rounded-xl p-3 transition-colors"
            onPress={() => {
              // @ts-expect-error something went wrong carousel scroll
              sliderRef.current.scrollTo({ index: 0, animated: true });
              setSliderIndex(0);
            }}
          >
            {sliderIndex === 0 ? (
              <Image
                source={require("../../assets/main/icons/tasks_coin_white.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require("../../assets/main/icons/tasks_coin_black.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
            )}
            <Text
              className="font-[nunito] transition-colors"
              style={{
                color: sliderIndex === 0 ? "white" : "black",
              }}
            >
              Tasks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: sliderIndex === 1 ? "black" : "transparent",
              borderRadius: 11,
            }}
            className="flex w-1/3 flex-row items-center justify-center gap-1 rounded-xl p-3 transition-colors"
            onPress={() => {
              // @ts-expect-error something went wrong carousel scroll
              sliderRef.current.scrollTo({ index: 1, animated: true });
              setSliderIndex(1);
            }}
          >
            {sliderIndex === 1 ? (
              <Image
                source={require("../../assets/main/icons/events_double_arrow_white.png")}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require("../../assets/main/icons/events_double_arrow_black.png")}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            )}
            <Text
              className="font-[nunito] transition-colors"
              style={{
                color: sliderIndex === 1 ? "white" : "black",
              }}
            >
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: sliderIndex === 2 ? "black" : "transparent",
              borderRadius: 11,
            }}
            className="flex w-1/3 flex-row items-center justify-center gap-1 rounded-xl p-3 transition-colors"
            onPress={() => {
              // @ts-expect-error something went wrong carousel scroll
              sliderRef.current.scrollTo({ index: 2, animated: true });
              setSliderIndex(2);
            }}
          >
            {sliderIndex === 2 ? (
              <Image
                source={require("../../assets/main/icons/boosts_flash_white.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require("../../assets/main/icons/boosts_flash_black.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
            )}
            <Text
              className="font-[nunito] transition-colors"
              style={{
                color: sliderIndex === 2 ? "white" : "black",
              }}
            >
              Boosts
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Carousel
        ref={sliderRef}
        loop={false}
        style={{
          width: "100%",
          // height: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
          overflow: "scroll",
        }}
        autoPlay={false}
        width={width * 0.95}
        height={height * 0.6}
        pagingEnabled
        enabled={false}
        scrollAnimationDuration={700}
        data={Array.from({ length: 3 })}
        onSnapToItem={() => {
          /**/
        }}
        defaultIndex={0}
        renderItem={({ index }) => {
          if (index === 0) {
            return (
              <ScrollView
                style={{
                  paddingBottom: 35,
                  height: "100%",
                }}
                contentInsetAdjustmentBehavior="always"
              >
                <Tasks
                  key={index}
                  tasks={tasks}
                  params={{ userId: userId as string, ...params }}
                  onTaskPressed={onTaskPressed}
                />
              </ScrollView>
            );
          }

          if (index === 1) {
            return (
              <Events
                key={index}
                events={events}
                params={{ userId: userId as string, ...params }}
                onEventPressed={onEventPressed}
              />
            );
          }

          return <Boosts key={index} boosterList={[]} />;
        }}
      />
    </View>
  );
}

export const icons = {
  twitter: <FontAwesome6 name="x-twitter" size={24} color="black" />,
  discord: <MaterialIcons name="discord" size={24} color="black" />,
  telegram: <FontAwesome5 name="telegram-plane" size={24} color="black" />,
  invite: <FontAwesome5 name="user-friends" size={24} color="black" />,
};
// const ccosystemTaskList = [
//   {
//     name: "Invite 10 Friends",
//     reward: 10000,
//     icon: <FontAwesome5 name="user-friends" size={24} color="black" />,
//     link: "/(main)/referral",
//   },
//   {
//     name: "Follow On X(Twitter)",
//     reward: 2000,
//     icon: <FontAwesome6 name="x-twitter" size={24} color="black" />,
//     link: "https://twitter.com/Enetecosystem",
//   },
//   {
//     name: "Join Telegram Channel",
//     reward: 2000,
//     icon: <FontAwesome5 name="telegram-plane" size={24} color="black" />,
//     link: "https://t.me/enetecosystem",
//   },
//   {
//     name: "Join Telegram",
//     reward: 2000,
//     icon: <FontAwesome5 name="telegram-plane" size={24} color="black" />,
//     link: "https://t.me/enetworkchannel",
//   },
//   {
//     name: "Join Discord",
//     reward: 2000,
//     icon: <MaterialIcons name="discord" size={24} color="black" />,
//     link: "https://discord.gg/RQqVWPxuwq",
//   },
// ];
interface ITaskProps {
  params: {
    userId: string;
    email?: string;
    nickname?: string;
    accessToken?: string;
    refreshToken?: string;
  };
  tasks: Doc<"tasks">[] | undefined;
  onTaskPressed: (index: number) => void;
}
const Tasks: React.FC<ITaskProps> = ({ tasks, onTaskPressed }) => {
  // Fetch tasks and events

  console.log(tasks, ":::Tasks and events");

  return (
    <View
      style={{
        paddingBottom: 35,
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 24,
        display: "flex",
        flex: 1,
        width: "100%",
        flexDirection: "column",
        backgroundColor: "white",
        padding: 24,
      }}
    >
      <Text className="font-[nunito] text-xl text-black">
        Simple task for more XP's
      </Text>
      {/* <Text className="font-[nunito] -mt-3 text-lg text-black/50">
      10,000 XP Challenge
    </Text> */}
      <Suspense fallback={<ActivityIndicator size="large" color="#000000" />}>
        {tasks?.map((task, index) => (
          <TouchableOpacity
            onPress={() => {
              // router.push({ pathname: task.link, params });
              onTaskPressed(index);
            }}
            key={index}
            className="flex w-full flex-row items-center justify-center gap-4"
          >
            <View className="rounded-xl bg-[#EBEBEB] p-5">
              {
                // @ts-expect-error something went wrong in Task render
                icons[task?.action.channel]
              }
            </View>
            <View className="flex flex-1 flex-col items-start justify-center gap-2">
              <Text className="font-[nunito] text-lg">{task?.name}</Text>
              <Text className="text-wrap font-[nunito]">
                +{task?.reward.toLocaleString("en-US")} XP
              </Text>
            </View>
            {/* <View className="flex-1" /> */}
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        ))}
      </Suspense>
    </View>
  );
};

// const eventsList = [
//   {
//     name: "Invite 10 Friends",
//     reward: 10000,
//     icon: <FontAwesome5 name="user-friends" size={24} color="black" />,
//     link: "/(main)/referral",
//   },
//   {
//     name: "Follow On X(Twitter)",
//     reward: 2000,
//     icon: <FontAwesome6 name="x-twitter" size={24} color="black" />,
//     link: "https://twitter.com/Enetecosystem",
//   },
//   {
//     name: "Join Telegram Channel",
//     reward: 2000,
//     icon: <FontAwesome5 name="telegram-plane" size={24} color="black" />,
//     link: "https://t.me/enetecosystem",
//   },
//   {
//     name: "Join Telegram",
//     reward: 2000,
//     icon: <FontAwesome5 name="telegram-plane" size={24} color="black" />,
//     link: "https://t.me/enetworkchannel",
//   },
//   {
//     name: "Join Discord",
//     reward: 2000,
//     icon: <MaterialIcons name="discord" size={24} color="black" />,
//     link: "https://discord.gg/RQqVWPxuwq",
//   },
// ];
interface IEventProps {
  params: {
    userId: string;
    email?: string;
    nickname?: string;
    accessToken?: string;
    refreshToken?: string;
  };
  events: EventType[] | undefined;
  onEventPressed: (index: number) => void;
}
const Events: React.FC<IEventProps> = ({ events, onEventPressed }) => {
  return (
    <View className="flex w-full flex-1 flex-col items-center justify-start gap-4 bg-white p-6 pb-14">
      {/*    <Text className="text-2xl text-black">Ecosystem</Text>
    <Text className="-mt-3 text-lg text-black/50">10,000 XP Challenge</Text> */}

      <Suspense fallback={<ActivityIndicator size="large" color="#000000" />}>
        {events &&
          !!events?.length &&
          events.map((event, index) => (
            <TouchableOpacity
              onPress={() => {
                // router.push({ pathname: task.link, params })
                onEventPressed(index);
              }}
              key={index}
              className="flex w-full flex-row items-center justify-center gap-4"
            >
              <View className="rounded-2xl bg-gray-700/30 p-2">
                <Image
                  source={{ uri: event?.company?.logoUrl }}
                  style={{ width: 50, height: 50 }}
                  resizeMode="cover"
                />
              </View>
              <View className="flex flex-col items-start justify-center gap-2">
                <Text className="font-[nunito] text-lg">{event?.title}</Text>
                <Text className="font-[nunito]">
                  +{(event.reward ?? 0).toLocaleString("en-US")} XP
                </Text>
              </View>
              <View className="flex-1" />
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </TouchableOpacity>
          ))}

        {events && !events.length && (
          <Text className="mt-5 text-center font-[nunito] text-xl font-medium text-black">
            There are no events at this time, check back later
          </Text>
        )}
      </Suspense>
    </View>
  );
};

const Boosts = ({ boosterList }: { boosterList: any[] }) => (
  <View className="flex w-full flex-1 flex-col items-center justify-start gap-4 bg-white p-6 pb-14">
    <View className="flex w-full flex-row items-center justify-between">
      <Text className="px-6 font-[nunito] text-xl font-normal text-black">
        Mining Boosters
      </Text>
      <View className="flex flex-col rounded-lg bg-[#EBEBEB] px-4 py-2">
        <Text className="font-[nunito] text-lg text-black">Mining Speed</Text>
        <Text className="font-[nunito]text-black/50 text-sm">
          0/6 Available
        </Text>
      </View>
    </View>

    {!!boosterList.length &&
      boosterList.map((boost, index) => (
        <TouchableOpacity
          onPress={boost.action}
          key={index}
          className="flex w-full flex-row items-center justify-center gap-4"
        >
          <View className="rounded-xl bg-[#EBEBEB] p-5">{boost.icon}</View>
          <View className="flex flex-col items-start justify-center gap-1">
            <Text className="font-[nunito] text-lg">{boost?.name}</Text>
            <View className="flex flex-row items-center justify-start gap-2">
              <Image
                source={require("../../assets/enet-logo.png")}
                style={{ width: 20, height: 20 }}
                contentFit="cover"
              />
              <Text className="font-[nunito] text-lg font-medium">
                {boost.cost.toLocaleString("en-US")} ENET
              </Text>
            </View>
            {index === 1 && (
              <Text className="font-[nunito] text-sm text-black/40">
                Mine when you&aposre asleep
              </Text>
            )}
          </View>
          <View className="flex-1" />
          <View className="flex flex-row items-center justify-end gap-1">
            <Text className="font-[nunito]">1 lvl</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>
      ))}
    {!boosterList.length && (
      <Text className="text-center font-[nunito] text-lg font-medium text-black">
        Boosts are coming soon!
      </Text>
    )}
  </View>
);

interface ITaskRenderProps {
  task: Doc<"tasks">;
  onCloseEvent: () => void;
  renderView: ({
    task,
    embedData,
    // ref,
  }: {
    task: Doc<"tasks">;
    embedData: EmbedResponse | undefined;
    // ref: React.MutableRefObject<BottomSheetMethods>;
  }) => React.ReactNode | JSX.Element;
}
export const TaskRenderer: React.FC<ITaskRenderProps> = ({
  task,
  onCloseEvent,
  renderView,
}) => {
  const [embedData, setEmbedData] = useState<EmbedResponse | undefined>();

  useEffect(() => {
    setembedData().catch((error) =>
      console.log(error, ":::Fetching embed data"),
    );
    async function setembedData() {
      if (task) {
        const embedData = await tweetEmbed({
          tweetUrl: task?.action?.link,
        });
        setEmbedData(embedData);
      }
    }
  }, [task]);

  return (
    <View className="flex h-full w-full flex-col items-center justify-between rounded-lg p-4 pb-24">
      <View className="flex w-full flex-row items-center justify-between">
        <View />
        <Text className="text-lg font-bold text-black">{task?.name}</Text>
        <TouchableOpacity
          onPress={() => {
            onCloseEvent();
          }}
        >
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {renderView({ task, embedData })}
    </View>
  );
};
