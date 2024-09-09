import React, { ChangeEvent, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IoCloseOutline } from "react-icons/io5";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import axios from 'axios';

const EditCard = ({ card, board, updateCardInBoard, dialogOpen, setDialogOpen }: any) => {
    const [title, setTitle] = useState(card?.title);
    const [description, setDescription] = useState(card?.description || '');
    const [subtasks, setSubtasks] = useState<string[]>(card?.subtasks || []);
    const [priority, setPriority] = useState(card?.priority || null);
    const [status, setStatus] = useState(card?.columnId || null);
    const [error, setError] = useState('');
  
    useEffect(() => {
      // Prepopulate data from card
      setTitle(card?.title);
      setDescription(card?.description);
      setSubtasks(card?.subtasks || []);
      setPriority(card?.priority);
      setStatus(card?.columnId);
    }, [card]);
  
    const handleAddSubtasks = () => {
      if (subtasks[subtasks.length - 1] !== '') {
        setSubtasks([...subtasks, '']);
        setError('');
      } else {
        setError('Fill the subtask');
      }
    };
  
    const handleRemoveInput = (index: number) => {
      const newInputs = subtasks.filter((_, ind) => ind !== index);
      setSubtasks(newInputs);
    };
  
    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
      const newInputs = [...subtasks];
      newInputs[index] = event?.target?.value;
      setSubtasks(newInputs);
      setError('');
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      const body = {
        title,
        description,
        priority,
        columnId: status,
        subtasks,
      };
  
      try {
        // Make API request to update the card
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/card/${card.id}`, body);
  
        // Fetch updated board data and update state
        const updatedBoardResponse = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/board/${board.id}`);
        updateCardInBoard(updatedBoardResponse.data);
  
        setDialogOpen(false);
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-4">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description"
                />
              </div>
            </div>
  
            {/* Subtasks */}
            <div className="flex flex-col gap-2">
              {subtasks.map((input, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={input}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleInputChange(index, event)}
                    placeholder={`Subtask ${index + 1}`}
                  />
                  <IoCloseOutline className="w-6 h-6 cursor-pointer" onClick={() => handleRemoveInput(index)} />
                </div>
              ))}
              {error && <p className="text-red-500 text-md">{error}</p>}
            </div>
            <Button onClick={handleAddSubtasks}>Add New Subtask</Button>
  
            {/* Priority and Status */}
            <div className="flex gap-3">
              <div className="flex flex-col gap-3">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Add your priority options here */}
                      <SelectItem value="blocker">Blocker</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
  
              <div className="flex flex-col gap-3">
                <Label>Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Map through board columns */}
                      {board?.columns?.map((col: any) => (
                        <SelectItem key={col.id} value={col.id}>{col.title}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
  
            <DialogFooter>
              <Button type="submit" className="bg-[#00C9A8]">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default EditCard;
  