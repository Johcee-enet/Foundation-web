"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Overview from "@/components/dashboard/Overview";
import PlannedTask from "@/components/dashboard/PlannedTask";
import Status from "@/components/dashboard/Status";
import ClaimXP from "@/components/dashboard/task/ClaimXP";
import TwitterProfile from "@/components/dashboard/TwitterProfile";
import Header from "@/components/Header";
import { useSession } from "@/lib/sessionContext";
import { useAction, useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { addHours, differenceInSeconds } from "date-fns";
import { HiMiniUserGroup } from "react-icons/hi2";

import type { Doc, Id } from "@acme/api/convex/_generated/dataModel";
import { api } from "@acme/api/convex/_generated/api";

export type EventType = Partial<Doc<"events">> & {
  company: Partial<Doc<"company">> & { logoUrl: string };
};

const Dashboard = () => {
  const session = useSession();

  // Fetch users data
  const userDetail = useQuery(api.queries.getUserDetails, {
    userId: session?.userId as Id<"user">,
  });

  const claimReward = useMutation(api.mutations.claimRewards);
  const triggerMiner = useAction(api.mutations.triggerMining);

  // console.log(bottom, top, ":::Bottom Top, size", height, height - top);

  // Embeding
  // const [tweetEmbedHeight, setTweetEmbedHeight] = useState<number>();
  const [remaining, setRemaining] = useState<string>();

  useEffect(() => {
    if (
      !(userDetail?.mineActive ?? false) &&
      (userDetail?.redeemableCount ?? 0) > 0
    ) {
      // setClaimModalVisible(true);
    }
  }, [userDetail?.mineActive, userDetail?.redeemableCount, userDetail]);

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
        // Perform the action here
      } else {
        // const formattedRemainingTime = formatDuration(
        //   { seconds: remainingTime },
        //   { format: ["hours", "minutes", "seconds"] },
        // );
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;

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
  const rewardEventXpCount = useMutation(api.mutations.rewardEventXp);
  const updateEventAction = useMutation(api.mutations.updateEventsForUser);
  const activateBoost = useMutation(api.mutations.activateBoost);

  return (
    <main className="container pb-10 pt-32">
      <Header nickname={userDetail?.nickname} />
      <Status
        mineRate={userDetail?.miningRate ?? 0}
        minedCount={userDetail?.minedCount ?? 0}
        mineHours={userDetail?.mineHours ?? 0}
      />
      <h3 className="mb-2 mt-7 text-base font-semibold">Overview</h3>
      <Overview
        rank={userDetail?.globalRank ?? 1000}
        referrals={userDetail?.referralCount ?? 16}
        users={userDetail?.totalUserCount ?? 0}
        referralCode={userDetail?.referralCode ?? "gzrhjtw5"}
      />
      <div className="my-10">
        <Link href={"/dashboard/referral"} className="referral-container">
          <div className="rounded-lg bg-[#f5f5f5] p-3 dark:bg-[#23262D]">
            <HiMiniUserGroup className="text-4xl text-black dark:text-white" />
          </div>
          <div>
            <h3>Invite Friends</h3>
            <p className="text-base text-[#989898]">
              The more users you refer , the more $FOUND you earn
            </p>
          </div>
        </Link>
      </div>
      <PlannedTask />
      <TwitterProfile />
      <ClaimXP />
    </main>
  );
};

export default Dashboard;
