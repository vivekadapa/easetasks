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
        <div className={`flex flex-col justify-between w-80 border-r-[0.01px] border-slate-300 h-screen top-0 absolute ${sidebarOff ? "hidden" : "block"}`}>
            <div className={`flex-grow mt-32 my-4`}>
                <h2 className='scroll-m-20 text-xl text-center font-semibold tracking-widest'>ALL BOARDS</h2>
                <div className='flex flex-col gap-4 mt-8'>
                    <Button variant={"outline"} className='bg-[#00c9a7cf] text-xl py-2  rounded-r-full w-[80%]'>
                        <img src='./board.svg' className="mr-2 h-4 w-4" /> Kanban Board
                    </Button>
                    <Button variant={"outline"} className='bg-[#00c9a7cf] text-xl py-2  rounded-r-full w-[80%]'>
                        <img src='./board.svg' className="mr-2 h-4 w-4" /> Kanban Board
                    </Button>
                    <Button variant={"outline"} className='bg-[#00c9a7cf] text-xl py-2 rounded-r-full w-[80%]'>
                        <img src='./board.svg' className="mr-2 h-4 w-4" /> Kanban Board
                    </Button>
                </div>

            </div>
            <div className={`p-4 ${sidebarOff ? "hidden" : "block"}`}>
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

    )
}

export default Sidebar