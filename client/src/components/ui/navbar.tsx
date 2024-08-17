import React, { useEffect } from 'react'
import { Button } from './button'
import { Plus } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading } = useAuth0();

    useEffect(()=>{
        if(!isAuthenticated){
            navigate("/login");
        }
    },[isAuthenticated])

    return (

        <div className='flex items-center border-b-[1px] gap-16  dark:bg-[#0f172a] border-slate-400'>
            <div className='p-4 flex items-center gap-2'>
                <img src="./logo.svg" alt="" className='w-12 h-12' />
                <h1 className='text-5xl font-bold tracking-tight'>EaseTasks</h1>
            </div>
            <div className='flex flex-grow items-center justify-between px-8'>
                <h3>BOARD NAME</h3>
                <Button className='text-md rounded-3xl'> <Plus className='w-6 h-6' /> Add New Task</Button>
            </div>
            <div className='pr-8'>
                {
                    isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <img src={user && user.picture} className="w-10 h-10 rounded-full" alt={user && user.name} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Billing</DropdownMenuItem>
                                <DropdownMenuItem>Team</DropdownMenuItem>
                                <DropdownMenuItem>Subscription</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : ""
                }
            </div>
        </div>



    )
}

export default Navbar