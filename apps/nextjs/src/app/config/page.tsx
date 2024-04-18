"use client";

import { useEffect, useState } from "react";
import {
  useMutationWithAuth,
  useQueryWithAuth,
} from "@convex-dev/convex-lucia-auth/react";

import { api } from "@acme/api/convex/_generated/api";
import { Doc } from "@acme/api/convex/_generated/dataModel";
import MainLayout from "@acme/ui/src/components/layout/main";
import { Button } from "@acme/ui/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/src/components/ui/card";
import { Input } from "@acme/ui/src/components/ui/input";
import { useToast } from "@acme/ui/src/components/ui/use-toast";

// TODO: handle updates for the default settings of the mobile app
// TODO: 1 --> Handle default mine rate, mine hours, xp count,
// TODO: 2 --> Render each seciton in card component with input
// TODO: 3 --> Update the convex db with the user's new configurations

function ConfigPage() {
  const [miningRate, setMiningRate] = useState<number>(2);
  const [miningHours, setMiningHours] = useState<number>(6);
  const [xpCount, setXpCount] = useState<number>(1000);
  const [referralXpCount, setReferralXpCount] = useState<number>(5000);

  const { toast } = useToast();

  const appConfig: Doc<"config"> | undefined = useQueryWithAuth(
    api.queries.getAppConfig,
    {},
  );

  const updateConfigs = useMutationWithAuth(api.mutations.updateConfig);

  useEffect(() => {
    if (appConfig) {
      setMiningRate(appConfig?.miningCount);
      setMiningHours(appConfig.miningHours);
      setXpCount(appConfig.xpCount);
    }
  }, [appConfig]);

  return (
    <MainLayout>
      <div className="mt-5 flex w-full flex-col gap-8">
        <div className="h-full w-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                App Configuration
              </h2>
              <p className="text-muted-foreground">
                Configure the Enet miner mobile applications defaults(mine rate,
                xp count, referral points, e.t.c)
              </p>
            </div>
            <Button
              onClick={async () => {
                const t = toast({
                  title: "Updating config data",
                });
                await updateConfigs({
                  data: {
                    miningCount: miningRate,
                    miningHours,
                    xpCount,
                    referralXpCount,
                  },
                  configId: appConfig?._id,
                });

                t.update({ title: "Update completed!" });
              }}
            >
              Update all
            </Button>
          </div>

          {/* List of configuration cards */}
          <Card>
            <CardHeader>
              <CardTitle>Mining rate</CardTitle>
              <CardDescription>
                Change the default mining rate of users (i.e $EN/hour)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <Input
                  placeholder="Mining rate"
                  type="number"
                  value={miningRate}
                  onChange={(e) => setMiningRate(e.target.valueAsNumber)}
                />
              </form>
            </CardContent>
            {/* <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter> */}
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mining hours</CardTitle>
              <CardDescription>
                Change the default mining hours per mining session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <Input
                  placeholder="Mining hours"
                  type="number"
                  value={miningHours}
                  onChange={(e) => setMiningHours(e.target.valueAsNumber)}
                />
              </form>
            </CardContent>
            {/* <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter> */}
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>XP Count</CardTitle>
              <CardDescription>
                Change default XP Count after onboarding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <Input
                  placeholder="XP Count"
                  type="number"
                  value={xpCount}
                  onChange={(e) => setXpCount(e.target.valueAsNumber)}
                />
              </form>
            </CardContent>
            {/* <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter> */}
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Referral XP Count</CardTitle>
              <CardDescription>
                Change referral XP Count when users referre each other
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <Input
                  placeholder="XP Count"
                  type="number"
                  value={referralXpCount}
                  onChange={(e) => setReferralXpCount(e.target.valueAsNumber)}
                />
              </form>
            </CardContent>
            {/* <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter> */}
          </Card>
        </div>

        {/* Boost */}
        <div className="h-full w-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Boost Configuration
              </h2>
              <p className="text-muted-foreground">
                Configure the Enet miner mobile applications boost features
              </p>
            </div>
          </div>

          {appConfig?.boosts?.map((boost) => (
            <Card key={boost?.uuid}>
              <CardHeader>
                <CardTitle>{boost?.title}</CardTitle>
                {/* <CardDescription>
                  Change the default mining rate of users (i.e $EN/hour)
                </CardDescription> */}
              </CardHeader>
              <CardContent>
                <form>
                  <Input
                    placeholder="Input rate"
                    type="number"
                    value={boost.rate}
                    onChange={(e) => setMiningRate(e.target.valueAsNumber)}
                  />
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  onClick={async () => {
                    const t = toast({
                      title: "Updating config data",
                    });
                    await updateConfigs({
                      data: {
                        miningCount: miningRate,
                        miningHours,
                        xpCount,
                        referralXpCount,
                        boosts: [
                          {
                            rate: 0,
                            title: "Auto Mining Bot",
                            type: "bot",
                            uuid: "125CC0F9-799A-4EE7-A51E-27DC4FEFFE81",
                            xpCost: 1000000,
                          },
                          {
                            rate: 0,
                            title: "Mining Rate",
                            totalLevel: 10,
                            type: "speed",
                            uuid: "5FCA08D2-66CD-49DB-B59C-939994E36527",
                            xpCost: 10000,
                          },
                          {
                            rate: 0,
                            title: "Mining Duration",
                            totalLevel: 6,
                            type: "speed",
                            uuid: "A508F15F-86ED-4E18-9FF1-38D714202395",
                            xpCost: 15000,
                          },
                        ],
                      },
                      configId: appConfig?._id,
                    });

                    t.update({ title: "Update completed!" });
                  }}
                >
                  Update
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default ConfigPage;
