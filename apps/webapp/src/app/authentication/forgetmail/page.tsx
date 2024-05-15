"use client"

import React, { useState } from 'react'
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
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'


const formSchema = z.object({
    email: z.string()
        .min(1, { message: "Fill in your email address" })
        .email("Enter a valid email.")
})






const Forgetmail = () => {

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    // Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        router.push('/authentication/forgetotp')
    }

    return (
        <main className='container login-res-screen'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className='h-screen flex flex-col gap-5 pt-5 pb-10'>
                    <div>
                        <legend className='font-semibold text-2xl py-3'>Forgot password?</legend>
                        <p className='opacity-70 font-medium'>An OTP will be sent to your E-mail address</p>
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-lg'>Input Email Address</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input className='auth_input' placeholder='Email' type='email'
                                            {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button className='btn mt-auto' type="submit">Proceed</Button>
                </form>
            </Form>
        </main>
    )
}

export default Forgetmail