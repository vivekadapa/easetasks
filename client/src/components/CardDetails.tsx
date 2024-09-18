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

const CardDetails = ({ card, column, board, updateCardInBoard, dialogOpen, setDialogOpen }: any) => {

    const value = useAuth();
    const { currBoard } = value;
    const [priority, setPriority] = useState(card?.priority);
    const [status, setStatus] = useState(column?.id);
    const [subtasks, setSubtasks] = useState(card?.subtasks || []);

    const token = localStorage.getItem("token")

    const completedSubtasksCount = subtasks.filter((subtask: any) => subtask.isComplete).length;

    const handleSubtaskChange = async (index: number, checked: boolean) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/subcard/${subtasks[index].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: checked }),
            });

            if (!response.ok) {
                throw new Error('Failed to update subtask status');
            }

            const updatedSubtasks = [...card?.subtasks];
            updatedSubtasks[index].isComplete = checked;
            setSubtasks(updatedSubtasks);
        } catch (error) {
            console.error('Error updating subtask status:', error);
        }
    };

    const handleUpdateCard = async () => {
        try {
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
                const updatedCard = await response.json();
                updateCardInBoard(currBoard);
                setDialogOpen(false);
            }
            if (!response.ok) {
                throw new Error('Failed to update card');
            }
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px] flex flex-col gap-6">
                <DialogHeader>
                    <div className='flex justify-between items-center'>
                        <DialogTitle className='text-2xl'>{card?.title}</DialogTitle>
                        <BsThreeDotsVertical className='h-5 w-5' />
                    </div>
                </DialogHeader>
                <p>{card?.content}</p>
                <div className='flex flex-col gap-2'>
                    <h1 className='font-bold'>Subtasks({completedSubtasksCount} of {card?.subtasks?.length})</h1>
                    <div className="flex flex-col gap-2 space-y-2">
                        {subtasks?.map((subtask: any, index: number) => (
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
                        ))}
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
                    <button onClick={handleUpdateCard} className="bg-blue-500 text-white rounded p-2">Save Changes</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default CardDetails;
