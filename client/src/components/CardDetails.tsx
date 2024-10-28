import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from './ui/label';
import { useAuth } from '@/context/AuthProvider';
import { Checkbox } from "@/components/ui/checkbox";
import loader from '../assets/loader.svg';
import { Button } from './ui/button';
import axios from 'axios';


const CardDetails = ({ card, column, updateCardInBoard, dialogOpen, setDialogOpen }: any) => {

    const value = useAuth();
    const { currBoard } = value;
    const [priority, setPriority] = useState(card?.priority);
    const [status, setStatus] = useState(column?.id);
    const [subtasks, setSubtasks] = useState(card?.subtasks || []);
    const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const token = localStorage.getItem("token")

    const [openMenu, setOpenMenu] = useState(false)

    const completedSubtasksCount = subtasks.filter((subtask: any) => subtask.isComplete).length;

    const handleSubtaskChange = async (index: number, checked: boolean) => {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/subcard/${subtasks[index].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completed: checked }),
            });

            if (!response.ok) {
                setLoading(false)
                throw new Error('Failed to update subtask status');
            }

            const updatedSubtasks = [...card?.subtasks];
            updatedSubtasks[index].isComplete = checked;
            setSubtasks(updatedSubtasks);
            setLoading(false)
        } catch (error) {
            console.error('Error updating subtask status:', error);
        }
    };

    const handleUpdateCard = async () => {
        try {
            setEditLoading(true)
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/card/${card.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    priority,
                    columnId: status, // Send the new status (column ID)
                    subtasks: subtasks.map((subtask: any) => ({ id: subtask.id, title: subtask.title, isComplete: subtask.isComplete })), // Ensure subtasks are included if needed
                }),
            });

            if (response.ok) {
                // const updatedCard = await response.json();
                setEditLoading(false);
                updateCardInBoard(currBoard);
                setDialogOpen(false);
            }
            if (!response.ok) {
                setEditLoading(false);
                throw new Error('Failed to update card');
            }
        } catch (error) {
            setEditLoading(false);
            console.error('Error updating card:', error);
        }
    };



    const handleCardDelete = async () => {
        try {
            const response = await axios.request({
                url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/card/${card.id}`,
                method: "delete"
            })
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px] flex flex-col gap-6">
                <DialogHeader>
                    <div className='flex justify-between items-center'>
                        <DialogTitle className='text-2xl'>{card?.title}</DialogTitle>
                        <BsThreeDotsVertical className='w-8 h-8 p-1 hover:bg-[#e0cece44] rounded-full cursor-pointer' onClick={() => setOpenMenu((prev) => !prev)} />
                        <div className={`absolute rounded-md w-32 bg-slate-900 text-white top-14 right-2 ${openMenu ? "flex flex-col" : "hidden"}`}>
                            <button onClick={handleCardDelete} className='p-1 font-semibold text-red-500 hover:bg-slate-900'>Delete</button>
                        </div>
                    </div>
                </DialogHeader>
                <p>{card?.content}</p>
                <div className='flex flex-col gap-2'>
                    <h1 className='font-bold'>Subtasks({completedSubtasksCount} of {card?.subtasks?.length})</h1>
                    <div className="flex flex-col gap-2 space-y-2">

                        {!loading ? subtasks?.map((subtask: any, index: number) => (
                            <div key={index} className="flex p-2 gap-4 bg-[#20212c] cursor-pointer hover:bg-[#00C9A8] hover:bg-opacity-15 items-center space-x-2">
                                <Checkbox
                                    id={`subtask-${index}`}
                                    checked={subtask.isComplete}
                                    onCheckedChange={(checked) => handleSubtaskChange(index, checked as boolean)}
                                />
                                <label
                                    htmlFor={`subtask-${index}`}
                                    className={`text-md ${subtask.isComplete ? 'line-through text-gray-500' : ''}`}
                                >
                                    {subtask.title}
                                </label>
                            </div>
                        )) : <div className='flex items-center justify-center'>
                            <img src={loader} className='w-10 h-10' alt='loader' />
                        </div>
                        }
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    <Label>Priority</Label>
                    <Select value={priority} onValueChange={(value) => {
                        setPriority(value);
                    }}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Priority</SelectLabel>
                                <SelectItem value="blocker" className='flex items-center'><img src='./blocker.svg' className='mx-2 inline w-4 h-4' /><span>Blocker</span></SelectItem>
                                <SelectItem value="critical"><img src='./critical.svg' className='mx-2 inline w-4 h-4' /><span>Critical</span></SelectItem>
                                <SelectItem value="major"><img src='./major.svg' className='mx-2 inline w-4 h-4' /><span>Major</span></SelectItem>
                                <SelectItem value="highest"><img src='./highest.svg' className='mx-2 inline w-4 h-4' /><span>Highest</span></SelectItem>
                                <SelectItem value="high"><img src='./high.svg' className='mx-2 inline w-4 h-4' /><span>High</span></SelectItem>
                                <SelectItem value="trivial"><img src='./trivial.svg' className='mx-2 inline w-4 h-4' /><span>Trivial</span></SelectItem>
                                <SelectItem value="low"><img src='./low.svg' className='mx-2 inline w-4 h-4' /><span>Low</span></SelectItem>
                                <SelectItem value="lowest"><img src='./lowest.svg' className='mx-2 inline w-4 h-4' /><span>Lowest</span></SelectItem>
                                <SelectItem value="minor"><img src='./minor.svg' className='mx-2 inline w-4 h-4' /><span>Minor</span></SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex flex-col gap-3'>
                    <Label>Status</Label>
                    <Select
                        value={status}
                        onValueChange={(value) => {
                            console.log(value);
                            setStatus(value);
                        }}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                {currBoard?.columns && currBoard?.columns.length > 0 && currBoard?.columns.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    {
                        editLoading ? (<Button className='bg-white flex justify-center items-center'>
                            <img src={loader} alt="" className='w-10 h-10' />
                        </Button>) : (
                            <Button onClick={handleUpdateCard} className="bg-[#00C9A8] text-black rounded p-2">Save changes</Button>
                        )
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CardDetails;
