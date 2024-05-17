"use client";

import React, { FC, Suspense } from "react";
import ShareLink from "@/components/dashboard/ShareLink";
import { Loader } from "@/components/loader";
import ReturnHeader from "@/components/ReturnHeader";
import { useSession } from "@/lib/sessionContext";
import { useQuery } from "convex/react";

import { api } from "@acme/api/convex/_generated/api";
import { Doc, Id } from "@acme/api/convex/_generated/dataModel";

function Referral() {
  const session = useSession();

  const referrals: Doc<"activity">[] | undefined = useQuery(
    api.queries.getOnlyXpHistory,
    { userId: session?.userId as Id<"user"> },
  );

  return (
    <main className="pt-32">
      <ReturnHeader page="Referral" push="/dashboard" />
      <section>
        <div className="px-5 md:px-10 lg:px-20">
          <div className="my-6">
            <h1 className="text-3xl font-semibold">
              Refer your friends and Get up to 5000 XPs{" "}
            </h1>
            <p className="my-3 text-[#939393] dark:text-[#717171]">
              Your friends get 1000 Xp upon sign up, task completion and must be
              active for 5 days.
            </p>
            <ShareLink />
          </div>
        </div>
        <div className="dark:bg-primary-dark rounded-t-3xl bg-white p-5 pb-10 drop-shadow md:p-10 lg:px-20">
          <div className="flex items-center justify-between pb-3 text-base">
            <h4 className="text-xl">Referrals</h4>{" "}
            <div className="rounded-lg bg-[#f5f5f5] px-5 py-2 text-lg font-semibold text-black dark:bg-[#131721] dark:text-white">
              {referrals ? referrals.length : 0}
            </div>
          </div>
          <Suspense fallback={<Loader color="white" />}>
            <ReferralItem referrals={referrals} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

const ReferralItem: FC<{ referrals: Doc<"activity">[] | undefined }> = ({
  referrals,
}) => {
  return (
    <ul className="grid gap-2">
      {referrals &&
        referrals.map((item, q) => (
          <li
            key={q}
            className="flex items-center justify-between rounded-lg bg-primary px-4 py-5 text-lg text-black dark:bg-[#23262D] dark:text-white"
          >
            <span>{item?.message}</span>{" "}
            <span className="font-semibold">+{item?.extra ?? "5000"}Xp</span>
          </li>
        ))}
    </ul>
  );
};

export default Referral;

const referral = [
  "Johcee joined via your link",
  "Johcee joined via your link",
  "Johcee joined via your link",
  "Johcee joined via your link",
  "Johcee joined via your link",
  "Johcee joined via your link",
  "Johcee joined via your link",
  "Johcee joined via your link",
  "Johcee joined via your link",
  "Johcee joined via your link",
  "Johcee joined via your link",
  "Johcee joined via your link",
  "Johcee joined via your link",
];
