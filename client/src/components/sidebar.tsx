import React, { useEffect } from 'react'
import { ModeToggle } from './ui/mode-toggle'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { useState } from 'react';
import AddBoard from './AddBoard';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';
import Loader from './Loader';



const Sidebar = () => {

    const [sidebarOff, setSideBarOff] = useState<Boolean>(false);
    function handleSideBar() {
        setSideBarOff((prev) => !prev)
    }
    const [board, setBoard] = useState({})
    const value = useAuth()
    const user = value.user
    const currBoard = value.currBoard

    useEffect(() => {
        if (currBoard) {
            setBoard(currBoard)
        }
    }, [user])


    const handleBoardChange = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        console.log(`Board with ID ${id} clicked`);
        const selectedBoard = user?.boards.find((board: any) => board.id === id);
        if (selectedBoard) {
            value.setCurrBoard(selectedBoard);
        }
    };

    return (

        <>
            <div className={`flex flex-col justify-between overflow-y-auto border-r-[0.01px] border-[#d8dbe0] h-screen dark:bg-[#0f172a] transform transition-all duration-300 ${sidebarOff ? '-translate-x-full w-0' : 'translate-x-0 w-[20rem]'}`}>
                <div className={`flex-grow mt-32 my-4`}>
                    <h2 className='scroll-m-20 text-xl text-center font-semibold tracking-widest'>ALL BOARDS {user?.boards ? `(${user?.boards.length})` : ""} </h2>
                    <div className='flex flex-col gap-4 mt-8'>

                        {
                            user && user.boards.length > 0 ? user.boards.map((board: any) => {
                                return (
                                    <Button key={board?.id} onClick={(e) => handleBoardChange(e, board?.id)} variant="ghost" className={`flex w-[90%] items-center rounded-r-full gap-2 ${board?.id === currBoard?.id ? "bg-[#156255]" : ""}`}>
                                        <MdOutlineSpaceDashboard className='w-6 h-6' />
                                        <p className='text-xl'>{board?.title}</p>
                                    </Button>
                                )
                            }) : <div className='mx-auto'>
                                <Loader />
                            </div>

                        }
                        <AddBoard />
                    </div>

                </div>
                <div className={`p-4`}>
                    <div className='flex justify-between '>
                        <ModeToggle />
                        <Button onClick={handleSideBar} variant={"outline"}>
                            {
                                !sidebarOff ? (
                                    <><EyeOff className="mr-2 h-4 w-4" /> Hide Sidebar</>
                                ) : (
                                    <><Eye /></>
                                )
                            }
                        </Button>
                    </div>
                </div>
            </div >
            {
                sidebarOff &&
                <div className={`absolute bottom-10 left-0 transform transition-transform duration-300 ${!sidebarOff ? '-translate-x-full' : 'translate-x-0'}`}>
                    <Button onClick={handleSideBar} variant={"ghost"} className='pl-6 pr-4 border-t-[1px]  border-b-[1px] border-r-[1px] border-slate-500 rounded-r-full'>
                        <Eye />
                    </Button>
                </div>
            }
        </>


    )
}

export default Sidebar