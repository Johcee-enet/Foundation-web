"use client";

import { BADFLAGS } from "dns/promises";
import { FC, Suspense, useState } from "react";
import Image from "next/image";
import BotHead from "@/assets/bot-head.svg";
import Duration from "@/assets/duration.svg";
import Flash from "@/assets/flash.svg";
import { Loader } from "@/components/loader";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/lib/sessionContext";
import { getErrorMsg } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { FaCircleCheck, FaXTwitter } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";

import { api } from "@acme/api/convex/_generated/api";
import { Id } from "@acme/api/convex/_generated/dataModel";

const Boost: FC<{ userId: string | null }> = ({ userId }) => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const appConfig = useQuery(api.queries.getAppConfigForApp);

  return (
    <div>
      <Suspense fallback={<Loader color="white" />}>
        <BoostItems
          boosts={appConfig?.boosts}
          userId={(session?.userId ?? userId) as string}
          xpPerToken={appConfig?.xpPerToken ?? 0}
          minimumCost={appConfig?.minimumSaleToken ?? 0}
          setIsLoading={setIsLoading}
        />
      </Suspense>
      <Dialog open={isLoading}>
        <DialogContent
          hideCloseBtn
          className="grid items-center justify-center border-none bg-transparent shadow-none"
        >
          <Loader color="white" />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const BoostItems: FC<{
  boosts: any[] | undefined;
  userId: string;
  xpPerToken: number;
  minimumCost: number;
  setIsLoading: (prev: boolean) => void;
}> = ({ boosts, userId, xpPerToken, minimumCost, setIsLoading }) => {
  const { toast } = useToast();
  const user = useQuery(api.queries.getUserDetails, {
    userId: userId as Id<"user">,
  });

  // Activate boost mutation
  const activateBoost = useMutation(api.mutations.activateBoost);
  // Buy XP
  const buyXP = useMutation(api.mutations.buyXP);

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
                onClick={async (e) => {
                  try {
                    setIsLoading(true);
                    // Only if mining is active then activate boost
                    if (!user?.mineActive) {
                      setIsLoading(false);
                      return toast({
                        title: "Start a mining session to activate boost",
                      });
                    } else {
                      console.log(item, ":::ONBoost clicke", activeBoost);
                      await activateBoost({
                        userId: userId as Id<"user">,
                        boost: { ...item },
                      });
                      setIsLoading(false);
                    }
                  } catch (err: any) {
                    setIsLoading(false);
                    console.log(err, ":::error on boost activate");
                    const errMsg = getErrorMsg(err);
                    toast({
                      title: errMsg,
                    });
                  }
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
        {/* Buy XP with FOUND token */}
        <li className="dark:bg-primary-dark rounded-xl bg-white">
          <button
            className={`block w-full space-y-2 px-5 py-4`}
            onClick={async (e) => {
              setIsLoading(true);
              console.log(":::On buy clicked");
              try {
                // Call buy token proceedure
                await buyXP({
                  userId: userId as Id<"user">,
                });
                setIsLoading(false);
              } catch (err: any) {
                setIsLoading(false);
                const errMsg = getErrorMsg(err);
                toast({
                  variant: "destructive",
                  title: "Error with buying XP",
                  description: errMsg,
                });
                console.log(err, ":::Error on buying token");
              }
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
