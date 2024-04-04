// import type { TokenResponse } from "expo-auth-session";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import LoadingModal from "@/components/loading_modal";
import { getData, storeData } from "@/storageUtils";
import { Twitter, TwitterAuth } from "@/twitterUtils";
import { Env } from "@env";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAction, useMutation } from "convex/react";

import type { Doc } from "@acme/api/convex/_generated/dataModel";
import { api } from "@acme/api/convex/_generated/api";

WebBrowser.maybeCompleteAuthSession();
const discovery = {
  authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
  tokenEndpoint: "https://twitter.com/i/oauth2/token",
  revocationEndpoint: "https://twitter.com/i/oauth2/revoke",
};

export default function Register() {
  const [email, setEmail] = useState("");
  const [referreeCode, setReferreeCode] = useState("");
  const [password, setPassword] = useState("");
  const [userIsOnboarded, setUserIsOnbaorded] = useState(false);

  const initiateUser = useAction(api.onboarding.initializeNewUser);
  const loginUser = useAction(api.onboarding.loginUser);

  // Twitter auth login
  const loginTwiitter = useAction(api.onboarding.loginTwitterUser);

  const storeNickname = useMutation(api.onboarding.storeNickname);
  const isNicknameValid = useMutation(api.onboarding.isNicknameValid);

  const [isTwitterAuthLoading, setTwitterAuthLoading] =
    useState<boolean>(false);

  const redirectUri = makeRedirectUri({
    // native: "com.enetminer.enet/",
    scheme: "com.enetminer.enet",
    path: "/",
    isTripleSlashed: true,
  });

  // Twitter auth test
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: Env.TWITTER_CLIENT_ID,
      redirectUri,
      usePKCE: true,
      scopes: [
        "tweet.read",
        "tweet.write",
        "users.read",
        "like.write",
        "list.read",
        "follows.write",
        "follows.read",
        "list.read",
        "offline.access",
      ],
    },
    discovery,
  );

  // Handle useAuthRequest response after twitter callback
  useEffect(() => {
    if (response && response?.type === "success") {
      const { code } = response.params;
      exchangeCodeForToken(code!)
        .then((result) => {
          console.log(result, ":::Result of code exchange");
        })
        .catch((error: any) =>
          console.log(
            error.message ?? error.toString(),
            ":::Error for code exchange",
          ),
        );
    }

    async function exchangeCodeForToken(code: string) {
      try {
        // Get TwitterAuth namespace
        if (code && redirectUri && request) {
          setTwitterAuthLoading(true);
          const tokenResponse = await TwitterAuth.exchangeCodeForToken({
            code,
            clientId: Env.TWITTER_CLIENT_ID,
            redirectUrl: redirectUri,
            codeVerifier: request.codeVerifier!,
          });
          console.log(tokenResponse, ":::Token response");

          // Store the returned data
          storeData("@enet-store/isOnboarded", true);
          storeData("@enet-store/token", {
            access: tokenResponse?.access_token,
            refresh: tokenResponse?.refresh_token,
          });

          if (tokenResponse) {
            const userData = await Twitter.userData({
              token: tokenResponse?.access_token,
            });
            console.log(userData, ":::User data");

            // TODO: Create user if not already created and store email and username as nickname
            const isValid = await isNicknameValid({
              nickname: userData?.data?.username.trim(),
            });

            if (isValid) {
              const userId = await storeNickname({
                nickname: userData?.data?.username.trim(),
                referreeCode,
              });
              storeData("@enet-store/user", {
                userId,
                nickname: userData?.data?.username.trim(),
              });
              setTwitterAuthLoading(false);

              router.push({
                pathname: "/(main)/dashboard",
                params: { userId, nickname: userData?.data?.username.trim() },
              });
            }
          }

          // Get basic user info before proceeding
        }
      } catch (err: any) {
        console.log(err.message ?? err.toString(), ":::Error");
        throw new Error(err);
      }
    }
  }, [response, redirectUri, request]);

  // Handle user return after onboarding into the applicaiton
  useEffect(() => {
    getUserLocalData().catch((result) => console.log(result, ":::Resutl"));
    async function getUserLocalData() {
      try {
        const isOnboarded = getData("@enet-store/isOnboarded", true);
        if (!isOnboarded) {
          setUserIsOnbaorded(false);
          console.log(isOnboarded, "Is false");
          return;
        } else {
          setTwitterAuthLoading(true);
          setUserIsOnbaorded(true);
          // Refresh token
          const token = getData("@enet-store/token", true) as Record<
            string,
            any
          >;
          if (!token) {
            setTwitterAuthLoading(false);
            return;
          } else {
            // If token object is available then refresh the token and fetch new user details

            console.log(token, ":::Stored token");

            // Get user token and fetch user data
            const userData = await Twitter.userData({ token: token?.access });
            console.log(userData, ":::User data");

            const user: Doc<"user"> | undefined = await loginTwiitter({
              nickname: userData?.data?.username,
            });

            storeData("@enet-store/user", {
              userId: user?._id,
              nickname: userData?.data?.username.trim(),
            });

            setTwitterAuthLoading(false);

            router.push({
              pathname: "/(main)/dashboard",
              params: {
                userId: user?._id,
                nickname: userData?.data?.username.trim(),
              },
            });
          }
        }
      } catch (e: any) {
        return Alert.alert("Onboarding error", e.message ?? e.toString());
      }
    }
  }, [userIsOnboarded]);

  return (
    <SafeAreaView className="bg-[#EBEBEB]">
      <KeyboardAvoidingView behavior={"position"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView className="min-h-screen w-full bg-white">
            <View className="flex h-auto w-full flex-col items-center justify-center gap-4 rounded-b-[35px] bg-[#EBEBEB] py-6">
              <Image
                source={require("../../assets/foundation_logo.png")}
                style={{ width: 170, height: 170, alignItems: "center" }}
              />
              <Text
                style={{ fontSize: 24 }}
                className="font-[nunito] text-[24px] font-bold tracking-normal"
              >
                Welcome to Foundation
              </Text>
              <Text className="font-[nunito] text-[14px] font-light tracking-widest">
                THE Web3 STANDARD
              </Text>
            </View>
            <View className="flex h-auto w-full flex-col items-center justify-center px-[20px] py-5">
              {/* <Text className="mb-[27px] font-[nunito] text-xl font-medium">
                Input your email address
              </Text> */}
              <View style={{ marginVertical: 10 }} />
              <TextInput
                placeholder="Email address"
                className="mb-[16px] w-full rounded-md bg-[#EBEBEB] px-6 py-4 font-[nunito] text-lg font-medium text-black placeholder:font-light placeholder:text-black"
                onChangeText={(text) => setEmail(text)}
              />
              {!userIsOnboarded && (
                <TextInput
                  placeholder="Referral"
                  className="w-full rounded-md bg-[#EBEBEB] px-6 py-4 font-[nunito] text-lg font-medium text-black placeholder:font-light placeholder:text-black"
                  value={referreeCode}
                  onChangeText={(text) => setReferreeCode(text)}
                />
              )}
              {userIsOnboarded && (
                <TextInput
                  placeholder="Password"
                  value={password}
                  className="w-full rounded-md bg-[#EBEBEB] px-6 py-4 font-[nunito] text-lg font-medium text-black placeholder:font-light placeholder:text-black"
                  onChangeText={(text) => setPassword(text)}
                />
              )}
              <View className="w-full items-end justify-center">
                {!userIsOnboarded && (
                  <Link
                    className="font-[nunito] text-lg font-semibold text-blue-500"
                    href="/"
                    onPress={(e) => {
                      e.preventDefault();
                      storeData("@enet-store/isOnboarded", true);

                      setUserIsOnbaorded(true);
                    }}
                  >
                    Login
                  </Link>
                )}
                {userIsOnboarded && (
                  <Link
                    className="font-[nunito] text-lg font-semibold text-blue-500"
                    href="/"
                    onPress={(e) => {
                      e.preventDefault();
                      storeData("@enet-store/isOnboarded", false);

                      setUserIsOnbaorded(false);
                    }}
                  >
                    Signup
                  </Link>
                )}
              </View>
            </View>

            <View className="flex h-auto w-full flex-col items-center justify-center px-[20px]">
              <View className="flex w-full flex-row items-center justify-center gap-3">
                <Link
                  suppressHighlighting
                  href="/#"
                  className="flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-black p-4 text-center font-[nunito] text-lg font-normal text-white transition-colors"
                  onPress={async (e) => {
                    try {
                      e.preventDefault();
                      // return router.push("/(main)/history");
                      //

                      // TODO: If user is onboarded already, then login
                      if (userIsOnboarded) {
                        if (!email.length || !password.length) {
                          return Alert.alert(
                            "Onbaording error",
                            "Valid email or password must be entered",
                          );
                        }

                        const user = await loginUser({ email, password });
                        const userId = user?._id;
                        // Store data to local storage
                        storeData("@enet-store/user", {
                          email,
                          userId,
                          nickname: user?.nickname,
                        });

                        return router.push({
                          pathname: "/(main)/dashboard",
                          params: { email, userId, nickname: user?.nickname },
                        });
                      }

                      if (!email.length) {
                        return Alert.alert(
                          "Onbaording error",
                          "Valid email must be entered",
                        );
                      }

                      // TODO: call server convex function to store users email and referral then send OTP to email address
                      const userId = await initiateUser({
                        referreeCode: !referreeCode.length
                          ? referreeCode.trim()
                          : undefined,
                        email: email.trim(),
                      });

                      console.log(userId, ":::Result of stored user");

                      // Store data to local storage
                      storeData("@enet-store/user", { email, userId });
                      storeData("@enet-store/isOnboarded", true);

                      router.push({
                        pathname: "/(onboarding)/otp",
                        params: { email, userId },
                      });
                    } catch (e: any) {
                      Alert.alert("Onboarding error", e.message);
                    }
                  }}
                >
                  {userIsOnboarded ? "Login" : "Signup"}
                  {/* <Text className=""></Text> */}
                </Link>
                <Link
                  suppressHighlighting
                  href="/#"
                  disabled={!request}
                  className="flex w-16 max-w-16 items-center justify-center overflow-hidden rounded-lg bg-black p-4 text-center font-[nunito] text-lg font-normal text-white transition-colors"
                  onPress={async (e) => {
                    e.preventDefault();

                    console.log("Twitter button", redirectUri);

                    await promptAsync({
                      dismissButtonStyle: "close",
                    });
                  }}
                >
                  <FontAwesome6 name="x-twitter" size={20} color="white" />
                </Link>
              </View>

              <Text
                style={{ marginTop: 25 }}
                className="mx-5 text-center font-[nunito] text-lg leading-6 text-black"
              >
                By continuing, you agree to our{" "}
                <Link
                  // suppressHighlighting
                  className="text-[#15BDCF]"
                  href="/#"
                  onPress={async (e) => {
                    e.preventDefault();
                    // Call bottom sheet slider to display terms
                    await WebBrowser.openBrowserAsync(
                      "https://enetecosystem.gitbook.io/foundation/terms-and-conditions",
                    );
                  }}
                >
                  terms of service
                </Link>{" "}
                and{" "}
                <Link
                  // suppressHighlighting
                  className="text-[#15BDCF]"
                  href="/#"
                  onPress={async (e) => {
                    e.preventDefault();
                    await WebBrowser.openBrowserAsync(
                      "https://enetecosystem.gitbook.io/foundation/privacy-policy",
                    );
                  }}
                >
                  privacy policy
                </Link>
                .
              </Text>
              <LoadingModal
                isLoadingModalVisible={isTwitterAuthLoading}
                setLoadingModalVisible={setTwitterAuthLoading}
              >
                <View className="flex w-full flex-col items-center justify-center p-4">
                  <ActivityIndicator size={"large"} color={"black"} />
                  <Text>Authorizing your twitter account...</Text>
                </View>
              </LoadingModal>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
