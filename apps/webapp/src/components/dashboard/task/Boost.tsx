"use client";

import { FC, Suspense } from "react";
import Image from "next/image";
import BotHead from "@/assets/bot-head.svg";
import Duration from "@/assets/duration.svg";
import Flash from "@/assets/flash.svg";
import { Loader } from "@/components/loader";
import { useSession } from "@/lib/sessionContext";
import { useQuery } from "convex/react";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { FaCircleCheck, FaXTwitter } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";

import { api } from "@acme/api/convex/_generated/api";
import { Id } from "@acme/api/convex/_generated/dataModel";

const Boost = () => {
  const session = useSession();
  const appConfig = useQuery(api.queries.getAppConfigForApp);

  return (
    <div>
      <Suspense fallback={<Loader color="white" />}>
        <BoostItems
          boosts={appConfig?.boosts}
          userId={session?.userId as string}
          xpPerToken={appConfig?.xpPerToken ?? 0}
          minimumCost={appConfig?.minimumSaleToken ?? 0}
        />
      </Suspense>
    </div>
  );
};

const BoostItems: FC<{
  boosts: any[] | undefined;
  userId: string;
  xpPerToken: number;
  minimumCost: number;
}> = ({ boosts, userId, xpPerToken, minimumCost }) => {
  const user = useQuery(api.queries.getUserDetails, {
    userId: userId as Id<"user">,
  });

  if (boosts) {
    return (
      <ul className="grid gap-4">
        {boosts.map((item, ki) => {
          const activeBoost = user?.boostStatus?.find(
            (val) => val?.boostId === item?.uuid,
          );
          return (
            <li key={ki} className="dark:bg-primary-dark rounded-xl bg-white">
              <button
                className={`w-full px-5 py-4 ${
                  item.completed ? "opacity-30" : ""
                } block space-y-2`}
                onClick={(e) => {
                  console.log(item, ":::ONBoost clicke", activeBoost);
                  // if (items.completed) {
                  //   e.preventDefault();
                  // }
                }}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`boost-icon-container ${item?.type == "bot" ? "" : "border-[1.5px]"} h-24 w-24 bg-[#23262D] p-2`}
                    >
                      {/* Can be replaced with an image tag if image is to be rendered instead */}
                      {item?.type === "bot" && (
                        <Image src={BotHead} height={60} width={60} alt="bot" />
                      )}
                      {item.type === "rate" && (
                        <Image src={Flash} height={60} width={60} alt="rate" />
                      )}
                      {item.type === "duration" && (
                        <Image
                          src={Duration}
                          height={60}
                          width={60}
                          alt="duration"
                        />
                      )}
                    </div>

                    <div className="space-y-2 text-left">
                      <h4 className="text-xl font-semibold">{item?.title}</h4>
                      <div>
                        <p className="inline-block rounded-lg bg-[#D9D9D9] px-2 py-1 text-base font-semibold text-[#767676]">
                          <span>
                            {Number(item?.xpCost ?? 0).toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            })}{" "}
                            XP
                          </span>
                        </p>
                        {item?.type === "bot" && (
                          <span className="ml-3 text-[#767676]">
                            Mine For Extra 3hrs
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    {item?.type !== "bot" && (
                      <p className="text-lg font-semibold text-[#767676]">
                        {activeBoost?.currentLevel ?? 0}/{item?.totalLevel}
                      </p>
                    )}
                  </div>{" "}
                </div>
                <div className="text-left"></div>
              </button>
            </li>
          );
        })}
        <li className="dark:bg-primary-dark rounded-xl bg-white">
          <button
            className={`block w-full space-y-2 px-5 py-4`}
            onClick={(e) => {
              console.log(":::On buy clicked");
              // if (items.completed) {
              //   e.preventDefault();
              // }
            }}
          >
            <div className="flex w-full items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`boost-icon-container h-24 w-24 bg-[#23262D] p-2`}
                >
                  {/* Can be replaced with an image tag if image is to be rendered instead */}

                  <Image src={Duration} height={60} width={60} alt="duration" />
                </div>

                <div className="space-y-2 text-left">
                  <h4 className="text-xl font-semibold">Buy Xp</h4>
                  <p className="inline-block rounded-lg bg-[#D9D9D9] px-2 py-1 text-base font-semibold text-[#767676]">
                    <span>
                      {Number(minimumCost).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      })}
                      $FOUND /
                      {Number(xpPerToken * minimumCost).toLocaleString(
                        "en-US",
                        {
                          maximumFractionDigits: 1,
                          minimumFractionDigits: 1,
                        },
                      )}{" "}
                      XP
                    </span>
                  </p>
                </div>
              </div>
              <div className="inline-block rounded-lg bg-[#D9D9D9] px-2 py-1 text-base font-semibold text-[#767676]">
                <p className="text-lg font-semibold text-[#767676]">$FOUND</p>
              </div>{" "}
            </div>
            <div className="text-left"></div>
          </button>
        </li>
      </ul>
    );
  }
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
