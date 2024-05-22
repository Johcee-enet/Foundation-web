import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const TaskCompleted = ({ showCompletedDialog, reward, onClick }: any) => {
  return (
    <Dialog open={showCompletedDialog}>
      <DialogTrigger asChild>
        <button
          className="block rounded-xl bg-black p-6 text-xl font-medium text-white dark:bg-white dark:text-black"
          onClick={onClick}
        >
          Completed
        </button>
      </DialogTrigger>
      <DialogContent className="completed-banner text-white dark:text-black">
        <div className="flex flex-col items-center justify-center gap-5 ">
          <Image
            src="/completed.svg"
            alt="completed"
            height={270}
            width={270}
            priority
          />
          <p className="text-xl text-black dark:text-white">You Earned</p>
          <h2 className="text-4xl font-bold text-[#15BDCF]">+{reward} XP</h2>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              className="mx-auto h-fit w-full max-w-md bg-[#15BDCF] py-5 text-xl text-white"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCompleted;
