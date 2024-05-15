import React from 'react'
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import Username from './onboarding/Username';


type WelcomeSystem = {
    heading: string
    description: string
    icon: any
    idx: any
    index: number
    next: any
}


const WelcomeScreens = (props: WelcomeSystem) => {
    const handleNext = () => {
        props.next.current.swiper.slideNext();
    };

    return (
        <div className={`welcome-screen ${props.index <= 2 && 'gap-20 md:gap-10'}`}>
            <div>
                <h2>{props.heading}</h2>
                <p className={`font-medium text-[#414141] dark:text-white/70 ${props.index <= 2 && "mt-3"}`}>
                    {props.description}
                </p>
            </div>
            {props.icon ? (
                <div className='carousel-container'>
                    <div className="carousel-container-shell">
                        <div
                            className={`carousel-container-img ${props.index == 0 && "h-[340px]"
                                } ${props.index == 1 && "h-[300px]"} ${props.index == 2 && "h-[280px]"}`}
                        >
                            <Image src={props.icon} sizes="100%" fill={true} alt="icon" />
                        </div>
                        <div className="flex relative justify-end">
                            <div className="flex w-full gap-2 items-center justify-center absolute h-full z-0">

                                <span
                                    className={`carousel-container-pagination ${props.index == 0 ? "bg-white" : "bg-[#767676]"
                                        }`}
                                ></span>
                                <span
                                    className={`carousel-container-pagination ${props.index == 1 ? "bg-white" : "bg-[#767676]"
                                        }`}
                                ></span>
                                <span
                                    className={`carousel-container-pagination ${props.index == 2 ? "bg-white" : "bg-[#767676]"
                                        }`}
                                ></span>
                            </div>
                            <div className="relative z-10">
                                <button
                                    className="text-xl p-5 rounded-xl bg-white text-black dark:text-black"
                                    onClick={() => handleNext()}
                                >
                                    <FaArrowRightLong />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Username />
            )}
        </div>
    )
}

export default WelcomeScreens