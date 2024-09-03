import React, { ChangeEvent, useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';
import { MdOutlineSpaceDashboard } from "react-icons/md";

interface AddBoardProps {
    boardId?: string;
    existingTitle?: string;
    existingColumns?: { title: string }[];
    isEditMode?: boolean;
}

const AddBoard: React.FC<AddBoardProps> = ({ boardId, existingTitle, existingColumns, isEditMode = false }) => {
    const [title, setTitle] = useState(existingTitle || "");
    const value = useAuth();
    const token = localStorage.getItem('token');
    const [columns, setColumns] = useState<string[]>(existingColumns?.map(col => col.title) || []);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    console.log(columns)
    useEffect(() => {
        if (isEditMode && existingTitle && existingColumns) {
            setTitle(existingTitle);
            setColumns(existingColumns.map(col => col.title));
        }
    }, [isEditMode, existingTitle, existingColumns]);

    const handleAddColumn = () => {
        if (columns[columns.length - 1] !== '') {
            setColumns([...columns, '']);
            setError("");
        } else {
            setError("Fill the column name");
        }
    };

    const handleRemoveInput = (index: number) => {
        const newInputs = columns.filter((_, ind) => ind !== index);
        setColumns(newInputs);
        if (newInputs.length === 0) {
            setError('');
        }
    };

    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        if (columns.length <= 5) {
            const newInputs = [...columns];
            newInputs[index] = event.target.value;
            setColumns(newInputs);
            setError("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newColumns = columns.map((c, index) => ({
            id: existingColumns && existingColumns[index]?.id, // Add the id if editing
            title: c,
            order: index + 1
        }));

        const body = {
            title,
            userId: value.user?.id || "",
            columns: newColumns
        };

        try {
            if (isEditMode && boardId) {
                await axios.request({
                    method: "put",
                    url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/${boardId}`,
                    data: body,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                value.verifyToken(token || "")
            } else {
                const response = await axios.request({
                    method: "post",
                    url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board`,
                    data: body,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                value.setCurrBoard(response.data);
            }
            value.verifyToken(token);
            setOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant={"ghost"}
                className="flex w-full items-center gap-1.5 px-3 py-1.5 text-lg font-semibold mx-auto text-neutral-400 transition-colors hover:text-neutral-50"
            >
                {isEditMode ? "Edit board" : <p className='flex items-center'><MdOutlineSpaceDashboard className='mr-2 h-6 w-6' /><FiPlus className='mr-2 h-4 w-4' /> Create new board </p>}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {/* <Button variant="ghost" className='w-full'>
                        {isEditMode ? "Edit Board" : "Create Board"}
                    </Button> */}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className='mx-auto'>
                        <DialogTitle>{isEditMode ? "Edit Board" : "Create Board"}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-2">
                        <div className="flex flex-col gap-4 py-2">
                            <div className="flex flex-col gap-4">
                                <Label htmlFor="title">
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    value={title}
                                    placeholder='Title'
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            {columns.length !== 0 && <p>Board Columns</p>}
                            {columns.map((input, index) => (
                                <div key={index} className='flex gap-2 items-center'>
                                    <Input
                                        type="text"
                                        value={input}
                                        onChange={(event) => handleInputChange(index, event)}
                                        placeholder={`Column ${index + 1}`}
                                    />
                                    <IoCloseOutline className='w-6 h-6 cursor-pointer' onClick={() => handleRemoveInput(index)} />
                                </div>
                            ))}
                            {error && <p className='text-red-500 text-md'>{error}</p>}
                        </div>
                        <button className='bg-neutral-100 w-full text-slate-900 font-semibold py-2 hover:text-[#00C9A8] rounded-full' onClick={handleAddColumn}>
                            {isEditMode ? "Add Column" : "Add New Column"}
                        </button>
                        <DialogFooter>
                            <Button onClick={handleSubmit} type="submit" className='bg-[#00C9A8]'>{isEditMode ? "Save changes" : "Create Board"}</Button>
                        </DialogFooter>
                    </div>
                    {/* <DialogClose asChild>
                        <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
                    </DialogClose> */}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddBoard;
