import React, { useEffect, useState } from 'react'
import { ModeToggle } from './ui/mode-toggle'
import { Button } from './ui/button'
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import AddBoard from './AddBoard';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { Board, useAuth } from '@/context/AuthProvider';



const Sidebar = () => {


    const value = useAuth()
    const user = value.user
    const [boards, setBoards] = useState<Board[]>(user?.boards || [])
    const currBoard = value.currBoard
    const sidebarStatus = value.sidebarOff

    useEffect(() => {
        setBoards(user?.boards || [])
    }, [user, currBoard]);

    function handleSideBar() {
        value.setSideBarOff(!value.sidebarOff)
    }
    const handleBoardChange = (_e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        const selectedBoard = user?.boards.find((board: any) => board.id === id);
        if (selectedBoard) {
            localStorage.setItem('currBoard', JSON.stringify(selectedBoard));
            value.setCurrBoard(selectedBoard);
        }
    };

    return (

        <>
            <div className={`fixed h-screen top-0 bottom-0 flex-shrink-0 flex flex-col justify-between overflow-y-auto border-r-[0.01px] border-[#d8dbe0] dark:bg-[#0f172a] transform transition-all duration-300 ${sidebarStatus ? '-translate-x-full w-0' : 'translate-x-0 w-[20rem]'}`}>
                <div className={`flex-grow mt-32 my-4`}>
                    <h2 className='scroll-m-20 text-xl text-center font-semibold tracking-widest'>ALL BOARDS {user?.boards ? `(${user?.boards.length})` : ""} </h2>
                    <div className='flex w-full flex-col gap-4 mt-8'>

                        {
                            boards && boards?.length > 0 && boards.map((board: any) => {
                                return (
                                    <Button key={board?.id} onClick={(e) => handleBoardChange(e, board?.id)} variant="ghost" className={`flex w-[90%] items-center justify-start rounded-r-full pl-6 gap-2 ${board?.id === currBoard?.id ? "bg-[#156255]" : ""}`}>
                                        <MdOutlineSpaceDashboard className='w-6 h-6' />
                                        <p className='text-xl'>{board?.title}</p>
                                    </Button>
                                )
                            })
                        }
                        <AddBoard buttonTitle='Create new board' />
                    </div>

                </div>
                <div className={`p-4`}>
                    <div className='flex justify-between '>
                        <ModeToggle />
                        <Button onClick={handleSideBar} variant={"outline"}>
                            {
                                !sidebarStatus ? (
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
                sidebarStatus &&
                <div className={`fixed bottom-16  transform transition-transform duration-300  ${!sidebarStatus ? '-translate-x-full' : 'translate-x-0'}`}>
                    <Button onClick={handleSideBar} variant={"ghost"} className='pl-6 pr-4 border-t-[1px]  border-b-[1px] border-r-[1px] border-slate-500 rounded-r-full'>
                        <Eye />
                    </Button>
                </div>
            }
        </>


    )
}

export default React.memo(Sidebar)