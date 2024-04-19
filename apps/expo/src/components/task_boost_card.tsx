import type { EventType } from "@/app/(main)/dashboard";
import type { EmbedResponse } from "@/twitterUtils";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  // ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
// import { BottomSheetMethods } from "@devvie/bottom-sheet";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useGlobalSearchParams } from "expo-router";
// import { useLocalSearchParams } from "expo-router";
import { tweetEmbed } from "@/twitterUtils";
import {
  AntDesign,
  FontAwesome5,
  FontAwesome6,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";

// import { Era } from "date-fns";

import type { Doc, Id } from "@acme/api/convex/_generated/dataModel";
import { api } from "@acme/api/convex/_generated/api";

// import { useMutation, useQuery } from "convex/react";
// import { api } from "@acme/api/src/convex/_generated/api";

interface ITaskBoostCardProps {
  renderTasks?: () => React.ReactNode;
  renderBoosts?: () => React.ReactNode;
  completedTasks: string[] | undefined;
  eventsJoined: Record<string, any>[] | undefined;
  // eventSheetRef: React.MutableRefObject<BottomSheetMethods>;
  events: EventType[] | undefined;
  tasks?: Doc<"tasks">[] | undefined;
  onEventPressed: (eventIndex: number) => void;
  onTaskPressed: (task: Doc<"tasks">) => void;
  onBoostPressed: (boost: Record<string, any>) => void;
}
export default function TaskBoostCard({
  // tasks,
  events,
  // completedTasks,
  eventsJoined,
  onEventPressed,
  onTaskPressed,
  onBoostPressed,
}: ITaskBoostCardProps) {
  const params = useGlobalSearchParams();
  const sliderRef = useRef(null);
  const { width, height } = useSafeAreaFrame();
  const [sliderIndex, setSliderIndex] = useState(0);

  const tasks = useQuery(api.queries.fetchTasks, {
    userId: params?.userId as Id<"user">,
  });

  const config = useQuery(api.queries.getAppConfigForApp);

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
              <View
                style={{
                  // paddingBottom: 35,
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 24,
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  backgroundColor: "white",
                  padding: 24,
                }}
              >
                <Text className="font-[nunito] text-xl text-black">
                  Simple task for more XP's
                </Text>
                {/* <Tasks
                  key={index}
                  tasks={tasks}
                  params={{ userId: userId as string, ...params }}
                  onTaskPressed={onTaskPressed}
                /> */}
                <ScrollView
                  nestedScrollEnabled
                  indicatorStyle="default"
                  style={{ width: "100%" }}
                >
                  <FlashList
                    data={tasks}
                    estimatedItemSize={(tasks ?? []).length + 200}
                    keyExtractor={(item) => item._id.toString()}
                    scrollEnabled={true}
                    renderItem={({ item, index }) => (
                      <Task
                        // completedTasks={userDetail.completedTasks}
                        task={item}
                        index={index}
                        onTaskPressed={onTaskPressed}
                      />
                    )}
                  />
                </ScrollView>
              </View>
            );
          }

          if (index === 1) {
            return (
              <View
                style={{
                  // paddingBottom: 35,
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 24,
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  backgroundColor: "white",
                  padding: 24,
                }}
              >
                <ScrollView
                  nestedScrollEnabled
                  indicatorStyle="default"
                  style={{ width: "100%" }}
                >
                  {/* <Events
                key={index}
                events={events}
                params={{ userId: userId as string, ...params }}
                onEventPressed={onEventPressed}
              /> */}

                  <FlashList
                    data={events}
                    estimatedItemSize={200}
                    scrollEnabled={true}
                    renderItem={({ item, index }) => (
                      <Event
                        eventsJoined={eventsJoined}
                        event={item}
                        index={index}
                        onEventPressed={onEventPressed}
                      />
                    )}
                  />
                </ScrollView>
              </View>
            );
          }

          return (
            <View
              style={{
                // paddingBottom: 35,
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 24,
                display: "flex",
                flex: 1,
                flexDirection: "column",
                backgroundColor: "white",
                padding: 24,
              }}
            >
              <ScrollView
                nestedScrollEnabled
                indicatorStyle="default"
                style={{ width: "100%" }}
              >
                {/* <Events
              key={index}
              events={events}
              params={{ userId: userId as string, ...params }}
              onEventPressed={onEventPressed}
            /> */}

                <FlashList
                  data={config?.boosts ?? []}
                  estimatedItemSize={200}
                  scrollEnabled={true}
                  renderItem={({ item, index }) => (
                    <Boost
                      boost={item}
                      index={index}
                      onBoostPressed={onBoostPressed}
                    />
                  )}
                />
              </ScrollView>
            </View>
          );
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
  website: <SimpleLineIcons name="globe" size={24} color="black" />,
};

