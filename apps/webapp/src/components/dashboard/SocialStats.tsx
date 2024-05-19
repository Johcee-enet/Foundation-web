import React from "react";

type SocialInfo = {
  earned: number;
  claimed: number;
  referral: number;
  multiplier: number;
};

const SocialStats = (props: SocialInfo) => {
  return (
    <div className="relative z-10 flex h-full flex-col justify-between pb-3 text-center font-bold text-[#989898]">
      <h3 className="text-center text-lg text-[#989898]">
        Total Social XP Earned:{" "}
        <span className="text-black dark:text-white">
          {Number(props.earned).toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </span>
      </h3>
      <p className="text-lg font-bold">
        Claimed Xp:{" "}
        <span className="text-black dark:text-white">
          {Number(props.claimed).toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </span>
      </p>
      <p className="text-lg font-bold">
        Referral Xp:{" "}
        <span className="text-black dark:text-white">
          {Number(props.referral).toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </span>
      </p>
      <p className="text-lg font-bold">
        Multiplier:{" "}
        <span className="text-black dark:text-white">{props.multiplier}% </span>
      </p>
    </div>
  );
};

export default SocialStats;
