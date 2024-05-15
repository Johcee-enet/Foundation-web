"use client";

import { HiMiniUserGroup } from "react-icons/hi2";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter, FaCircleCheck } from "react-icons/fa6";
import BotHead from '@/assets/bot-head.svg'
import Image from "next/image";

const Boost = () => {
    return (
        <div>
            <ul className="grid gap-4">
                {ecosystemTaskList.map((items, ki) => (
                    <li key={ki} className="bg-white dark:bg-primary-dark rounded-xl">
                        <button
                            className={`w-full py-4 px-5 ${items.completed ? "opacity-30" : ''
                                } block space-y-2`}
                            onClick={(e) => {
                                if (items.completed) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <div className="w-full flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                    <div className={`boost-icon-container ${items.type == "bot" ? '' : 'border-[1.5px]'}`}>
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
                                    <div className="text-left space-y-2">
                                        <h4 className="text-xl font-semibold">{items.name}</h4>
                                        <p className="text-base inline-block rounded-full px-2 py-1 background text-[#767676] font-semibold">

                                            <span>+{items.reward} XP</span>

                                        </p>
                                    </div>
                                </div>
                                <div>
                                    {items.type == 'bot' && (
                                        <p className="text-lg font-semibold">0/10</p>
                                    )}
                                </div>      </div>
                            <div className="text-left">

                            </div>

                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Boost

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
