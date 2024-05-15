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
    password: z
        .string()
        .min(8, { message: 'The password must be at least 8 characters long' })
        .max(32, 'The password must be a maximun 32 characters')
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/, 'Password not strong enough'),
    confirm: z
        .string(),
})
    .refine((data) => data.password === data.confirm, {
        message: "Passwords don't match",
        path: ["confirm"],
    })


const Password = () => {
    const router = useRouter()
    const [preview, setPreview] = useState<Boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirm: "",
        },
    })

    // Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        router.push('/authentication/welcome')
    }


    return (
        <main className='container login-res-screen'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className='h-screen flex flex-col gap-5 pt-5 pb-10'>
                    <legend className='font-semibold py-3 mb-2'>Create password</legend>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input className='auth_input' placeholder='Password' type={preview ? 'text' : 'password'}
                                            {...field} />
                                    </FormControl>
                                    <span className='preview-input' onClick={() => setPreview(!preview)}>{preview ? <FaRegEyeSlash /> : <FaRegEye />}</span>
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
                                <div className='relative'>
                                    <FormControl>
                                        <Input className='auth_input' placeholder="Confirm Password" type={preview ? 'text' : 'password'} {...field} />
                                    </FormControl>
                                    <span className='preview-input' onClick={() => setPreview
                                        (!preview)}>{preview ? <FaRegEyeSlash /> : <FaRegEye />}</span>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <h5 className="text-lg font-semibold mb-1">
                            Password must include:
                        </h5>
                        <ul className="list-disc text-base text-[#989898] ml-3 space-y-1">
                            <li>Uppercase characters</li>
                            <li>Lowercase characters</li>
                            <li>Integers</li>
                            <li>Special characters (eg. #?!@$%^&*-)</li>
                        </ul>
                    </div>
                    <Button className='btn mt-auto' type="submit">Sign Up</Button>
                </form>
            </Form>
        </main>
    )
}

export default Password