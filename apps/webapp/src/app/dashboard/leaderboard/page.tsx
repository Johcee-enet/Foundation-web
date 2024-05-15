import ReturnHeader from '@/components/ReturnHeader'
import TrackPositions from '@/components/TrackPositions'
import Image from 'next/image'
import React from 'react'

const Leaderboard = () => {
    return (
        <main className='pt-28 pb-36'>
            <ReturnHeader page='leaderboard' push='/dashboard' />
            <div className="container">
                <div className="leader-banner">
                    <div className="header-container-img">
                        <Image src='/profile.png' height={50} width={50} alt="profile" />
                    </div>
                    <h3 className="font-normal text-lg">
                        You are doing better than 80% of others
                    </h3>
                </div>
            </div>
            <TrackPositions />
        </main>
    )
}

export default Leaderboard