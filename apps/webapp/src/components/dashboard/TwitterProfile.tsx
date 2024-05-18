"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { FaXTwitter } from "react-icons/fa6";
import { z } from "zod";

import { api } from "@acme/api/convex/_generated/api";

import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

const FormSchema = z.object({
  referral: z.string(),
});

const TwitterProfile = () => {
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);
  const [auth, setAuth] = useState(false);

  // Redeem referral
  const redeemReferral = useMutation(api.mutations.redeemReferralCode);

  useEffect(() => {
    // if the person is logining in for the first time setConnected should be false to trigger the twitter authentication and referral dialog else setConneted to true
    setTimeout(() => {
      if (connected == false) {
        setAuth(true);
      }
    }, 1000);
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      referral: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Actions to perform with the data gotten from referral code input
    console.log(data);

    if (data?.referral) {
    } else {
      toast({
        title: "No referral code provided",
      });
    }
  }

  return (
    <div className={`twitter-auth ${auth ? "flex" : "hidden"}`}>
      <div className="twitter-container">
        <div className="flex items-center justify-center">
          {connected ? (
            <Image height={60} width={60} src="/user.png" alt="Twitter-image" />
          ) : (
            <div className="rounded-lg bg-black p-3">
              <FaXTwitter className="text-4xl text-white" />
            </div>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="twitter-btn"
              onClick={(e) => {
                if (connected == false) {
                  e.preventDefault();
                  // Authenticate twitter account then setConnected to true
                  setConnected(true);
                } else {
                  setAuth(false);
                }
              }}
            >
              {connected ? "Continue" : "Connect X"}
            </Button>
          </DialogTrigger>
          <DialogContent className="background dark:border-background-dark z-[999] mx-auto max-w-md rounded-xl border-background text-black dark:text-white">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" space-y-3"
              >
                <FormField
                  control={form.control}
                  name="referral"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-black dark:text-white">
                        Referral
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="auth_input text-black dark:text-white"
                          placeholder="gzrhjtw5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="btn">
                  Submit
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TwitterProfile;
