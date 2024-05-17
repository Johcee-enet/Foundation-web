"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { BsInfoCircle } from "react-icons/bs";
import { z } from "zod";

import { api } from "@acme/api/convex/_generated/api";
import { Id } from "@acme/api/convex/_generated/dataModel";

import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  username: z
    .string()
    .min(5, {
      message: "Username must be at least 5 characters.",
    })
    .regex(/^(?=.*?[a-z]).{5,}$/, "Username must contain alphabelts"),
});

const Username = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });
  const userId = searchParams.get("userId");

  // Call save nickname api
  const saveNickname = useMutation(api.onboarding.storeNickname);
  const isNicknameValid = useMutation(api.onboarding.isNicknameValid);

  //  Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      console.log(values, ":::Username value");
      const isValid = await isNicknameValid({ nickname: values?.username });

      if (!isValid) {
        return toast({
          title:
            "Nickname is not valid, or already exists. Please choose another one",
        });
      }
      const result = await saveNickname({
        userId: userId as Id<"user">,
        nickname: values?.username,
      });
      router.push(`/dashboard?userId=${userId}`);
    } catch (err: any) {
      console.log(err, ":::error_username");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-auto max-h-[700px] flex-grow rounded-3xl bg-black px-4 py-7 md:max-h-[500px]"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input className="auth_input" placeholder="jochee" {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription className="flex gap-2 font-medium text-white">
                <BsInfoCircle className="mt-1 shrink-0 text-xs text-[#15BDCF]" />
                <p>
                  When creating a nickname, use only © letters, numbers, and
                  periods. <br />
                  <span className="text-[#15BDCF]">Example: your.name01</span>
                </p>
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" className="btn-username mt-auto bg-white">
          Continue
        </Button>
      </form>
    </Form>
  );
};

export default Username;
