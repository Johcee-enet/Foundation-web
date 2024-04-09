import type { FC } from "react";
import { Text, View } from "react-native";
import { ImageBackground } from "expo-image";
import { useQuery } from "convex/react";

import { api } from "@acme/api/convex/_generated/api";

// import ClaimModal from "@/components/claim_modal";
// import LinearGradient from "react-native-linear-gradient";
// import { useMutation } from "convex/react";
// import { api } from "@acme/api/src/convex/_generated/api";
// import { useLocalSearchParams } from "expo-router";

// import type { Id } from "@acme/api/src/convex/_generated/dataModel";

interface IStatsCardProps {
  minedCount: number;
  miningRate: number;
  xpEarned: number;
  redeemableCount: number;
}
export const StatsCard: FC<IStatsCardProps> = ({
  minedCount,
  miningRate,
  xpEarned,
  redeemableCount,
}) => {
  // const params = useLocalSearchParams();

  const appConfig = useQuery(api.queries.getAppConfigForApp);

  return (
    <ImageBackground
      source={require("../../assets/main/stats-bg.png")}
      style={{
        justifyContent: "center",
        height: 171,
        width: "100%",
        backgroundColor: "#EBEBEB",
        borderRadius: 20,
        marginTop: 15,
      }}
      contentFit="contain"
      contentPosition="center"
      // className="bg-contain bg-center bg-no-repeat"
    >
      {/* States design */}
      <View className="flex h-full w-full flex-col items-start justify-end p-4">
        <View
          style={{ marginHorizontal: 40 }}
          className="flex flex-row items-end justify-center gap-2"
        >
          {/* <TouchableOpacity className="flex h-20 w-12 items-end justify-end">
            <Image
              source={require("../../assets/main/miner-fluid-low.png")}
              style={{ width: 40, height: 48, marginBottom: 10 }}
              contentFit="contain"
            />
          </TouchableOpacity> */}

          <View className="flex flex-col items-start justify-center gap-2">
            <Text className="font-[nunito] text-lg font-light text-[#989898]">
              $FOUND Mined
            </Text>
            <Text className="font-[nunito] text-2xl font-bold text-black">
              {minedCount.toLocaleString("en-US")}
            </Text>
            <Text className="font-[nunito] text-lg font-normal text-[#989898]">
              {redeemableCount}
            </Text>
          </View>
          <View style={{ marginHorizontal: 15 }} />
          <View className="flex flex-col items-start justify-center gap-2">
            <Text className="font-[nunito] text-lg font-light text-[#989898]">
              XP Earned
            </Text>
            <Text className="font-[nunito] text-2xl font-bold text-black">
              {xpEarned.toLocaleString("en-US")}
            </Text>
            <Text className="font-[nunito] text-lg font-normal text-[#989898] opacity-0">
              0
            </Text>
          </View>
        </View>

        <View className="my-3" />
        <View className="rounded-lg bg-black px-4 py-2">
          <Text className="text-start font-[nunito] font-normal text-white">
            Mining rate: {appConfig ? appConfig.miningCount : miningRate}{" "}
            FOUND/hr
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};
