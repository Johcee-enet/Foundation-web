import { FC } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { ImageBackground } from "expo-image";
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";

// import LinearGradient from "react-native-linear-gradient";

interface IOverviewProps {
  referrals: number;
  totalUsers: number;
  globalRank: number;
  referralCode: string;
}
export const Overview: FC<IOverviewProps> = ({
  referrals,
  totalUsers,
  globalRank,
  referralCode,
}) => {
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(referralCode);
  };

  return (
    <View className="h-[160px] overflow-hidden rounded-xl bg-transparent">
      <ImageBackground
        source={require("../../assets/main/overview-bg.png")}
        style={{ justifyContent: "center" }}
      >
        {/* States design */}
        <View className="flex h-full w-full flex-col items-start justify-between p-4">
          <View className="flex w-full flex-row items-center justify-between">
            <View className="rounded-lg bg-slate-300/30 p-2">
              <Ionicons name="trophy-outline" size={20} color="white" />
            </View>

            <View className="flex flex-row items-center justify-center gap-2">
              <FontAwesome5 name="users" size={20} color="#ABABAB" />
              <Text className="font-[nunito] text-lg font-normal text-[#ABABAB]">
                {totalUsers.toLocaleString("en-US")}
              </Text>
            </View>
          </View>
          <View className="flex w-full flex-row items-center justify-start gap-20 px-8">
            <View className="flex flex-col items-start justify-center gap-2">
              <Text className="font-[nunito] text-lg font-light text-[#ABABAB]">
                Referrals
              </Text>
              <Text className="font-[nunito] text-2xl font-medium text-white">
                {referrals.toLocaleString("en-US")}
              </Text>
            </View>
            <View className="flex flex-col items-start justify-center gap-2">
              <Text className="font-[nunito] text-lg font-light text-[#ABABAB]">
                Global Rank
              </Text>
              <Text className="font-[nunito] text-2xl font-medium text-white">
                {globalRank.toLocaleString("en-US")}
              </Text>
            </View>
          </View>

          <View className="flex w-full flex-row items-center justify-start gap-6 px-8">
            <Text className="font-[nunito] text-lg font-light text-white">
              Referral Code: {referralCode}
            </Text>

            <TouchableOpacity
              onPress={() => {
                copyToClipboard().catch((error) =>
                  console.log(error, ":::Error"),
                );
                Alert.alert("Link copied");
              }}
            >
              <Feather name="copy" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

// interface IGradientBackgroundProps {
//   children: ReactNode
// }
// const GradientBackground: FC<IGradientBackgroundProps> = ({ children }) => {

//   return (
//     <LinearGradient colors={['#000000', '#000000', '#D9D9D9']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
//       {children}
//     </LinearGradient>
//   )
// }
