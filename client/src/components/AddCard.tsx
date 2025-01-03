import { ChangeEvent, useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
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
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';
import Loader from '../assets/loader.svg'


const AddCard = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("")
    const value = useAuth()
    const board = value.currBoard;
    const [columns, setColumns] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [subtasks, setSubtasks] = useState<string[]>([]);
    const [priority, setPriority] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const [error, setError] = useState('');

    useEffect(() => {
        const fetchColumns = async (boardId: any) => {
            const response = await axios.request({
                url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/column/${boardId}`,
                method: 'GET',
            })
            if (response.status === 200) {
                setColumns(response.data);
            }
        }

        if (board) {
            fetchColumns(board.id);
        }
    }, [board])

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
        const newInputs = subtasks.filter((_i, ind) => ind != index);
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const selectedColumn = columns.find((column: any) => column.id === status);
        let newOrder = 1;
        //@ts-ignore
        if (selectedColumn && selectedColumn?.cards.length > 0) {
            //@ts-ignore
            const highestOrder = Math.max(...selectedColumn?.cards?.map((card: any) => card.order));
            newOrder = highestOrder + 1;
        }

        const body = {
            title,
            description,
            priority,
            columnId: status,
            subtasks,
            order: newOrder
        }

        try {
            await axios.request({
                url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/card`,
                method: "post",
                data: body,
                withCredentials: true
            })
            const updatedBoardResponse = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/board/${board?.id}`, {
                withCredentials: true
            });
            setSubtasks([])
            value.setCurrBoard(updatedBoardResponse.data);
            setLoading(false)
            setDialogOpen(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }

        // setAdding(false);
    };

    return (
        <>
            {(
                <motion.button
                    layout
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs dark:text-neutral-400 transition-colors hover:text-neutral-50"
                >
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => setDialogOpen(true)} disabled={board === undefined || board === null || Object.keys(board).length === 0 || columns.length === 0}>
                                <FiPlus className='mr-2 h-4 w-4' /> Add a new task
                            </Button>
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
                                        onChange={(e) => (setTitle(e.target.value))}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder='Mention your description here.....'
                                        className="col-span-3"
                                        onChange={(e) => (setDescription(e.target.value))}
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
                                    <Select onValueChange={(value) => {
                                        setStatus(value)
                                    }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Status</SelectLabel>
                                                {
                                                    columns && columns.length > 0 ? columns.map((c: any) => (
                                                        <SelectItem value={c.id}>{c.title}</SelectItem>
                                                    )) : <div className='text-center'>No Columns</div>
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                {
                                    loading ? (<Button className='bg-white flex justify-center items-center'>
                                        <img src={Loader} alt="" className='w-10 h-10' />
                                    </Button>) : (
                                        <Button type="submit" className='bg-[#00C9A8]' onClick={handleSubmit}>Save changes</Button>
                                    )
                                }
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </motion.button>
            )}
        </>
    );
};

export default AddCard