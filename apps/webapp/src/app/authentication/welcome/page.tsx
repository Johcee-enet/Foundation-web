"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import Welcome from "@/assets/welcome.svg";
import Kickstarting from "@/assets/kickstarting.svg";
import Mining from "@/assets/mining.svg";
import WelcomeScreens from "@/components/WelcomeScreens";

const WelcomeScreen = () => {
    const sliderRef = useRef(null);
    return (
        <main className="container login-res-screen">
            <Swiper
                ref={sliderRef}
                effect={"fade"}
                pagination={{
                    type: "bullets",
                }}
                modules={[EffectFade, Pagination, Navigation]}
                className="h-full"
            >
                {welcomePage.map((items, i) => (
                    <SwiperSlide key={i}>
                        <WelcomeScreens
                            heading={items.title}
                            description={items.description}
                            icon={items.icon}
                            idx={welcomePage}
                            index={i}
                            next={sliderRef}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </main>
    )
}

export default WelcomeScreen;

const welcomePage = [
    {
        title: "Welcome to  Enetecosystem",
        description:
            "A decentralised blockchain ecosystem, building innovative solutions to embrace the rapidly advancing digital landscape",
        icon: Welcome,
    },
    {
        title: "Kickstarting our MVP program",
        description:
            ' Most Valuable Person of the Month/Year" is an exciting program within our ecosystem designed to recognize and reward community members or individual  who actively contribute to the growth and success of the MVP program',
        icon: Kickstarting,
    },
    {
        title: "Mining and Xp",
        description:
            "There are 2 ways you can earn $EN before launching.Through Mining on this App and earning Xp by performing ecosystem tasks",
        icon: Mining,
    },
    {
        title: "Claim a nickname",
        description: "your friends can use this name to join",
        icon: false,
    },
];