const Task = ({
  onTaskPressed,
  index,
  task,
  // completedTasks,
}: {
  onTaskPressed: (task: Doc<"tasks">) => void;
  index: number;
  task: Doc<"tasks">;
  completedTasks?: string[] | undefined;
}) => {
  const params = useGlobalSearchParams();
  const user = useQuery(api.queries.getUserDetails, {
    userId: params?.userId as Id<"user">,
  });

  return (
    <TouchableOpacity
      onPress={() => {
        // router.push({ pathname: task.link, params });
        if (user?.completedTasks?.includes(task?._id)) {
          console.log(":::Completed task");
          return Alert.alert("The task has been completed");
        }
        onTaskPressed(task);
      }}
      key={index}
      style={{ marginVertical: 8 }}
      className="flex w-full flex-row items-center justify-center gap-4"
    >
      <View className="rounded-xl bg-[#EBEBEB] p-5">
        {icons[task?.action.channel]}
      </View>
      <View className="flex flex-1 flex-col items-start justify-center gap-2">
        <Text
          style={{
            color: "black",
            opacity: user?.completedTasks?.some((id) => id === task._id)
              ? 0.3
              : 1,
          }}
          className="font-[nunito] text-lg"
        >
          {task?.name}
        </Text>
        {!user?.completedTasks?.some((id) => id === task._id) && (
          <Text className="text-wrap font-[nunito]">
            +{task?.reward.toLocaleString("en-US")} XP
          </Text>
        )}
        {user?.completedTasks?.some((id) => id === task._id) && (
          <Text
            className="text-wrap font-[nunito]"
            style={{
              color: "black",
              opacity: 0.3,
            }}
          >
            Completed
          </Text>
        )}
      </View>
      {/* <View className="flex-1" /> */}
      <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
    </TouchableOpacity>
  );
};

// interface IEventProps {
//   params: {
//     userId: string;
//     email?: string;
//     nickname?: string;
//     accessToken?: string;
//     refreshToken?: string;
//   };
//   events: EventType[] | undefined;
//   onEventPressed: (index: number) => void;
// }
// const Events: React.FC<IEventProps> = ({ events, onEventPressed }) => {
//   return (
//     <View className="flex w-full flex-1 flex-col items-center justify-start gap-4 bg-white p-6 pb-14">
//       {/*    <Text className="text-2xl text-black">Ecosystem</Text>
//     <Text className="-mt-3 text-lg text-black/50">10,000 XP Challenge</Text> */}

//       <Suspense fallback={<ActivityIndicator size="large" color="#000000" />}>
//         {events &&
//           !!events?.length &&
//           events.map((event, index) => (
//             <TouchableOpacity
//               onPress={() => {
//                 // router.push({ pathname: task.link, params })
//                 onEventPressed(index);
//               }}
//               key={index}
//               className="flex w-full flex-row items-center justify-center gap-4"
//             >
//               <View className="rounded-2xl bg-gray-700/30 p-2">
//                 <Image
//                   source={{ uri: event?.company?.logoUrl }}
//                   style={{ width: 50, height: 50 }}
//                   resizeMode="cover"
//                 />
//               </View>
//               <View className="flex flex-col items-start justify-center gap-2">
//                 <Text className="font-[nunito] text-lg">{event?.title}</Text>
//                 <Text className="font-[nunito]">
//                   +{(event.reward ?? 0).toLocaleString("en-US")} XP
//                 </Text>
//               </View>
//               <View className="flex-1" />
//               <MaterialIcons
//                 name="keyboard-arrow-right"
//                 size={24}
//                 color="black"
//               />
//             </TouchableOpacity>
//           ))}

//         {events && !events.length && (
//           <Text className="mt-5 text-center font-[nunito] text-xl font-medium text-black">
//             There are no events at this time, check back later
//           </Text>
//         )}
//       </Suspense>
//     </View>
//   );
// };

const Event = ({
  onEventPressed,
  index,
  event,
  eventsJoined,
}: {
  onEventPressed: (index: number) => void;
  index: number;
  event: EventType;
  eventsJoined: Record<string, any>[] | undefined;
}) => (
  <TouchableOpacity
    onPress={() => {
      // router.push({ pathname: task.link, params })
      onEventPressed(index);
    }}
    key={index}
    style={{ marginVertical: 8 }}
    className="flex w-full flex-row items-center justify-center gap-4"
  >
    <View>
      <Image
        source={{ uri: event?.company?.logoUrl }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 8,
          backgroundColor: "#EBEBEB",
          padding: 4,
        }}
        resizeMode="cover"
      />
    </View>
    <View className="flex flex-col items-start justify-center gap-2">
      <Text
        className="font-[nunito] text-lg"
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "black",
          opacity: eventsJoined?.find((ev) => ev?.eventId === event._id)
            ?.completed
            ? 0.3
            : 1,
        }}
      >
        {event?.title}
      </Text>
      {!eventsJoined?.find((ev) => ev?.eventId === event._id)?.completed && (
        <Text className="text-wrap font-[nunito]">
          +{(event.reward ?? 0).toLocaleString("en-US")} XP
        </Text>
      )}
      {eventsJoined?.find((ev) => ev?.eventId === event._id)?.completed && (
        <Text
          className="text-wrap font-[nunito]"
          style={{
            color: "black",
            opacity: 0.3,
          }}
        >
          Completed
        </Text>
      )}
    </View>
    <View className="flex-1" />
    <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
  </TouchableOpacity>
);

