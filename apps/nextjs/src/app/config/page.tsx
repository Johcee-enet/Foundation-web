"use client";

import { useState } from "react";

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

// TODO: handle updates for the default settings of the mobile app
// TODO: 1 --> Handle default mine rate, mine hours, xp count,
// TODO: 2 --> Render each seciton in card component with input
// TODO: 3 --> Update the convex db with the user's new configurations

function ConfigPage() {
  const [miningRate, setMiningRate] = useState<number>(2);
  const [miningHours, setMiningHours] = useState<number>(6);
  const [xpCount, setXpCount] = useState<number>(1000);

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
            <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter>
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
            <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter>
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
            <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

export default ConfigPage;
