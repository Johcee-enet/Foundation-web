import { useEffect, useState } from "react";
import {
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
import {
  exchangeCodeAsync,
  makeRedirectUri,
  refreshAsync,
  TokenResponse,
  useAuthRequest,
} from "expo-auth-session";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
// import BottomSheet, { BottomSheetMethods } from "@devvie/bottom-sheet";
import * as WebBrowser from "expo-web-browser";
import { getData, storeData } from "@/storageUtils";
import { Env } from "@env";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAction } from "convex/react";

import { api } from "@acme/api/src/convex/_generated/api";

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

  // Code after return from twitter auth
  const [authCode, setAuthCode] = useState<string>();

  const initiateUser = useAction(api.onboarding.initializeNewUser);
  const loginUser = useAction(api.onboarding.loginUser);

  const redirectUri = makeRedirectUri({
    scheme: "com.enetminer.enet",
    // path: "redirect",
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

  useEffect(() => {
    console.log(request, redirectUri);
    if (response && response?.type === "success") {
      const { code } = response.params;
      setAuthCode(code);
      console.log(code, ":::Auth response code");
    } else {
      console.log(response, ":::Response from auth attempt");
    }
  }, [response]);

  // Handle access_token exchange after twitter auth
  useEffect(() => {
    if (authCode && !!authCode.length) {
      exchangeCodeForToken().catch((result) =>
        console.log(result, ":::Resutl"),
      );
    }

    async function exchangeCodeForToken() {
      const tokenResponse: TokenResponse = await exchangeCodeAsync(
        { code: authCode!, redirectUri, clientId: Env.TWITTER_CLIENT_ID },
        discovery,
      );

      console.log(tokenResponse, ":::Token response after redirect");

      // Store the returned data
      await storeData("@enet-store/isOnboarded", true);
      await storeData("@enet0-store/token", {
        access: tokenResponse.accessToken,
        refresh: tokenResponse.refreshToken,
      });

      // Get basic user info before proceeding
      // const userInfo = await fetchUserInfoAsync(tokenResponse, discovery);
      // Call the
    }
  }, [authCode]);

  // Handle user return after onboarding into the applicaiton
  useEffect(() => {
    getUserLocalData().catch((result) => console.log(result, ":::Resutl"));
    async function getUserLocalData() {
      try {
        const isOnboarded = await getData("@enet-store/isOnboarded", true);
        if (!isOnboarded) {
          setUserIsOnbaorded(false);
          console.log(isOnboarded, "Is false");
          return;
        } else {
          setUserIsOnbaorded(true);
          // Refresh token
          const token = (await getData("@enet-store/token", true)) as Record<
            string,
            any
          >;
          if (!token) {
            return;
          } else {
            // If token object is available then refresh the token and fetch new user details
            const newToken = await refreshAsync(
              { refreshToken: token?.refresh, clientId: Env.TWITTER_CLIENT_ID },
              discovery,
            );
            console.log(newToken);

            // Pass it to tweep fetch user badic details and redirect to dashboard
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
            <View className="flex h-auto w-full flex-col items-center justify-center rounded-b-[35px] bg-[#EBEBEB] py-8">
              <Image
                source={require("../../../assets/miner_onboard_img-1.png")}
                style={{ width: 170, height: 170, alignItems: "center" }}
              />
              <Text
                style={{ fontSize: 24 }}
                className="font-[nunito] text-[24px] font-medium tracking-normal"
              >
                Welcome to Enetwallet
              </Text>
              <Text className="font-[nunito] text-[14px] font-light tracking-widest">
                THE Web3 STANDARD
              </Text>
            </View>
            <View className="flex h-auto w-full flex-col items-center justify-center px-[20px] py-5">
              <Text className="mb-[27px] font-[nunito] text-xl font-medium">
                Input your email address
              </Text>
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
                    className="font-[nunito] font-medium text-blue-500"
                    href="/"
                    onPress={async (e) => {
                      e.preventDefault();
                      await storeData("@enet-store/isOnboarded", true);

                      setUserIsOnbaorded(true);
                    }}
                  >
                    Login
                  </Link>
                )}
                {userIsOnboarded && (
                  <Link
                    className="font-[nunito] font-medium text-blue-500"
                    href="/"
                    onPress={async (e) => {
                      e.preventDefault();
                      await storeData("@enet-store/isOnboarded", false);

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
                  href="/"
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
                        await storeData("@enet-store/user", { email, userId });
                        // @ts-expect-error something went wrong routing
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
                      await storeData("@enet-store/user", { email, userId });
                      await storeData("@enet-store/isOnboarded", true);

                      // @ts-expect-error something went wrong routing
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
                  href="/"
                  disabled={!request}
                  className="flex w-16 max-w-16 items-center justify-center overflow-hidden rounded-lg bg-black p-4 text-center font-[nunito] text-lg font-normal text-white transition-colors"
                  onPress={async (e) => {
                    e.preventDefault();

                    console.log("Twitter button");

                    await promptAsync({
                      dismissButtonStyle: "close",
                    });
                  }}
                >
                  <FontAwesome6 name="x-twitter" size={20} color="white" />
                </Link>
              </View>

              <Text className="mt-4 text-center font-[nunito] leading-6 text-black sm:max-w-xl">
                By continuing, you agree to our{" "}
                <Link
                  // suppressHighlighting
                  className="text-[#15BDCF]"
                  href="/"
                  onPress={async (e) => {
                    // Call bottom sheet slider to display terms
                    await WebBrowser.openBrowserAsync("https://");
                  }}
                >
                  terms of service
                </Link>{" "}
                and{" "}
                <Link
                  // suppressHighlighting
                  className="text-[#15BDCF]"
                  href="/"
                  onPress={async () => {
                    await WebBrowser.openBrowserAsync("https://");
                  }}
                >
                  privacy policy
                </Link>
                .
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
