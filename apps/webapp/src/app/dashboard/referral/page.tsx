import ReturnHeader from "@/components/ReturnHeader";
import ShareLink from "@/components/dashboard/ShareLink";
import React from "react";

function page() {
  return (
    <main className="pt-32">
        <ReturnHeader page='history' push='/dashboard' />
      <section>
        <div className="px-5 md:px-10 lg:px-20">
          <div className="my-6">
            <h1 className="text-3xl font-semibold">
              Refer your friends and Get up to 5000 XPs{" "}
            </h1>
            <p className="text-[#939393] dark:text-[#717171] my-3">
              Your friends get 1000 Xp upon sign up, task completion and must be
              active for 5 days.
            </p>
            <ShareLink/>
          </div>
        </div>
        <div className="bg-white dark:bg-primary-dark p-5 md:p-10 lg:px-20 pb-10 rounded-t-3xl drop-shadow">
          <div className="pb-3 flex items-center justify-between text-base">
            <h4 className="text-xl">Referrals</h4>{" "}
            <div className="rounded-lg text-lg py-2 px-5 dark:bg-[#131721] bg-[#f5f5f5] text-black dark:text-white font-semibold">
              {referral.length}
            </div>
          </div>
          <ul className="grid gap-2">
            {referral.map((items, q) => (
              <li
                key={q}
                className="flex items-center justify-between px-4 py-5 bg-primary dark:bg-[#23262D] rounded-lg text-lg dark:text-white text-black"
              >
                <span>{items}</span>{" "}
                <span className="font-semibold">+5000Xp</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default page;

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
