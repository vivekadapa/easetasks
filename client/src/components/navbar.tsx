import { useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import AddCard from './AddCard';
import { useAuth } from '@/context/AuthProvider';
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from 'axios';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import AddBoard from './AddBoard';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React from 'react';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
    const navigate = useNavigate();
    const value = useAuth()
    const user = value.user
    const currBoard = value.currBoard
    const [openMenu, setOpenMenu] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            //@ts-ignore
            if (menuRef.current && !menuRef.current?.contains(event.target as Node)) {
                setOpenMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = async () => {
        await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/auth/logout`, { withCredentials: true })
        localStorage.removeItem('currBoard');
        navigate("/landing")
    }


    const handleDelete = async () => {
        try {
            await axios.request({
                url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/${currBoard?.id}`,
                method: "delete",
                withCredentials: true
            })
            value.setCurrBoard(null)
            localStorage.removeItem("currBoard")
            value.checkLoginStatus()
            setAlertOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex fixed px-8 z-50 top-0 w-full  items-center border-b-[1px] gap-16  dark:bg-[#0f172a] border-slate-400'>
            <div className='p-4 flex items-center gap-2'>
                <img src="./logo.svg" alt="" className='custommd:w-10 custommd:h-10 ' />
                <h1 className='custommd:text-4xl text-2xl font-bold tracking-tight'>EaseTasks</h1>
            </div>
            <div className='custommd:block hidden text-2xl dark:text-neutral-100 font-bold flex-grow items-center justify-between px-8'>
                {currBoard?.title}
            </div>
            <div className='flex flex-1 justify-end gap-4 items-center'>
                <div>
                    <AddCard />
                </div>
                <button className={`relative ${!currBoard ? "hidden" : "block"}`} ref={menuRef} onClick={() => setOpenMenu((prev) => !prev)}>
                    <BsThreeDotsVertical className='w-8 h-8 p-1 hover:bg-[#e0cece44] cursor-pointer rounded-full' />
                    <div className={`absolute rounded-md w-32 bg-slate-900 text-white top-12 right-2 ${openMenu ? "flex flex-col" : "hidden"}`}>
                        <AddBoard
                            board={currBoard}
                            existingTitle={currBoard?.title}
                            existingColumns={currBoard?.columns}
                            isEditMode={true}
                            buttonTitle='Edit Board'
                        />
                        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" className='text-red-500 w-full mr-auto px-3 py-1.5 text-lg'>Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className='text-red-500 font-bold text-xl'>Delete this Board</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete the <span className='text-red-500 font-semibold'>{currBoard?.title}</span> board? This action will remove all columns and tasks and cannot be reversed.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction className='bg-red-500 text-white hover:bg-red-800' onClick={handleDelete}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <button onClick={handleLogout} className='custommd:hidden block cursor-pointer  px-3 py-1.5'>Logout</button>
                    </div>

                </button>
                <div className='custommd:block hidden'>
                    <DropdownMenu >
                        <DropdownMenuTrigger>
                            <Avatar>
                                {/* @ts-ignore */}
                                <AvatarImage src={`${user ? user?.avatar : ""}`} alt="avatar" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Navbar)
