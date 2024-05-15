import ReturnHeader from '@/components/ReturnHeader'
import React from 'react'
import { BiRedo } from "react-icons/bi";
import { IoTelescopeOutline } from "react-icons/io5";

const History = () => {
    return (
        <main className='pt-32'>
            <ReturnHeader page='history' push='/dashboard' />
            <div className='history-content'>
                <h4 className='mb-4 text-lg'>Today</h4>
                <ul className='space-y-2'>
                    {historyActivities.map((history, i) => (
                        <li className="history-event">
                            <div className="flex items-start gap-3">
                                <div
                                    className={`p-2 text-3xl ${history.type == "referral" &&
                                        "bg-[#E2DEF0] text-[#5F37E6]"
                                        } ${history.type == "leaderboard" &&
                                        "bg-[#D5EEF0] text-[#14BBCC]"
                                        } w-fit rounded-md`}
                                >
                                    {history.type == "referral" && <BiRedo />}
                                    {history.type == "leaderboard" && <IoTelescopeOutline />}
                                </div>
                                <div className="max-w-64">
                                    <h3 className="text-lg font-medium">{history.activity}</h3>
                                    <span className="text-base text-[#989898]">
                                        {new Date().toLocaleDateString("en-US", {
                                            //   hour: "2-digit",
                                            //   minute: "2-digit",
                                            dateStyle: "full",
                                        })}
                                    </span>
                                </div>
                            </div>
                            {history.type == "referral" && (
                                <h3 className="text-lg font-semibold">{history.value} XP</h3>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    )
}

export default History;

const historyActivities = [
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "referral",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "leaderboard",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "leaderboard",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "referral",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "referral",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "referral",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "leaderboard",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "leaderboard",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "referral",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "leaderboard",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "leaderboard",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "referral",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "referral",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "referral",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "leaderboard",
    },
    {
        activity: "Johcee joined using your referral link",
        value: "1234",
        date: 1212,
        type: "leaderboard",
    },
];