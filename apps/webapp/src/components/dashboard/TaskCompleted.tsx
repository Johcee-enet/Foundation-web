import Image from 'next/image'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"

const TaskCompleted = ({ reward }: any) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className=" block bg-black dark:bg-white font-medium text-xl p-6 rounded-xl dark:text-black text-white">
                    Completed
                </button>
            </DialogTrigger>
            <DialogContent className="completed-banner dark:text-black text-white">
                <div className="flex flex-col items-center justify-center gap-5 ">
                    <Image src='/completed.svg' alt='completed' height={270} width={270} priority />
                    <p className='text-black dark:text-white text-xl'>You Earned</p>
                    <h2 className='text-[#15BDCF] font-bold text-4xl'>+{reward} XP</h2>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" className='bg-[#15BDCF] text-xl py-5 h-fit text-white max-w-md w-full mx-auto'>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TaskCompleted

