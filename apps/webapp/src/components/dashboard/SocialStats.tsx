import React from 'react'

type SocialInfo = {
    earned: number
    claimed: number
    referral: number
    multiplier: number
}

const SocialStats = (props: SocialInfo) => {
    return (
        <div className="text-center font-bold text-[#989898] relative z-10 flex flex-col justify-between h-full pb-3">
            <h3 className="text-center text-[#989898] text-lg">
                Total Social XP Earned:{" "}
                <span className="dark:text-white text-black">{props.earned}</span>
            </h3>
            <p className="text-lg font-bold">
                Claimed Xp:{" "}
                <span className="dark:text-white text-black">{props.claimed}</span>
            </p>
            <p className="text-lg font-bold">
                Referral Xp:{" "}
                <span className="dark:text-white text-black">{props.referral}</span>
            </p>
            <p className="text-lg font-bold">
                Multiplier:{" "}
                <span className="dark:text-white text-black">{props.multiplier}% </span>
            </p>
        </div>
    )
}

export default SocialStats