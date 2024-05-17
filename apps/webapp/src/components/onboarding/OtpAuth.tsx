"use client";

import React from "react";
import { LoadableOptions } from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@acme/api/convex/_generated/api";
import { Id } from "@acme/api/convex/_generated/dataModel";

import { useToast } from "../ui/use-toast";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const OtpAuth = ({
  userId,
  email,
}: {
  userId: string | null;
  email: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const verifyOTP = useAction(api.onboarding.verifyUserOTP);
  const resendOTP = useAction(api.onboarding.resendOTPCode);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    if (data.pin.length === 6) {
      console.log(data?.pin, ":::OTP_pin");
      const isValid = await verifyOTP({
        userId: userId as Id<"user">,
        otp: data?.pin,
      });
      if (isValid) {
        router.push(`/authentication/password?userId=${userId}`);
      } else {
        toast({
          title: "OTP Code is not valid",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="login-res-screen mx-auto w-full flex-grow"
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Input code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup className="flex w-full justify-between">
                    <InputOTPSlot className="input-otp-slot" index={0} />
                    <InputOTPSlot className="input-otp-slot" index={1} />
                    <InputOTPSlot className="input-otp-slot" index={2} />
                    <InputOTPSlot className="input-otp-slot" index={3} />
                    <InputOTPSlot className="input-otp-slot" index={4} />
                    <InputOTPSlot className="input-otp-slot" index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="btn mt-auto">
          Continue
        </Button>
        <Button
          className="text-base font-semibold text-black dark:text-white"
          onClick={async () => {
            await resendOTP({
              email: email as string,
              userId: userId as Id<"user">,
            });
            toast({
              title: "OTP Resent to your email address",
            });
          }}
        >
          Resend OTP
        </Button>
      </form>
    </Form>
  );
};

export default OtpAuth;
