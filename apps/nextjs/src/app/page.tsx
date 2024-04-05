"use client";

import { useQueryWithAuth } from "@convex-dev/convex-lucia-auth/react";

import type { Doc } from "@acme/api/convex/_generated/dataModel";
import { api } from "@acme/api/convex/_generated/api";
import MainLayout from "@acme/ui/src/components/layout/main";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@acme/ui/src/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@acme/ui/src/components/ui/card";
import { Overview } from "@acme/ui/src/components/ui/overview";

export default function Home() {
  const data = useQueryWithAuth(api.adminQueries.dashboardData, {});
  return (
    <MainLayout>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>New users onboarded.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentUsers recentUsers={data ? data.recentUsers : undefined} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

function RecentUsers({
  recentUsers,
}: {
  recentUsers: Doc<"user">[] | undefined;
}) {
  console.log(recentUsers);
  return (
    <div className="space-y-8">
      {(recentUsers ? recentUsers : []).map((user, i) => (
        <div key={i} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>
              {user.nickname?.substring(0, 2).toUpperCase() ?? "OM"}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.nickname ?? "Olivia Martin"}
            </p>
            <p className="text-sm text-muted-foreground">
              {user?.email ?? "olivia.martin@email.com"}
            </p>
          </div>
          <div className="ml-auto font-medium">
            +$EN {user?.minedCount?.toLocaleString("en-US") ?? "1,999.00"}
          </div>
        </div>
      ))}
      {/* <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>JL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jackson Lee</p>
          <p className="text-muted-foreground text-sm">jackson.lee@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$39.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>IN</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
          <p className="text-muted-foreground text-sm">
            isabella.nguyen@email.com
          </p>
        </div>
        <div className="ml-auto font-medium">+$299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>WK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">William Kim</p>
          <p className="text-muted-foreground text-sm">will@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$99.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Sofia Davis</p>
          <p className="text-muted-foreground text-sm">sofia.davis@email.com</p>
        </div>
        <div className="ml-auto font-medium">+$39.00</div>
      </div> */}
    </div>
  );
}
