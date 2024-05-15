import React from 'react'
import Image from 'next/image'
import Vector from '@/assets/Vector.svg'

type TogglerSystem = {
    toggleru: boolean
}

const Multiplier = (props: TogglerSystem) => {
    return (
        <div className={` max-w-lg mx-auto my-3 ${props.toggleru ? 'block' : 'hidden'} overflow-y-scroll flex items-center gap-2 pb-5 px-5`}>
            {
                multiSample.map((items, idx) => (
                    <div key={idx} className={`h-32 w-28 ${items.achieved ? ' ' : 'opacity-20'} relative object-contain text-[11px] shrink-0 flex items-center justify-center text-white`}>
                        <Image src={Vector} alt="multiplier" fill={true} sizes='100%'  />
                        <div className='relative z-10 text-center font-semibold'>
                            <p>{items.value}</p>
                            <p>XP</p>
                            <span className='text-sm text-[#18EAFF]'>+{items.percent}%</span>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Multiplier

const multiSample = [
    {
        value: 20000,
        percent: 5,
        achieved: true
    },
    {
        value: 60000,
        percent: 10,
        achieved: true
    },
    {
        value: 200000,
        percent: 15,
        achieved: false
    },
    {
        value: 500000,
        percent: 20,
        achieved: false
    },
    {
        value: 1500000,
        percent: 25,
        achieved: false
    },
]