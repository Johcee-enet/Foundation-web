import React from 'react'
import { TbLogout2, TbDeviceWatch } from "react-icons/tb";
import { BsPersonFillExclamation } from "react-icons/bs";
import { HiFolder } from "react-icons/hi2";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GoHomeFill } from "react-icons/go";
import { IoLibrary } from "react-icons/io5";
import { PiWallFill, PiFlowerLotus } from "react-icons/pi";
import { FaRegCircle } from "react-icons/fa6";
import { RiBookFill } from "react-icons/ri";
import Link from 'next/link';
import Image from 'next/image';


const HeaderNavigation = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="header-container-img object-center relative">
                    <Image src='/user.png' fill={true} sizes='100%' alt="user" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="drop-down-content"
            >
                <DropdownMenuGroup>
                    <DropdownMenuItem className='drop-down-item '>
                        <Image src='/foundation.svg' alt="Logo" height={40} width={40} priority className="invert dark:invert-0" />
                        <div className="relative object-contain h-6 w-full"><Image src='/foundation-text.png' alt="Logo" fill={true} sizes='100%' className="dark:invert invert-0" /></div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='drop-down-item' disabled>
                        <Image src='/user.png' height={25} width={25} alt="user" /><span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='drop-down-item'>
                        <Link href='/dashboard'><GoHomeFill />Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='drop-down-item'>
                        <Link href='/dashboard/leaderboard'><PiWallFill />Leaderboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='drop-down-item'>
                        <Link href='/dashboard/history'><HiFolder />History</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='drop-down-item' disabled>
                        <FaRegCircle />Spaces
                    </DropdownMenuItem>
                    <DropdownMenuItem className='drop-down-item' disabled>
                        <PiFlowerLotus />Farming Pro
                    </DropdownMenuItem>
                    <DropdownMenuItem className='drop-down-item' disabled>
                        <BsPersonFillExclamation />KYC
                    </DropdownMenuItem>
                    <div className='flex items-center gap-3 opacity-30'>
                        <DropdownMenuSeparator className='flex-grow bg-[#D9D8D8]' />
                        <p className='text-[#D9D8D8] text-xs'>Web3 Campus</p>
                        <DropdownMenuSeparator className='flex-grow bg-[#D9D8D8]' />
                    </div>
                    <DropdownMenuSub >
                        <DropdownMenuSubTrigger className='drop-down-item opacity-40' disabled><IoLibrary />Courses</DropdownMenuSubTrigger>
                        {/* <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem>Email</DropdownMenuItem>
                            <DropdownMenuItem>Message</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>More...</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal> */}
                    </DropdownMenuSub>
                    <DropdownMenuSub >
                        <DropdownMenuSubTrigger className='drop-down-item opacity-40' disabled><RiBookFill />Books</DropdownMenuSubTrigger>
                        {/* <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem>Email</DropdownMenuItem>
                            <DropdownMenuItem>Message</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>More...</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal> */}
                    </DropdownMenuSub>
                    <DropdownMenuSub >
                        <DropdownMenuSubTrigger className='drop-down-item opacity-40' disabled><TbDeviceWatch />Programs</DropdownMenuSubTrigger>
                        {/* <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem>Email</DropdownMenuItem>
                            <DropdownMenuItem>Message</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>More...</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal> */}
                    </DropdownMenuSub>
                </DropdownMenuGroup>

                <DropdownMenuGroup className='pt-10'>
                    <DropdownMenuItem className='drop-down-item'>
                        <TbLogout2 />Log Out
                    </DropdownMenuItem>
                    <DropdownMenuItem className='drop-down-item mt-auto' disabled>
                        <button className="connect-wallet">
                            Connect Wallet
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default HeaderNavigation;