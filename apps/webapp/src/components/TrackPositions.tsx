import Image from 'next/image';
import React from 'react'
import { FaCrown } from 'react-icons/fa';

const TrackPositions = () => {
    return (
        <>
            <ul className="my-5  space-y-5">
                {rankings.map(
                    (ranking, idx) =>
                        idx <= 2 && (
                            <li className='flex items-center gap-2'
                                key={idx}
                            >
                                <div
                                    className={`flex items-center justify-between ${idx == 0 && "w-[65%] bg-[#268f9b]"
                                        } ${idx == 1 && "w-[55%] bg-[#5F37E6]"} ${idx == 2 && "bg-black w-[45%]"} p-2 pl-3 rounded-r-3xl`}
                                >
                                    <div className="flex items-center">
                                        <span className="font-bold text-base text-white flex items-center gap-2">
                                            <FaCrown className={`text-base ${idx == 0 && 'text-[#F79E1B]'} ${idx == 1 && 'text-[#C0C0C0]'} ${idx == 2 && 'text-[#9c6630]'}`} />
                                        </span>
                                        <span className="ml-3 font-semibold text-lg text-white">
                                            {Number(ranking.rank).toLocaleString("en-US")}
                                        </span>

                                    </div>
                                    <Image
                                        src='/user.png'
                                        alt='profile'
                                        width={50}
                                        height={50}
                                        className="rounded-full border-2 border-white "
                                    />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {ranking.title}
                                    </h2>
                                    <p className="text-[#767676] text-base">
                                        {Number(ranking.value).toLocaleString("en-US")} XP
                                    </p>
                                </div>
                            </li>))}
            </ul>
            <div className='other-positions'>
                <p>User</p>
                <p>Global Rank</p>
            </div>
            <ul className="container space-y-3">
                {rankings.map(
                    (ranking, idx) =>
                        idx >= 3 && (
                            <li
                                key={idx}
                                className="flex items-center justify-between py-2"
                            >
                                <div className="flex items-center gap-3">
                                    <Image
                                        src='/user.png'
                                        alt='profile'
                                        width={50}
                                        height={50}
                                        className="rounded-full border-2 border-white "
                                    />
                                    <div>
                                        <h2 className="text-black dark:text-white font-semibold mb-1 text-lg">
                                            @{ranking.title}
                                        </h2>
                                        <span className="font-bold text-base px-2 py-1 rounded-md bg-primary dark:bg-primary-dark text-black dark:text-white">
                                            {" "}
                                            {idx + 1}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <h4 className="font-bold text-lg">
                                        {" "}
                                        {Number(ranking.rank).toLocaleString("en-US")}
                                    </h4>
                                    <p className="text-[#767676] text-base">
                                        {Number(ranking.value).toLocaleString("en-US")} XP
                                    </p>
                                </div>
                            </li>
                        )
                )}
            </ul>
            <div className="personal-container max-w-4xl mx-auto">
                <div className="flex items-center gap-3 flex-nowrap">
                    <Image
                        src='/user.png'
                        alt='profile'
                        width={55}
                        height={55}
                        className="rounded-full border-2 border-white "
                    />
                    <div className="flex items-center gap-3 w-fit">
                        <div className="grid gap-1">
                            <h3>Referrals</h3> <h3>XP</h3>
                        </div>
                        <div className="grid gap-1">
                            <h3>50,000</h3> <h3>5,0000,000 Xp</h3>
                        </div>
                    </div>
                </div>
                <div className="grid gap-1">
                    <div className="grid grid-cols-2 text-center">
                        <h3>Position</h3> <h3>Members</h3>
                    </div>
                    <div className="flex text-center bg-white gap-1 dark:bg-black p-1 rounded-lg">
                        <h3>3,450,891</h3>
                        <span className="h-full bg-black dark:bg-white w-[1px]"></span>
                        <h3>10,500,675</h3>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TrackPositions;
const rankings = [
    {
        title: "Amazinglanky",
        rank: "10000",
        value: "5678890",
    },
    {
        title: "Amazinglanky",
        rank: "10000",
        value: "5678890",
    },
    {
        title: "Amazinglanky",
        rank: "10000",
        value: "5678890",
    },
    {
        title: "Amazinglanky",
        rank: "10000",
        value: "5678890",
    },
    {
        title: "Amazinglanky",
        rank: "10000",
        value: "5678890",
    },
    {
        title: "Amazinglanky",
        rank: "10000",
        value: "5678890",
    },
    {
        title: "Amazinglanky",
        rank: "10000",
        value: "5678890",
    },
    {
        title: "Amazinglanky",
        rank: "10000",
        value: "5678890",
    },
    {
        title: "Amazinglanky",
        rank: "10000",
        value: "5678890",
    },
    {
        title: "Amazinglanky",
        rank: "10000",
        value: "5678890",
    },
];