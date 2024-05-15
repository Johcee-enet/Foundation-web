"use client";
import Link from "next/link";
import { HiMiniUserGroup } from "react-icons/hi2";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter, FaCircleCheck } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";

const Tasks = () => {
    return (
        <div>
            <h5 className="text-center font-semibold text-lg mb-8 mt-6">
                Simple task for more Xp`s
            </h5>
            {ecosystemTaskList[0].name ? (
                <ul className="grid gap-4 ">
                    {ecosystemTaskList.map((items, ki) => (
                        <li key={ki} className="task-list">
                            <Link
                                href={"/"}
                                className={`py-4 px-5 ${items.completed ? "opacity-30" : ''
                                    } block space-y-2`}
                                onClick={(e) => {
                                    if (items.completed) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-3 items-center">
                                        <div className="icon-container">
                                            {items.type == "invite" && !items.completed && (
                                                <HiMiniUserGroup />
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
                                        <div>
                                            <h4 className="text-[22px] font-semibold">{items.name}</h4>
                                        </div>
                                    </div>
                                    <div>
                                        {!items.completed && (
                                            <IoIosArrowForward className="text-black text-xl dark:text-white" />
                                        )}
                                    </div>
                                </div>
                                
                                <p className="text-lg inline-block rounded-full px-2 py-1 background text-[#767676] font-semibold">
                                    {items.completed ? (
                                        "Completed"
                                    ) : (
                                        <span>+{items.reward} XP</span>
                                    )}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-lg font-medium text-black dark:text-white">
                    There are no events at this time, check back later
                </p>
            )}
        </div>
    )
}

export default Tasks

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