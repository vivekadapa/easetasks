import React, { ChangeEvent, useState, useEffect } from 'react';
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoCloseOutline } from "react-icons/io5";
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import Loader from '../assets/loader.svg';

interface AddBoardProps {
    board?: any;
    existingTitle?: string;
    existingColumns?: any[];
    isEditMode?: boolean;
    buttonTitle: string
}

const AddBoard: React.FC<AddBoardProps> = ({ board, existingTitle, existingColumns, isEditMode = false, buttonTitle }) => {
    const [title, setTitle] = useState(existingTitle || "");
    const value = useAuth();
    const [oldColumns, setOldColumns] = useState(value?.currBoard?.columns || [])
    const [newColumns, setNewColumns] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (isEditMode && existingTitle && existingColumns) {
            setTitle(existingTitle);
            setOldColumns(existingColumns);
        }
        else {
            setTitle("");
            setOldColumns([]);
            setNewColumns([]);

        }
    }, [isEditMode, existingTitle, existingColumns]);

    const handleAddColumn = () => {
        if (newColumns.length == 0 || newColumns[newColumns.length - 1] !== '') {
            setNewColumns([...newColumns, '']);
            setError("");
        } else {
            setError("Fill the column name");
        }
    };

    const handleRemoveInput = (index: number) => {
        const newInputs = newColumns.filter((_, ind) => ind !== index);
        setNewColumns(newInputs);
        if (newInputs.length === 0) {
            setError('');
        }
    };

    const handleOldInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const columns = [...oldColumns]
        columns[index].title = event.target.value;
        setOldColumns(columns)
    }

    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        if (newColumns.length <= 5) {
            const newInputs = [...newColumns];
            newInputs[index] = event.target.value;
            setNewColumns(newInputs);
            setError("");
        }
    };

    const handleDeleteColumn = (columnId: string) => {
        setColumnToDelete(columnId);
        setConfirmDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!columnToDelete) return;

        try {
            setConfirmDeleteDialog(false);
            setOpen(false);
            setLoading(true)
            await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/column/${columnToDelete}`, {
                withCredentials: true
            });
            const updatedBoardResponse = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/board/${board.id}`, {
                withCredentials: true
            });
            value.setCurrBoard(updatedBoardResponse.data);

            setLoading(false)
            setColumnToDelete(null);
        } catch (error) {
            console.error("Error deleting column:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        const oldColumnsBody = oldColumns.map((c, index) => ({
            id: c?.id,
            title: c.title,
            order: index + 1
        }));
        const newColumnsBody = newColumns.map((c, index) => ({
            title: c,
            order: oldColumns.length + index + 1
        }))

        const body = {
            title,
            columns: [...oldColumnsBody, ...newColumnsBody]
        };

        try {
            let response;
            if (isEditMode && board?.id) {
                response = await axios.request({
                    method: "put",
                    url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/${board?.id}`,
                    data: body,
                    withCredentials: true
                });

            } else {
                response = await axios.request({
                    method: "post",
                    url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board`,
                    data: body,
                    withCredentials: true
                });

            }


            setLoading(false);
            setNewColumns([])
            value.checkLoginStatus()
            setTitle("")
            value.setCurrBoard(response.data);
            localStorage.setItem("currBoard", JSON.stringify(response.data))
            setOpen(false);
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    };

    return (
        <>
            <Button
                onClick={() => {
                    setOpen(true);
                }}
                variant={"ghost"}
                className={`${buttonTitle === "Add Column" ? "h-[80vh]" : ""} flex w-full items-center justify-start gap-1.5 pl-6 py-1.5 text-lg font-semibold mx-auto text-neutral-400 transition-colors dark:hover:text-neutral-50 hover:bg-transparent`}
            >
                {buttonTitle === "Create new board" ?
                    <p className='flex items-center'><MdOutlineSpaceDashboard className='mr-2 h-6 w-6' /><FiPlus className='mr-2 h-4 w-4' /> Create new board </p> :
                    buttonTitle === "Edit Board" ? <>Edit Board</> : <p className='flex gap-2 items-center'><FiPlus className='mr-2 h-6 w-6' />{buttonTitle}</p>
                }
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
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
                            {oldColumns.length !== 0 && <p>Board Columns</p>}
                            {oldColumns.map((input, index) => (
                                <div key={index} className='flex gap-2 items-center'>
                                    <Input
                                        type="text"
                                        value={input.title}
                                        onChange={(event) => handleOldInputChange(index, event)}
                                        placeholder={`Column ${index + 1}`}
                                    />
                                    {
                                        isEditMode === true ? (
                                            <MdOutlineDelete className='w-6 h-6 text-red-500 cursor-pointer' onClick={() => handleDeleteColumn(input?.id)} />
                                        ) : <IoCloseOutline className='w-6 h-6 cursor-pointer' onClick={() => handleRemoveInput(index)} />
                                    }
                                </div>
                            ))}
                            {newColumns.map((input, index) => (
                                <div key={index} className='flex gap-2 items-center'>
                                    <Input
                                        type="text"
                                        value={input}
                                        onChange={(event) => handleInputChange(index, event)}
                                        placeholder={`Column ${index + 1}`}
                                    />
                                    {
                                        <IoCloseOutline className='w-6 h-6 cursor-pointer' onClick={() => handleRemoveInput(index)} />
                                    }
                                </div>
                            ))}
                            {error && <p className='text-red-500 text-md'>{error}</p>}
                        </div>
                        <button className='bg-neutral-100 w-full text-slate-900 font-semibold py-2 hover:text-[#00C9A8] rounded-full' onClick={handleAddColumn}>
                            {isEditMode ? "Add Column" : "Add New Column"}
                        </button>
                        <DialogFooter>
                            {
                                loading ? (
                                    <Button className='bg-white flex justify-center items-center'>
                                        <img src={Loader} alt="" className='w-10 h-10' />
                                    </Button>
                                ) : (
                                    <Button onClick={handleSubmit} type="submit" className='bg-[#00C9A8]'>
                                        {isEditMode ? "Save changes" : "Create Board"}
                                    </Button>
                                )
                            }

                        </DialogFooter>
                    </div>

                </DialogContent>
            </Dialog>

            <Dialog open={confirmDeleteDialog} onOpenChange={setConfirmDeleteDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this column?</p>
                    <DialogFooter>
                        {
                            loading ? (<Button className='bg-white flex justify-center items-center'>
                                <img src={Loader} alt="" />
                            </Button>) : (
                                <Button onClick={confirmDelete} className='bg-red-500'>Yes, Delete</Button>
                            )
                        }
                        <Button onClick={() => setConfirmDeleteDialog(false)} variant="ghost">Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddBoard;
