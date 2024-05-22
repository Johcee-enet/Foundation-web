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
import { PiProjectorScreenChartLight } from "react-icons/pi";

const TaskCompleted = ({
  showCompletedDialog,
  setShowCompletedDialog,
  setDrawerOpen,
  reward,
}: any) => {
  return (
    <Dialog open={showCompletedDialog}>
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
              onClick={() => {
                setShowCompletedDialog(false);
                setDrawerOpen(false);
              }}
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
