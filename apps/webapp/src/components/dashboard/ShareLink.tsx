"use client";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BiRedo } from "react-icons/bi"
import { IoCopyOutline } from "react-icons/io5"
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ShareLink = () => {
    const { toast } = useToast();
    const referral = 'https://ui.shadcn.com/docs/installation'
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="px-6 h-fit py-4 rounded-lg bg-black dark:bg-primary-dark flex text-lg items-center gap-2 text-white"><BiRedo />
                    <span>Share link</span></Button>
            </DialogTrigger>
            <DialogContent className="max-w-md py-10 ring-0 border-0 rounded-xl background">

                <DialogHeader>
                    <DialogTitle className="text-lg">Share link</DialogTitle>
                    <DialogDescription className="text-base">
                        Anyone who has this link will be able to view this.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            className="foreground border-0"
                            id="link"
                            defaultValue={referral}
                            readOnly
                        />
                    </div>
                    <CopyToClipboard text={referral}   onCopy={() => {
                        toast({
                            title: referral,
                            description: "You have successfully copied your referral link",
                        });
                    }}>
                        <Button type="submit" size="sm" className="px-3 bg-black dark:bg-white text-white dark:text-black">
                            <span className="sr-only">Copy</span>
                            <IoCopyOutline />
                        </Button>
                    </CopyToClipboard>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default ShareLink