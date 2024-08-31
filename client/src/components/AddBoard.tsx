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
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios'




const AddBoard = () => {
    const [title, setTitle] = useState("");
    const [adding, setAdding] = useState(false);
    const value = useAuth()
    const token = localStorage.getItem('token')
    const user = value.user;
    console.log(user)
    const [columns, setColumns] = useState<string[]>([]);
    const [error, setError] = useState('');

    const handleAddColumn = () => {
        if (columns[columns.length - 1] !== '') {
            setColumns([...columns, '']);
            setError("");
        }
        else {
            setError("Fill the subtask");
        }
    };

    const handleRemoveInput = (index: number) => {
        if (columns.length == 1) {
            setError('')
        }
        const newInputs = columns.filter((i, ind) => ind != index);
        setColumns(newInputs);
    }

    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        if (columns.length <= 5) {
            const newInputs = [...columns];
            newInputs[index] = event?.target?.value;
            setColumns(newInputs);
            setError("");
        }
    };
    //@ts-ignore
    const handleSubmit = async (e) => {
        console.log("hello wrold")
        e.preventDefault();
        console.log(user)
        const newColumns = columns.map((c, index) => {
            return {
                title: c,
                order: index + 1
            }
        })
        const body = {
            title,
            userId: user ? user?.id : "",
            columns: newColumns
        }

        try {
            const response = await axios.request({
                method: "post",
                url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board`,
                data: body,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    };
    console.log(columns.length)

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
                            <Button variant="outline"><FiPlus className='mr-2 h-4 w-4' /> Create New Board</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader className='mx-auto'>
                                <DialogTitle>Create ticket</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-2">
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="title">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder='Title'
                                        className=""
                                        onChange={(e) => (setTitle(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p>{columns.length !== 0 ? "Board Columns" : ""}</p>
                                {columns.length !== 0 && columns.map((input, index) => (
                                    <div key={index} className='flex gap-2 items-center'>
                                        <Input
                                            type="text"
                                            value={input}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => handleInputChange(index, event)}
                                            placeholder={`Column ${index + 1}`}
                                        />
                                        <IoCloseOutline className='w-6 h-6 cursor-pointer' onClick={() => handleRemoveInput(index)} />
                                    </div>
                                ))}
                                {
                                    error && <p className='text-red-500 text-md'>{error}</p>
                                }
                            </div>
                            <button className='bg-neutral-100 text-slate-900 font-semibold py-2 hover:text-[#00C9A8] rounded-full' onClick={handleAddColumn}>Add New Column</button>
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

export default AddBoard