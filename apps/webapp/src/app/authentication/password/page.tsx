"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { z } from "zod";

import { api } from "@acme/api/convex/_generated/api";
import { Id } from "@acme/api/convex/_generated/dataModel";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "The password must be at least 8 characters long" })
      .max(32, "The password must be a maximun 32 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
        "Password not strong enough",
      ),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

const Password = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [preview, setPreview] = useState<Boolean>(false);

  // Prep storePassword
  const storePassword = useAction(api.onboarding.storePassword);

  // Get query params
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      if (
        !values?.password ||
        !values?.confirm ||
        !values?.password.length ||
        !values?.confirm?.length
      ) {
        return toast({
          title: "All values must be filled",
        });
      }

      if (values?.password !== values?.confirm) {
        return toast({
          title: "Password and Confirm password fields do not match",
        });
      }
      console.log(values, ":::Password values");

      await storePassword({
        userId: userId as Id<"user">,
        password: values?.password,
      });

      router.push(`/authentication/welcome?userId=${userId}`);
    } catch (err: any) {
      console.log(err, ":::error_password");
      toast({
        title: "Error saving password",
        description: err.message ?? err.toString(),
        variant: "destructive",
      });
    }
  }

  return (
    <main className="login-res-screen container">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-screen flex-col gap-5 pb-10 pt-5"
        >
          <legend className="mb-2 py-3 font-semibold">Create password</legend>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      className="auth_input"
                      placeholder="Password"
                      type={preview ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <span
                    className="preview-input"
                    onClick={() => setPreview(!preview)}
                  >
                    {preview ? <FaRegEyeSlash /> : <FaRegEye />}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      className="auth_input"
                      placeholder="Confirm Password"
                      type={preview ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <span
                    className="preview-input"
                    onClick={() => setPreview(!preview)}
                  >
                    {preview ? <FaRegEyeSlash /> : <FaRegEye />}
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h5 className="mb-1 text-lg font-semibold">
              Password must include:
            </h5>
            <ul className="ml-3 list-disc space-y-1 text-base text-[#989898]">
              <li>Uppercase characters</li>
              <li>Lowercase characters</li>
              <li>Integers</li>
              <li>Special characters (eg. #?!@$%^&*-)</li>
            </ul>
          </div>
          <Button className="btn mt-auto" type="submit">
            Sign Up
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default Password;
