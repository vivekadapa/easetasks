import React from 'react'
import { ModeToggle } from './mode-toggle'
import { Link } from 'react-router-dom'
import { Button } from './button'
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { useState } from 'react';



const Sidebar = () => {

    const [sidebarOff, setSideBarOff] = useState<Boolean>(false);

    function handleSideBar() {
        setSideBarOff((prev) => !prev)
        console.log("hello world")
    }

    return (

        <>
            <div className={`flex flex-col justify-between w-80 border-r-[0.01px] border-[#d8dbe0] h-screen top-0 absolute dark:bg-[#0f172a] -z-10 transform transition-transform duration-300 ${sidebarOff ? '-translate-x-full' : 'translate-x-0'}`}>
                <div className={`flex-grow mt-32 my-4`}>
                    <h2 className='scroll-m-20 text-xl text-center font-semibold tracking-widest'>ALL BOARDS</h2>
                    <div className='flex flex-col gap-4 mt-8'>
                        <Button asChild variant={"outline"} className='w-[90%] text-xl py-4  rounded-r-full'>
                            <Link to={'/hello'}>
                                <img src='./board.svg' className="mr-2 h-4 w-4" /> Kanban Board
                            </Link>
                        </Button>
                        <Button asChild variant={"outline"} className='w-[90%] text-xl py-4  rounded-r-full'>
                            <Link to={'/hello'}>
                                <img src='./board.svg' className="mr-2 h-4 w-4" /> Kanban Board
                            </Link>
                        </Button>
                        <Button asChild variant={"outline"} className='w-[90%] text-xl py-4  rounded-r-full'>
                            <Link to={'/hello'}>
                                <img src='./board.svg' className="mr-2 h-4 w-4" /> Kanban Board
                            </Link>
                        </Button>
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
            </div>
            {
                <div className={`absoulte transform transition-transform duration-300 translate-y-[700px] ${!sidebarOff ? '-translate-x-full' : 'translate-x-0'}`}>
                    <Button onClick={handleSideBar} variant={"ghost"} className='pl-6 pr-4 border-t-[1px]  border-b-[1px] border-r-[1px] border-slate-500 rounded-r-full'>
                        <Eye />
                    </Button>
                </div>
            }
        </>


    )
}

export default Sidebar