"use client";

import React from "react";
import {
  useMutationWithAuth,
  useQueryWithAuth,
  useSessionId,
  useSignOut,
  useSignUpSignIn,
} from "@convex-dev/convex-lucia-auth/react";

import { api } from "@acme/api/src/convex/_generated/api";

// import { Paragraph } from "@/components/layout/paragraph";
import { ResponsiveSidebarButton } from "../../components/layout/responsive-sidebar-button";
// import { FakeParagraphs } from "../../components/helpers/FakeParagraphs";
// import { FakeWordList } from "../../components/helpers/FakeWordList";
import { StickyFooter } from "../../components/layout/sticky-footer";
import { StickyHeader } from "../../components/layout/sticky-header";
import { StickySidebar } from "../../components/layout/sticky-sidebar";
import { Link } from "../../components/typography/link";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ScrollArea } from "../../components/ui/scroll-area";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionId = useSessionId();

  return (
    <main className="flex flex-col gap-8">
      {/* <h1 className="my-8 text-center text-4xl font-extrabold">
        Enet Admin Dashboard
      </h1> */}
      {sessionId ? <SignedIn>{children}</SignedIn> : <AuthForm />}
    </main>
  );
}

function SignedIn({ children }: { children: React.ReactNode }) {
  const data = useQueryWithAuth(api.adminQueries.dashboardData, {});
  const menus: string[] = ["Users", "Tasks", "Events", "Ad Space", "Config"];
  const sidebar = (
    <nav className={"grid items-center space-y-4 lg:space-y-6"}>
      {menus.map((menu, i) => (
        <Link
          key={i}
          href={`/${menu.toLowerCase().split(" ").join("-")}`}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {menu}
        </Link>
      ))}
    </nav>
  );
  return (
    <>
      <StickyHeader className="container flex h-[3.25rem] grid-cols-[240px_minmax(0,1fr)] items-center justify-between p-2 sm:grid">
        <div className="px-6">
          <Link
            href={`/`}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
        </div>
        <div className="container">
          <SignOutButton />
        </div>

        <ResponsiveSidebarButton className="sm:hidden">
          <div className="fixed top-[calc(3.25rem+1px)] h-[calc(100vh-(3.25rem+1px))] w-screen bg-background sm:hidden">
            <ScrollArea className="h-full">{sidebar}</ScrollArea>
          </div>
        </ResponsiveSidebarButton>
      </StickyHeader>
      <div className="container grid-cols-[240px_minmax(0,1fr)] sm:grid">
        <StickySidebar className="top-[calc(3.25rem+1px)] hidden h-[calc(100vh-(3.25rem+1px))] sm:block">
          {sidebar}
        </StickySidebar>
        <main className="min-h-[calc(100vh-(3.25rem+1px))]">
          {/* <Paragraph>Main content</Paragraph> */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Mined
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $EN{" "}
                  {data ? data.totalMined.toLocaleString("en-US") : "45,231.89"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total $EN token mined
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{data ? data.totalReferrals.toLocaleString("en-US") : "2350"}
                </div>
                <p className="text-xs text-muted-foreground">
                  All time referrals
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">XP Earned</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{data ? data.totalXp.toLocaleString("en-US") : "12,234"}
                </div>
                <p className="text-xs text-muted-foreground">Total XP earned</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{data ? data.totalUsers.toLocaleString("en-US") : "573"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total users onboarded
                </p>
              </CardContent>
            </Card>
          </div>
          {children}
        </main>
      </div>
      <StickyFooter>Enet admin</StickyFooter>
    </>
  );
}

function SignOutButton() {
  const signOut = useSignOut();
  return <Button onClick={signOut}>Sign out</Button>;
}

function AuthForm() {
  const { flow, toggleFlow, error, onSubmit } = useSignUpSignIn({
    signIn: useMutationWithAuth(api.auth.signIn),
    signUp: useMutationWithAuth(api.auth.signUp),
  });
  console.log(error);

  return (
    <div className="flex h-screen min-h-screen flex-col items-center gap-6 px-20 pt-40">
      <h1 className="text-center text-2xl font-medium">
        Login to Enet admin
        <br /> dashboard
      </h1>
      <form
        className="flex w-[18rem] flex-col"
        onSubmit={(event) => {
          void onSubmit(event);
        }}
      >
        <Label htmlFor="email">Email</Label>
        <Input name="email" type="email" id="email" className="mb-4" />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          className="mb-4 "
        />
        <Button type="submit">
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </Button>
      </form>
      <Button variant="link" onClick={toggleFlow}>
        {flow === "signIn"
          ? "Don't have an account? Sign up"
          : "Already have an account? Sign in"}
      </Button>
      <div className="text-sm font-medium text-red-500">
        {error !== undefined
          ? flow === "signIn"
            ? "Could not sign in, did you mean to sign up?"
            : "Could not sign up, did you mean to sign in?"
          : null}
      </div>
    </div>
  );
}
