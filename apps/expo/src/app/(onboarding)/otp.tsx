import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// otp input
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import Header from "@/components/header";
import { useAction } from "convex/react";

import type { Id } from "@acme/api/src/convex/_generated/dataModel";
import { api } from "@acme/api/src/convex/_generated/api";

const CELL_COUNT = 6;

export default function OTPPage() {
  const params = useLocalSearchParams();

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const { top } = useSafeAreaInsets();

  // verify otp functon
  const verifyUserOTP = useAction(api.onboarding.verifyUserOTP);
  const resendOTP = useAction(api.onboarding.resendOTPCode);

  useEffect(() => {
    console.log(params, ":::Local params");
  }, []);

  return (
    <SafeAreaView className="bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="min-h-screen w-full bg-[#F5F5F5]">
            <Stack.Screen
              options={{
                headerShown: true,
                header() {
                  return <Header top={top} />;
                },
              }}
            />
            <View className="flex h-auto w-full flex-col items-center justify-center gap-4 rounded-b-[35px] py-5">
              <Image
                source={require("../../../assets/otp.png")}
                style={{ width: 74, height: 74, alignItems: "center" }}
              />
              <Text className="text-center font-[nunito] text-2xl font-medium tracking-normal">
                We’ve sent a 6-digit OTP to{"\n"}
                {params?.email}
              </Text>
            </View>

            <View className="flex h-auto w-full flex-col items-start justify-center gap-4 rounded-b-[35px] px-[24px] py-10">
              <Text className="px-2 font-[nunito]">Input code</Text>

              <CodeField
                ref={ref}
                {...props}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    className="mx-1 h-14 w-14 rounded-xl border border-slate-400 bg-[#EBEBEB] text-center font-[nunito] text-2xl leading-[50px] active:border-black"
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>
            <View className="flex w-full flex-1 flex-col items-start justify-center gap-4 px-[24px]">
              <Link
                // suppressHighlighting
                // @ts-expect-error href
                href="/otp/#"
                onPress={async (e) => {
                  e.preventDefault();

                  // TODO: call verifyOTP action
                  if (!value.length) {
                    return Alert.alert(
                      "Onbaording error",
                      "Valid OTP code must be entered",
                    );
                  }

                  const isValid = await verifyUserOTP({
                    userId: params?.userId as Id<"user">,
                    otp: value,
                  });

                  if (isValid) {
                    // @ts-expect-error routing
                    router.push({ pathname: "/(onboarding)/password", params });
                  } else {
                    return Alert.alert("Onboarding error", "Invalid OTP code");
                  }
                }}
                className="flex w-full items-center justify-center overflow-hidden rounded-lg bg-black p-4 text-center font-[nunito] text-lg font-normal text-white transition-colors"
              >
                Continue
                {/* <Text className=""></Text> */}
              </Link>
              <Link
                // suppressHighlighting
                // @ts-expect-error href
                href="/otp/#"
                onPress={async (e) => {
                  e.preventDefault();
                  // TODO: Resend OTP
                  await resendOTP({
                    email: params?.email as string,
                    userId: params?.userId as string,
                  });

                  Alert.alert(
                    "Resending OTP",
                    "OTP has been sent to the provided email address, check and re-input",
                  );
                }}
                className="flex w-full items-center justify-center overflow-hidden rounded-lg bg-transparent p-4 text-center font-[nunito] text-lg font-normal text-black transition-colors"
              >
                Resend OTP
                {/* <Text className=""></Text> */}
              </Link>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 0 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: {
    marginTop: 5,
    width: "100%",
    marginHorizontal: "auto",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  cell: {
    // width: 40,
    // height: 40,
    // lineHeight: 45,
    // fontSize: 24,
    // borderWidth: 1,
    // borderColor: "#00000030",
    // textAlign: "center",
  },
  focusCell: {
    borderColor: "#000",
  },
});
