"use client"

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

const ForgetOtp = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })


  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    if (data.pin.length === 6) {
      router.push('/authentication/resetpassword')
    }
  }

  return (
    <main className='container login-res-screen mx-auto'>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='h-screen flex flex-col gap-5 pt-5 pb-10'>
        <div>
          <legend className='font-semibold text-2xl py-3 mb-3'>Forgot password?</legend>
        </div>
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-lg'>Input code</FormLabel>
              <FormControl>
                <InputOTP className='text-xl' maxLength={6} {...field}>
                  <InputOTPGroup className="flex w-full justify-between">
                    <InputOTPSlot className='input-otp-slot' index={0} />
                    <InputOTPSlot className='input-otp-slot' index={1} />
                    <InputOTPSlot className='input-otp-slot' index={2} />
                    <InputOTPSlot className='input-otp-slot' index={3} />
                    <InputOTPSlot className='input-otp-slot' index={4} />
                    <InputOTPSlot className='input-otp-slot' index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className='btn mt-auto'>Proceed</Button>
      </form>
    </Form>
    </main>
  )
}

export default ForgetOtp