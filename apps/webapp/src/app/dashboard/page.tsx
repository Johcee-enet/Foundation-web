import Header from '@/components/Header'
import Overview from '@/components/dashboard/Overview'
import Status from '@/components/dashboard/Status'
import Link from 'next/link'
import React from 'react'
import { HiMiniUserGroup } from 'react-icons/hi2'
import TwitterProfile from '@/components/dashboard/TwitterProfile';
import PlannedTask from '@/components/dashboard/PlannedTask'
import ClaimXP from '@/components/dashboard/task/ClaimXP'

const Dashboard = () => {
    return (
        <main className='container pt-32 pb-10'>
            <Header />
            <Status />
            <h3 className="font-semibold mb-2 mt-7 text-base">Overview</h3>
            <Overview
                rank={10}
                referrals={16}
                users={100}
                referralCode={"gzrhjtw5"} />
            <div className="my-10">
                <Link
                    href={"/dashboard/referral"}
                    className="referral-container"
                >
                    <div className="bg-[#f5f5f5] dark:bg-[#23262D] p-3 rounded-lg">
                        <HiMiniUserGroup className="text-4xl text-black dark:text-white" />
                    </div>
                    <div>
                        <h3>Invite Friends</h3>
                        <p className="text-base text-[#989898]">
                            The more users you refer , the more $FOUND you earn
                        </p>
                    </div>
                </Link>
            </div>
            <PlannedTask />
            <TwitterProfile />
            <ClaimXP />
        </main>
    )
}

export default Dashboard