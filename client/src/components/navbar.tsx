import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import AddCard from './AddCard';
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const Navbar = () => {
    const navigate = useNavigate();
    const value = useAuth()
    const user = value.user

    const [currBoard, setCurrBoard] = useState("");
    const [boards, setBoards] = useState([])

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

    return (

        <div className='flex w-full items-center border-b-[1px] gap-16  dark:bg-[#0f172a] border-slate-400'>
            <div className='p-4 flex items-center gap-2'>
                <img src="./logo.svg" alt="" className='w-10 h-10' />
                <h1 className='text-4xl font-bold tracking-tight'>EaseTasks</h1>
            </div>
            <div className='flex flex-grow items-center justify-between px-8'>
                {
                    boards.length > 0 && (
                        <Select defaultValue={boards[0]?.id} onValueChange={(value) => setCurrBoard(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Board" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Priority</SelectLabel>
                                    {
                                        boards.length > 0 && boards.map((board: any) => {
                                            return (
                                                <SelectItem value={board.id}>{board.title}</SelectItem>
                                            )
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )
                }

                {/* <Button className='text-md rounded-3xl'> <Plus className='w-6 h-6' /> Add New Task</Button> */}
                <AddCard />
            </div>
        </div>



    )
}

export default Navbar