const Boost = ({ boost, index, onBoostPressed }: any) => {
  const params = useGlobalSearchParams();
  const user = useQuery(api.queries.getUserDetails, {
    userId: params?.userId as Id<"user">,
  });

  return (
    <TouchableOpacity
      onPress={() => {
        if (
          boost?.type === "bot" &&
          user?.boostStatus?.some(
            (stats) => stats?.boostId === boost?.uuid && stats?.isActive,
          )
        ) {
          Alert.alert("Auto mining bot is already active");
          return;
        } else if (
          boost?.type !== "bot" &&
          user?.boostStatus?.some(
            (stats) =>
              stats?.boostId === boost?.uuid &&
              stats.currentLevel! >= boost?.totalLevel,
          )
        ) {
          Alert.alert("Maximum boost level reached!");
          return;
        }

        onBoostPressed(boost);
      }}
      key={index}
      style={{ marginVertical: 8 }}
      className="flex w-full flex-row items-center justify-center gap-4"
    >
      <View className="relative rounded-xl bg-[#EBEBEB] p-5">
        {user?.boostStatus?.find((status) => status?.boostId === boost?.uuid)
          ?.isActive && (
          <View
            style={{
              width: 8.28,
              height: 8.28,
              backgroundColor: "#15BDCF",
              position: "absolute",
              top: -1.14,
              right: -1.14,
              borderRadius: 9999,
            }}
          />
        )}
        <Image
          source={
            boost?.type !== "bot"
              ? require("../../assets/main/icons/boosts_flash_black.png")
              : require("../../assets/main/icons/tasks_coin_black.png")
          }
          style={{ width: 24, height: 24 }}
          contentFit="contain"
        />
      </View>
      <View className="flex flex-col items-start justify-center gap-1">
        <Text
          className="font-[nunito] text-lg"
          style={{
            fontSize: 14,
            fontWeight: "500",
            opacity:
              user?.boostStatus?.find(
                (status) => status?.boostId === boost?.uuid,
              )?.isActive && boost?.type === "bot"
                ? 0.3
                : user?.boostStatus?.find(
                      (status) => status?.boostId === boost?.uuid,
                    )?.isActive &&
                    boost?.type === "bot" &&
                    (user?.boostStatus?.find(
                      (status) => status?.boostId === boost?.uuid,
                    )?.currentLevel ?? 0) >= boost?.totalLevel
                  ? 0.3
                  : 1,
          }}
        >
          {boost?.title}
        </Text>
        <View className="flex flex-row items-center justify-start gap-2">
          {/* <Image
          source={require("../../assets/enet-logo.png")}
          style={{ width: 20, height: 20 }}
          contentFit="cover"
        /> */}
          <Text
            className="font-[nunito] text-lg font-medium"
            style={{
              fontSize: 13,
              fontWeight: "700",
              opacity:
                user?.boostStatus?.find(
                  (status) => status?.boostId === boost?.uuid,
                )?.isActive && boost?.type === "bot"
                  ? 0.3
                  : user?.boostStatus?.find(
                        (status) => status?.boostId === boost?.uuid,
                      )?.isActive &&
                      boost?.type === "bot" &&
                      (user?.boostStatus?.find(
                        (status) => status?.boostId === boost?.uuid,
                      )?.currentLevel ?? 0) >= boost?.totalLevel
                    ? 0.3
                    : 1,
            }}
          >
            {user?.boostStatus?.find(
              (status) => status?.boostId === boost?.uuid,
            )?.isActive && boost?.type !== "bot"
              ? user?.boostStatus
                  ?.find((status) => status?.boostId === boost?.uuid)
                  ?.currentXpCost?.toLocaleString("en-US")
              : boost?.xpCost?.toLocaleString("en-US")}{" "}
            XP
          </Text>
        </View>
        {boost?.type === "bot" && (
          <Text className="font-[nunito] text-sm text-black/40">
            Mine when you're asleep
          </Text>
        )}
      </View>
      <View className="flex-1" />
      <View className="flex flex-row items-center justify-end gap-1">
        {boost?.type !== "bot" && (
          <Text
            className="font-[nunito]"
            style={{ fontSize: 11, fontWeight: "700", color: "black" }}
          >
            {(
              user?.boostStatus?.find(
                (status) => status?.boostId === boost?.uuid,
              )?.currentLevel ?? 0
            ).toString()}
            /{boost?.totalLevel?.toString()}
          </Text>
        )}
        <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
};

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
