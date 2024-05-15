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

const OtpAuth = () => {
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
            router.push('/authentication/password')
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="login-res-screen mx-auto flex-grow w-full">
                <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Input code</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
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

                <Button type="submit" className='btn mt-auto'>Continue</Button>
                <Button className='text-black dark:text-white text-base font-semibold'>Resend OTP</Button>
            </form>
        </Form>
    )
}

export default OtpAuth