'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import BotHead from '@/assets/bot-head.svg'
import { Button } from '@/components/ui/button'


const ClaimXP = () => {
    const [xp, setXp] = useState(false)
    return (
        <div className={`fixed inset-0 p-5 z-50  items-center justify-center bg-black/25 ${!xp ? 'hidden' : 'flex'}`}>
            <div className='background max-w-md w-full p-4 rounded-2xl space-y-4'>
                <div className="flex item-center justify-between">
                    <div className='flex items-center gap-4'>
                        <div className='icon-container'>
                            <Image src={BotHead} height={40} width={40} alt="bot" />
                        </div>
                        <p className='text-lg font-semibold'>+12 $FOUND/6hour</p>
                    </div>
                    <Button className='btn px-8 py-2' onClick={() => setXp(true)}>Claim</Button>
                </div>
                <p className='text-[#6A6A6A] font-medium'>Boost your Auto Mining Bot to increase your mining time</p>
            </div>
        </div>
    )
}

export default ClaimXP