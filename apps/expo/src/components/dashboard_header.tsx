import type { Dispatch, FC, SetStateAction } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Env } from "@/env";
import { getData, removeData, storage } from "@/storageUtils";
import { TwitterAuth } from "@/twitterUtils";
import {
  AntDesign,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useMutation } from "convex/react";

import type { Id } from "@acme/api/convex/_generated/dataModel";
import { api } from "@acme/api/convex/_generated/api";

export default function DashboardHeader({
  top,
  nickname,
  modalVisible,
  setModalVisible,
}: {
  top: number;
  nickname: string;
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const params = useLocalSearchParams();
  const deleteAccount = useMutation(api.mutations.deleteAccount);

  return (
    <View
      className="flex w-full flex-row items-center justify-between px-4 py-4"
      style={{ marginTop: top, height: 60 }}
    >
      <View className="flex w-full flex-row items-center justify-between gap-5">
        <UserAvatar
          source="../../../assets/main/avatar.png"
          alt="avatar"
          nickname={nickname ?? "Johcee"}
        />
        <TouchableOpacity className="p-2" onPress={() => setModalVisible(true)}>
          <Ionicons name="grid-outline" size={18} color="#D9D8D8" />
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableWithoutFeedback
            className="h-full w-full"
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Pressable
                  className="my-2 flex w-full flex-row items-center justify-start gap-4"
                  onPress={() => {
                    setModalVisible(false);

                    router.push({ pathname: "/(main)/history", params });
                  }}
                >
                  <MaterialIcons name="chat" size={20} color="black" />
                  <Text className="font-[nunito] text-lg font-normal text-black">
                    History
                  </Text>
                </Pressable>
                <Pressable
                  className="my-2 flex w-full flex-row items-center justify-start gap-4"
                  onPress={() => {
                    router.push({ pathname: "/(main)/leaderboard", params });
                    setModalVisible(false);
                  }}
                >
                  <SimpleLineIcons name="globe" size={20} color="black" />
                  <Text className="font-[nunito] text-lg font-normal text-black">
                    Leaderboard
                  </Text>
                </Pressable>
                <Pressable
                  className="my-2 flex w-full flex-row items-center justify-start gap-4"
                  onPress={() => {
                    // router.push("/(main)/earn");
                    Alert.alert("X-Earn feature comming soon...");
                    setModalVisible(false);
                  }}
                >
                  <FontAwesome6 name="x-twitter" size={20} color="black" />
                  <Text className="font-[nunito] text-lg font-normal text-black">
                    X-Earn
                  </Text>
                </Pressable>
                <Pressable
                  className="my-2 flex w-full flex-row items-center justify-start gap-4"
                  onPress={() => {
                    // router.push("/(main)/spaces")
                    Alert.alert("Spaces feature comming soon...");
                    setModalVisible(false);
                  }}
                >
                  <FontAwesome6 name="x-twitter" size={20} color="black" />
                  <Text className="font-[nunito] text-lg font-normal text-black">
                    Spaces
                  </Text>
                </Pressable>
                <Pressable
                  className="my-2 flex w-full flex-row items-center justify-start gap-4"
                  onPress={() => {
                    setModalVisible(false);
                    Alert.alert("Log out", "Are you sure you want to logout?", [
                      {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => {
                          /*Empty block*/
                        },
                      },
                      {
                        text: "Logout",
                        style: "destructive",
                        onPress: () => {
                          // TODO: cleanup local data and logout

                          (async () => {
                            const token = getData(
                              "@enet-store/token",
                              true,
                            ) as Record<string, any>;
                            await TwitterAuth.revokeToken({
                              token: token.access,
                              clientId: Env.TWITTER_CLIENT_ID,
                            });
                          })()
                            .then((result) => {
                              console.log(result, ":::Access token revoked");

                              removeData("@enet-store/token");
                              removeData("@enet-store/user");
                            })
                            .catch((error) =>
                              console.log(
                                error,
                                ":::error in logout and access revoking",
                              ),
                            );
                          router.replace("/");
                        },
                      },
                    ]);
                  }}
                >
                  <AntDesign name="logout" size={20} color="black" />
                  <Text className="font-[nunito] text-lg font-normal text-black">
                    Logout
                  </Text>
                </Pressable>
                <Pressable
                  className="my-2 flex w-full flex-row items-center justify-start gap-4"
                  onPress={() => {
                    setModalVisible(false);
                    Alert.alert(
                      "Delete Account",
                      "Are you sure you want to delete your account?",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                          onPress: () => {
                            /*Empty block*/
                          },
                        },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => {
                            (async () => {
                              // TODO: Delete logic
                              await deleteAccount({
                                userId: params?.userId as Id<"user">,
                              });
                              storage.clearAll();
                              router.replace("/");
                            })().catch((result) =>
                              console.log(result, ":::IIFE_async block"),
                            );
                          },
                        },
                      ],
                    );
                  }}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    color="#FF4747"
                  />
                  <Text className="font-[nunito] text-lg font-normal text-[#FF4747]">
                    Delete Account
                  </Text>
                </Pressable>
                <View className="my-8" />
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    Alert.alert(
                      "Wallet connection feature is currently a work in progress",
                    );
                  }}
                  className="w-full items-center justify-center rounded-lg border border-black bg-transparent p-2"
                >
                  <Text className="font-[nunito]">Connect Wallet</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
}

interface IUserAvatarProps {
  source: string;
  alt: string;
  nickname: string;
}
const UserAvatar: FC<IUserAvatarProps> = ({ alt, nickname }) => (
  <View className="flex flex-row items-center justify-center gap-2">
    <View
      style={{ width: 40, height: 40 }}
      className="overflow-hidden rounded-xl bg-[#14BBCC] p-1"
    >
      <Image
        source={require("../../assets/main/avatar.png")}
        alt={alt}
        style={{ width: "100%", height: "100%" }}
      />
    </View>

    <Text
      style={{ fontSize: 15, fontWeight: "500" }}
      className="font-[nunito] font-medium"
    >
      {nickname}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    position: "relative",
  },
  modalView: {
    minWidth: 200,
    maxWidth: 200,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    shadowColor: "#000",
    position: "absolute",
    top: 20,
    right: 0,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
