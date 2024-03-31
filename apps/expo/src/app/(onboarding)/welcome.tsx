import { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  // Platform,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import Input from "@/components/input";
import { storeData } from "@/storageUtils";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "convex/react";

import type { Id } from "@acme/api/convex/_generated/dataModel";
import { api } from "@acme/api/convex/_generated/api";

export default function WelcomePage() {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const carouselRef = useRef(null);

  const [nickname, setNickname] = useState("");
  const [isValid, setIsValid] = useState(false);

  const storeNickname = useMutation(api.onboarding.storeNickname);
  const isNicknameValid = useMutation(api.onboarding.isNicknameValid);

  return (
    <SafeAreaView className="bg-background">
      <KeyboardAvoidingView behavior={"position"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="min-h-screen w-full flex-1 bg-[#F5F5F5]">
            <View className="w-full">
              <Carousel
                ref={carouselRef}
                loop={false}
                width={width}
                // height={width / 2}
                autoPlay={false}
                pagingEnabled
                data={[...new Array(4).keys()]}
                scrollAnimationDuration={700}
                style={{ alignItems: "center", justifyContent: "center" }}
                onSnapToItem={() => {
                  /**/
                }}
                defaultIndex={0}
                renderItem={({ index }) => (
                  <View
                    className="flex flex-1 flex-col items-start justify-start px-[24px] pb-14"
                    key={index}
                  >
                    <View className="my-6 flex flex-row items-center justify-center gap-1 overflow-hidden py-1">
                      {/* Status bar */}
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <View
                          key={`${idx}-bar`}
                          className="h-1 max-h-2 w-1/4 rounded-full bg-slate-800 opacity-50"
                          style={{
                            opacity: idx === index ? 1 : 0.5,
                          }}
                        />
                      ))}
                    </View>

                    {index === 0 && (
                      <View>
                        <Text className="text-left font-[nunito] text-xl font-medium">
                          Welcome to Enetecosystem
                        </Text>
                        <Text className="text-left font-[nunito] text-lg font-light">
                          A decentralised blockchain ecosystem, building
                          innovative solutions to embrace the rapidly advancing
                          digital landscape.
                        </Text>
                      </View>
                    )}

                    {index === 1 && (
                      <View>
                        <Text className="text-left font-[nunito] text-xl font-medium">
                          Kickstarting our MVP program
                        </Text>
                        <Text className="text-left font-[nunito] text-lg font-light">
                          The Most Valuable Person of the Month/Year is an
                          exciting program within our ecosystem designed to
                          recognize and reward community members or individual
                          who actively contribute to the growth and success of
                          the MVP program.
                        </Text>
                      </View>
                    )}
                    {index === 2 && (
                      <View>
                        <Text className="text-left font-[nunito] text-xl font-medium">
                          Mining and Xp
                        </Text>
                        <Text className="text-left font-[nunito] text-lg font-light">
                          There are 2 ways you can earn $EN before launching.
                          Through Mining on this App and earning Xp by
                          performing ecosystem tasks.
                        </Text>
                      </View>
                    )}

                    {index >= 3 && (
                      <View>
                        <Text className="text-left font-[nunito] text-xl font-medium">
                          Claim a nickname
                        </Text>
                        <Text className="text-left font-[nunito] text-lg font-light">
                          your friends can use this name to join
                        </Text>
                      </View>
                    )}

                    <View className="flex-1" />
                    {index < 3 && (
                      <View className="flex h-2/4 w-full flex-col items-center justify-center rounded-3xl bg-black">
                        {index <= 2 && (
                          <View className="flex h-full w-full flex-col items-center justify-between">
                            {index === 0 && (
                              <Image
                                source={require("../../../assets/welcome/welcome-1.png")}
                                style={{
                                  width: 200,
                                  // height: 200,
                                  aspectRatio: 1,
                                  flex: 1,
                                  alignSelf: "center",
                                }}
                                resizeMode="contain"
                                contentFit="contain"
                                contentPosition="center"
                              />
                            )}
                            {index === 1 && (
                              <Image
                                source={require("../../../assets/welcome/welcome-2.png")}
                                style={{
                                  width: 150,
                                  // height: 190,
                                  marginTop: 20,
                                  aspectRatio: 1,
                                  flex: 1,
                                  alignSelf: "center",
                                }}
                                resizeMode="contain"
                                contentFit="contain"
                                contentPosition="center"
                              />
                            )}
                            {index === 2 && (
                              <Image
                                source={require("../../../assets/welcome/welcome-3.png")}
                                style={{
                                  width: 180,
                                  // height: 160,
                                  marginTop: 30,
                                  aspectRatio: 1,
                                  flex: 1,
                                  alignSelf: "center",
                                }}
                                resizeMode="contain"
                                contentFit="contain"
                                contentPosition="center"
                              />
                            )}

                            {/* Dots */}
                            <View className="my-6 flex w-full flex-row items-center justify-between px-5">
                              <View className="p-4" />
                              <View className="my-2 flex flex-row items-center justify-center gap-2 overflow-hidden">
                                {Array.from({ length: 3 }).map((_, idx) => (
                                  <View
                                    key={`${idx}-bar`}
                                    className="h-1 w-1 rounded-full bg-slate-50 opacity-50"
                                    style={{
                                      opacity: idx === index ? 1 : 0.5,
                                    }}
                                  />
                                ))}
                              </View>
                              <TouchableOpacity
                                className="rounded-lg bg-white p-2"
                                onPress={() => {
                                  //@ts-expect-error carousel-next
                                  carouselRef.current!.next();
                                }}
                              >
                                <AntDesign
                                  name="arrowright"
                                  size={24}
                                  color="black"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </View>
                    )}

                    {index >= 3 && (
                      <View className="flex h-4/6 w-full flex-col items-center justify-between rounded-3xl bg-black px-4 py-8">
                        <View className="w-full gap-2">
                          <Input
                            value={nickname}
                            onBlur={async () => {
                              const isValid = await isNicknameValid({
                                nickname,
                              });

                              setIsValid(isValid);
                            }}
                            onChangeText={setNickname}
                            placeholder="Nickname"
                            className="mb-1 w-full rounded-xl border bg-slate-100 px-6 py-4 font-[nunito] placeholder:font-light placeholder:text-black focus:border-black"
                          />
                          <View className="flex flex-row items-start justify-start gap-1">
                            <MaterialIcons
                              name="info-outline"
                              size={14}
                              color="#15BDCF"
                            />
                            <Text className="text-wrap px-2 text-start font-[nunito] font-light text-white">
                              When creating a nickname, use only © letters,
                              numbers, and periods.{"\n"}
                              <Text className="font-[nunito] font-normal text-[#15BDCF]">
                                Example: your.name01
                              </Text>
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={async () => {
                            try {
                              // Create nickname and add to db
                              if (!nickname.length) {
                                return Alert.alert(
                                  "Onboarding error",
                                  "Nickname must be added",
                                );
                              }

                              if (!isValid) {
                                return Alert.alert(
                                  "Onboard error",
                                  "Nickname must be valid or is already taken",
                                );
                              }

                              await storeNickname({
                                userId: params?.userId as Id<"user">,
                                nickname: nickname.trim(),
                              });

                              await storeData("@enet-store/isOnboarded", true);

                              //@ts-expect-error routing
                              router.push({
                                pathname: "/(main)/dashboard",
                                params: { ...params, nickname },
                              });
                            } catch (e: any) {
                              return Alert.alert(e.message ?? e.toString());
                            }
                          }}
                          className="flex w-full items-center justify-center overflow-hidden rounded-lg bg-white p-4"
                        >
                          <Text className="text-center font-[nunito] text-lg font-normal text-black">
                            Create
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
