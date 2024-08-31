import React, { ChangeEvent, useRef, useState } from 'react'
import { motion } from "framer-motion";
import { FiPlus, FiTrash } from "react-icons/fi";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IoCloseOutline } from "react-icons/io5";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


const AddCard = ({ column, setCards }: any) => {
    const [text, setText] = useState("");
    const [adding, setAdding] = useState(false);

    const [subtasks, setSubtasks] = useState<string[]>([]);
    const [priority, setPriority] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const [error, setError] = useState('');

    const handleAddSubtasks = () => {
        if (subtasks[subtasks.length - 1] !== '') {
            setSubtasks([...subtasks, '']);
            setError("");
        }
        else {
            setError("Fill the subtask");
        }
    };

    const handleRemoveInput = (index: number) => {
        if (subtasks.length == 1) {
            setError('')
        }
        const newInputs = subtasks.filter((i, ind) => ind != index);
        setSubtasks(newInputs);
    }

    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        if (subtasks.length <= 5) {
            const newInputs = [...subtasks];
            newInputs[index] = event?.target?.value;
            setSubtasks(newInputs);
            setError("");
        }
    };
    //@ts-ignore
    const handleSubmit = (e) => {
        console.log("hello wrold")
        e.preventDefault();

        if (!text.trim().length) return;

        const newCard = {
            column,
            title: text.trim(),
            id: Math.random().toString(),
        };

        //@ts-ignore
        setCards((pv) => [...pv, newCard]);

        setAdding(false);
    };
    console.log(subtasks.length)

    return (
        <>
            {(
                <motion.button
                    layout
                    onClick={() => setAdding(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
                >
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"><FiPlus className='mr-2 h-4 w-4' /> Add</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader className='mx-auto'>
                                <DialogTitle>Create ticket</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="title">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder='Title'
                                        className=""
                                        onChange={(e) => (setText(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="username">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="username"
                                        placeholder='Mention your description here.....'
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                {subtasks.length !== 0 && subtasks.map((input, index) => (
                                    <div key={index} className='flex gap-2 items-center'>
                                        <Input
                                            type="text"
                                            value={input}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => handleInputChange(index, event)}
                                            placeholder={`Subtask ${index + 1}`}
                                        />
                                        <IoCloseOutline className='w-6 h-6 cursor-pointer' onClick={() => handleRemoveInput(index)} />
                                    </div>
                                ))}
                                {
                                    error && <p className='text-red-500 text-md'>{error}</p>
                                }
                            </div>
                            <button className='bg-neutral-100 text-slate-900 font-semibold py-2 hover:text-[#00C9A8] rounded-full' onClick={handleAddSubtasks}>Add New subtask</button>
                            <div className='flex gap-3'>
                                <div className='flex flex-col gap-3' >
                                    <Label>Priority</Label>
                                    <Select onValueChange={(value) => setPriority(value)}>
                                        <SelectTrigger className="w-[180px]">
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
                                    <Select onValueChange={(value) => setStatus(value)}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                <SelectItem value="todo">To Do</SelectItem>
                                                <SelectItem value="in-progress">In Progress</SelectItem>
                                                <SelectItem value="done">Done</SelectItem>
                                                <SelectItem value="blocked">Blocked</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className='bg-[#00C9A8]' onClick={handleSubmit}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </motion.button>
            )}
        </>
    );
};

export default AddCard