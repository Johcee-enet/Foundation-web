"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { BsInfoCircle } from "react-icons/bs"

const formSchema = z.object({
    username: z.string().min(5, {
        message: "Username must be at least 5 characters.",
    }).regex(/^(?=.*?[a-z]).{5,}$/, 'Username must contain alphabelts'),
})

const Username = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    //  Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        router.push('/dashboard')
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow mt-auto max-h-[700px] md:max-h-[500px] rounded-3xl bg-black py-7 px-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className='auth_input' placeholder="jochee" {...field} />
                            </FormControl>
                            <FormMessage />
                            <FormDescription className="flex gap-2 text-white font-medium">
                                <BsInfoCircle className="shrink-0 mt-1 text-xs text-[#15BDCF]" />
                                <p>
                                    When creating a nickname, use only © letters, numbers, and periods. <br />
                                    <span className="text-[#15BDCF]">Example: your.name01</span>
                                </p>
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="btn-username mt-auto bg-white">Continue</Button>
            </form>
        </Form>
    )
}

export default Username