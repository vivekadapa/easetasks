import React, { useEffect } from 'react'
import { ModeToggle } from './ui/mode-toggle'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { useState } from 'react';
import AddBoard from './AddBoard';
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';



const Sidebar = () => {

    const [sidebarOff, setSideBarOff] = useState<Boolean>(false);
    function handleSideBar() {
        setSideBarOff((prev) => !prev)
    }
    const [boards, setBoards] = useState([])

    const value = useAuth()
    const user = value.user
    // console.log(user.id)
    useEffect(() => {
        console.log("user id : " + user?.id)
        const fetchBoards = async () => {
            try {
                const response = await axios.request({
                    method: "get",
                    url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/${user?.id}`
                })
                console.log(response)
                setBoards(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchBoards()
        console.log(boards)
    }, [user])

    console.log(sidebarOff)
    return (

        <>
            <div className={`flex flex-col justify-between overflow-y-hidden border-r-[0.01px] border-[#d8dbe0] h-[92vh] dark:bg-[#0f172a] transform transition-all duration-300 ${sidebarOff ? '-translate-x-full w-0' : 'translate-x-0 w-[20rem]'}`}>
                <div className={`flex-grow mt-16 my-4`}>
                    <h2 className='scroll-m-20 text-xl text-center font-semibold tracking-widest'>ALL BOARDS</h2>
                    <div className='flex flex-col gap-4 mt-8'>

                        {
                            boards.length > 0 && boards.map((board: any) => {
                                return (
                                    <Button key={board.id} variant="outline" className=''>
                                        {board.title}
                                    </Button>
                                )
                            })
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
            </div>
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