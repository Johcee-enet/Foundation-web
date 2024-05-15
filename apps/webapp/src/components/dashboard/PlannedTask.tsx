'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BiCoinStack } from "react-icons/bi";
import { RiArrowRightDoubleLine } from "react-icons/ri";
import { TiFlash } from "react-icons/ti";
import Events from '@/components/dashboard/task/Events';
import Boost from '@/components/dashboard/task/Boost';
import { Button } from '@/components/ui/button';
import Multiplier from '@/components/dashboard/Multiplier';
import { FaChevronUp } from "react-icons/fa6";
import Tasks from "./task/Tasks";
import { useState } from "react";

const PlannedTask = () => {
    const [multiplier, setMultiplier] = useState(false)
    return (
        <Tabs defaultValue="socialXps" className="drop-shadow-sm">
            <div className="tasktab-container">
                <TabsList className="tasktab-container-tabcontroller">
                    <TabsTrigger
                        value="socialXps"
                        className="tasktab-container-tabcontroller-tab data-[state=active]:bg-[#131721] data-[state=active]:text-white data-[state=active]:dark:text-white"
                    >
                        <BiCoinStack className="shrink-0 text-lg" />
                        Tasks
                    </TabsTrigger>
                    <TabsTrigger
                        value="events"
                        className="tasktab-container-tabcontroller-tab data-[state=active]:bg-[#131721] data-[state=active]:text-white data-[state=active]:dark:text-white"
                    >
                        <RiArrowRightDoubleLine className="shrink-0 text-lg" />
                        Events
                    </TabsTrigger>
                    <TabsTrigger
                        value="boost"
                        className="tasktab-container-tabcontroller-tab data-[state=active]:bg-[#131721] data-[state=active]:text-white data-[state=active]:dark:text-white"
                    >
                        <TiFlash className="shrink-0 text-lg" />
                        Boosts
                    </TabsTrigger>
                </TabsList>
                <Button className='w-fit mx-auto flex items-center gap-2 text-lg py-3 h-fit' onClick={() => setMultiplier(!multiplier)}>Multiplier <FaChevronUp className={`transition-all ${multiplier && 'rotate-180'} ease-linear duration-300`}/></Button>
            </div>
            <Multiplier toggleru={multiplier}/>
            <TabsContent
                value="socialXps"
                className="tasktab-container-content"
            >
                <Tasks />
            </TabsContent>
            <TabsContent
                value="events"
                className="tasktab-container-content"
            >
                <Events />
            </TabsContent>
            <TabsContent
                value="boost"
                className="tasktab-container-content"
            >
                <Boost />
            </TabsContent>
        </Tabs>
    )
}

export default PlannedTask