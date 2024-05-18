"use client";

import { FC, Suspense } from "react";
import Link from "next/link";
import { Loader } from "@/components/loader";
import { useSession } from "@/lib/sessionContext";
import { useQuery } from "convex/react";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { FaCircleCheck, FaXTwitter } from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";

import { api } from "@acme/api/convex/_generated/api";
import { Doc, Id } from "@acme/api/convex/_generated/dataModel";

const Tasks = () => {
  const session = useSession();

  const tasks = useQuery(api.queries.fetchTasks, {
    userId: session?.userId as Id<"user">,
  });

  const config = useQuery(api.queries.getAppConfigForApp);

  return (
    <div>
      <h5 className="mb-8 mt-6 text-center text-lg font-semibold">
        Simple task for more Xp`s
      </h5>
      <Suspense>
        <TaskItems tasks={tasks} userId={session?.userId as string} />
      </Suspense>
    </div>
  );
};

const TaskItems: FC<{ tasks: Doc<"tasks">[] | undefined; userId: string }> = ({
  tasks,
  userId,
}) => {
  const user = useQuery(api.queries.getUserDetails, {
    userId: userId as Id<"user">,
  });

  if (tasks && tasks?.length) {
    return (
      <ul className="grid gap-4 ">
        {tasks.map((item, ki) => {
          const completedTask = user?.completedTasks?.includes(item?._id);

          return (
            <li key={ki} className="task-list">
              <Link
                href={item?.action?.link}
                target="_blank"
                className={`px-5 py-4 ${
                  completedTask ? "opacity-30" : ""
                } block space-y-2`}
                onClick={(e) => {
                  if (completedTask) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="icon-container">
                      {item?.action.channel === "website" && !completedTask && (
                        <HiMiniUserGroup />
                      )}
                      {item?.action?.channel === "twitter" &&
                        !completedTask && <FaXTwitter />}
                      {item?.action.channel == "discord" && !completedTask && (
                        <FaDiscord />
                      )}
                      {item?.action.channel == "telegram" && !completedTask && (
                        <FaTelegramPlane />
                      )}
                      {completedTask && <FaCircleCheck />}
                    </div>
                    <div>
                      <h4 className="text-[22px] font-semibold">
                        {item?.name}
                      </h4>
                    </div>
                  </div>
                  <div>
                    {!completedTask && (
                      <IoIosArrowForward className="text-xl text-black dark:text-white" />
                    )}
                  </div>
                </div>

                <p className="background inline-block rounded-full px-2 py-1 text-lg font-semibold text-[#767676]">
                  {completedTask ? (
                    "Completed"
                  ) : (
                    <span>
                      +
                      {Number(item?.reward ?? 0).toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      })}{" "}
                      XP
                    </span>
                  )}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  } else if (tasks && !tasks?.length) {
    return (
      <p className="text-center text-lg font-medium text-black dark:text-white">
        There are no tasks at this time, check back later
      </p>
    );
  } else {
    return <Loader color="white" />;
  }
};

export default Tasks;

const ecosystemTaskList = [
  {
    name: "Invite 10 Friends",
    reward: 10000,
    link: "/",
    type: "invite",
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
