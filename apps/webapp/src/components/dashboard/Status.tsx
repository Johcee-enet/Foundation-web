import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MiningStats from "./MiningStats";
import SocialStats from "./SocialStats";

const Status = () => {
    return (
        <>
            <Tabs defaultValue="mining" className="drop-shadow-sm">
                <TabsList className="grid w-full grid-cols-2 p-0">
                    <TabsTrigger
                        value="mining"
                        className="tabs-trigger"
                    >
                        Mining
                    </TabsTrigger>
                    <TabsTrigger
                        value="social"
                        className="tabs-trigger"
                    >
                        Social Xps
                    </TabsTrigger>
                </TabsList>
                <TabsContent
                    value="mining"
                    className="tab-content"
                >
                    {/* props for mining stats info */}
                    <MiningStats mined={49500.71}
                        mining={6}
                        time={"19hrs  23m  12s"}
                        rate={0.25}
                    />
                </TabsContent>
                <TabsContent
                    value="social"
                    className="tab-content"
                >
                       {/* props for social stats info */}
                    <SocialStats
                        earned={35545700}
                        claimed={35500000}
                        referral={500000}
              
                        multiplier={10}
                    />
                </TabsContent>
            </Tabs>
        </>
    )
}

export default Status