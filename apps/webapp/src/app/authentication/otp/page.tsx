"use client";

import React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import OtpAuth from "@/components/onboarding/OtpAuth";
import ReturnHeader from "@/components/ReturnHeader";

const OTPValidation = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");

  return (
    <main className="container flex flex-col">
      <ReturnHeader page="" push="/" />
      <div className="mb-14 space-y-4 pt-28 text-center">
        <div className="dark:bg-primary-dark mx-auto w-fit rounded-xl bg-primary p-3">
          <Image
            src={"/otp.svg"}
            height={65}
            width={65}
            alt="OTP Sent"
            className="invert dark:invert-0"
          />
        </div>
        <h1 className="text-2xl">
          We’ve sent a 6-digit OTP to
          <br />
          {email ?? "johndoe@gmail.com"}
        </h1>
      </div>
      <OtpAuth userId={userId} email={email} />
    </main>
  );
};

export default OTPValidation;
