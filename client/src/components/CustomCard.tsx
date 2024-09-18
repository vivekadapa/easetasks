import { useState } from 'react';
import { motion } from 'framer-motion';
import CardDetails from './CardDetails';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

const DropIndicator = ({ beforeId, column }: any) => {
  return (
    <div
      data-before={beforeId || '-1'}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const Card = ({ title, id, column, card, board, updateCardInBoard }: any) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const completedSubtasks = card.subtasks.filter((s: any) => s.isComplete == true);

  const { attributes, setNodeRef, listeners, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: 'card',
    },
  });

  const handleClick = (_e: React.MouseEvent) => {
    if (!isDragging) {
      setDialogOpen(true);
    }
  };

  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        ref={setNodeRef}
        {...attributes}
        style={{
          transition,
          transform: CSS.Translate.toString(transform),
        }}
        onClick={(e) => handleClick(e)} // Open edit dialog when the card is clicked
        className={` ${isDragging && 'opacity-50'
          } group cursor-grab relative flex flex-col items-start gap-3 justify-between rounded text-neutral-700 dark:text-neutral-100 border  border-neutral-700 bg-neutral-200 dark:bg-[#2b2c37] p-3 active:cursor-grabbing`}
      >
        {/* Grip Vertical Icon, hidden by default, shown on hover */}
        <GripVertical
          className="absolute -left-6 top-0 bottom-0 translate-y-2/3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          {...listeners}
        />
        <p className="text-md">{title.length > 20 ? title.slice(0, 20) + '...' : title}</p>
        <div className="flex w-full justify-between items-center">
          <p className="text-sm text-[#828fa3]">
            {completedSubtasks?.length} of {card?.subtasks?.length} subtasks
          </p>
          <img src={`./${card?.priority}.svg`} className="w-6 h-6" alt="" />
        </div>
      </motion.div>

      <CardDetails
        card={card}
        column={column}
        board={board}
        updateCardInBoard={updateCardInBoard}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
};

export default Card;
