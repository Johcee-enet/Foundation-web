import ReturnHeader from '@/components/ReturnHeader'
import OtpAuth from '@/components/onboarding/OtpAuth'
import Image from 'next/image'
import React from 'react'

const OTPValidation = () => {
    return (
        <main className='container flex flex-col'>
            <ReturnHeader page='' push='/' />
            <div className='text-center pt-28 mb-14 space-y-4'>
                <div className="mx-auto w-fit p-3 rounded-xl bg-primary dark:bg-primary-dark">
                    <Image src={'/otp.svg'} height={65} width={65} alt='OTP Sent' className="invert dark:invert-0" />
                </div>
                <h1 className='text-2xl'>We’ve sent a 6-digit OTP to
                    <br />
                    johndoe@gmail.com</h1>
            </div>
            <OtpAuth />
        </main>
    )
}

export default OTPValidation