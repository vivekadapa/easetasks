import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EditCard from './EditCard';
import CardDetails from './CardDetails';
import { useAuth } from '@/context/AuthProvider';

const DropIndicator = ({ beforeId, column }: any) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const Card = ({ title, id, column, handleDragStart, priority, card, board, updateCardInBoard }: any) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const completedSubtasks = card.subtasks.filter((s: any) => s.isComplete == true)

  

  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e: Event) => handleDragStart(e, { title, id, column })}
        // onTouchStart={(e) => handleTouchStart(e, { title, id, column })}
        onClick={() => setDialogOpen(true)} // Open edit dialog when the card is clicked
        className="cursor-grab flex flex-col items-start gap-3 justify-between rounded text-neutral-700 dark:text-neutral-100 border  border-neutral-700 bg-neutral-200 dark:bg-[#2b2c37] p-3 active:cursor-grabbing"
      >
        <p className="text-md">{title.length > 20 ? title.slice(0, 20) + "..." : title}</p>
        <div className='flex w-full justify-between items-center'>
          <p className='text-sm text-[#828fa3]'>{completedSubtasks?.length} of {card?.subtasks?.length} subtasks</p>
          <img src={`./${card?.priority}.svg`} className='w-6 h-6' alt="" />
        </div>
      </motion.div>

      <CardDetails card={card} column={column} board={board} updateCardInBoard={updateCardInBoard} dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen} />
      {/* <EditCard
        card={card}
        board={board}
        updateCardInBoard={updateCardInBoard}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      /> */}
    </>
  );
};

export default Card;
