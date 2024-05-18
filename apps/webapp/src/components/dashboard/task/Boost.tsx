"use client";

import Image from "next/image";
import BotHead from "@/assets/bot-head.svg";
import { useSession } from "@/lib/sessionContext";
import { useQuery } from "convex/react";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { FaCircleCheck, FaXTwitter } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";

import { api } from "@acme/api/convex/_generated/api";

const Boost = () => {
  const session = useSession();
  const adConfig = useQuery(api.queries.getAdsConfig);

  return (
    <div>
      <ul className="grid gap-4">
        {ecosystemTaskList.map((items, ki) => (
          <li key={ki} className="dark:bg-primary-dark rounded-xl bg-white">
            <button
              className={`w-full px-5 py-4 ${
                items.completed ? "opacity-30" : ""
              } block space-y-2`}
              onClick={(e) => {
                if (items.completed) {
                  e.preventDefault();
                }
              }}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`boost-icon-container ${items.type == "bot" ? "" : "border-[1.5px]"}`}
                  >
                    {/* Can be replaced with an image tag if image is to be rendered instead */}
                    {items.type == "bot" && !items.completed && (
                      <Image src={BotHead} height={60} width={60} alt="bot" />
                    )}
                    {items.type == "twitter" && !items.completed && (
                      <FaXTwitter />
                    )}
                    {items.type == "discord" && !items.completed && (
                      <FaDiscord />
                    )}
                    {items.type == "telegram" && !items.completed && (
                      <FaTelegramPlane />
                    )}
                    {items.completed && <FaCircleCheck />}
                  </div>
                  <div className="space-y-2 text-left">
                    <h4 className="text-xl font-semibold">{items.name}</h4>
                    <p className="background inline-block rounded-full px-2 py-1 text-base font-semibold text-[#767676]">
                      <span>+{items.reward} XP</span>
                    </p>
                  </div>
                </div>
                <div>
                  {items.type == "bot" && (
                    <p className="text-lg font-semibold">0/10</p>
                  )}
                </div>{" "}
              </div>
              <div className="text-left"></div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Boost;

const ecosystemTaskList = [
  {
    name: "Invite 10 Friends",
    reward: 10000,
    link: "/",
    type: "bot",
    completed: false,
  },
  {
    name: "Follow On X(Twitter)",
    reward: 2000,
    link: "https://twitter.com/Enetecosystem",
    type: "twitter",
    completed: true,
  },
  {
    name: "Join Telegram Channel",
    reward: 2000,
    link: "https://t.me/enetecosystem",
    type: "telegram",
    completed: false,
  },
  {
    name: "Join Telegram",
    reward: 2000,
    link: "https://t.me/enetworkchannel",
    type: "telegram",
    completed: false,
  },
  {
    name: "Join Discord",
    reward: 2000,
    link: "https://discord.gg/RQqVWPxuwq",
    type: "discord",
    completed: false,
  },
];
