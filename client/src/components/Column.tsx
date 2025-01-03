import Card from './CustomCard';
import { useAuth } from '@/context/AuthProvider';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

const Column = ({ title, headingColor, column, cards, updateCardInBoard }: any) => {
  if (!column) {
    return null;
  }

  const { attributes, setNodeRef, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "column"
    }
  });

  const value = useAuth();
  const currBoard = value.currBoard;

  return (
    <div 
      className={`w-64 h-[85vh] py-4 shrink-0 ${isDragging ? "opacity-50 border-2" : ""}`}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Transform.toString(transform)
      }}
    >
      <div 
        className="mb-3 flex items-center justify-between cursor-grab" 
        {...attributes} 
        {...listeners}
      >
        <div className='flex items-center gap-2'>
          <p className={`w-4 h-4 rounded-full ${headingColor}`}></p>
          <h3 className={`tracking-widest font-semibold text-slate-800 dark:text-slate-400`}>
            {title.toUpperCase()}
          </h3>
        </div>
        <span className="rounded text-sm text-neutral-400">
          {cards?.length}
        </span>
      </div>
      <div
        className={`min-h-full gap-4 px-5 max-h-96 overflow-y-auto scrollbar-hide w-full transition-colors ${
          isDragging ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        <SortableContext items={cards?.map((c: any) => c.id) || []}>
          {cards && cards.length > 0 && cards.map((c: any) => (
            <Card 
              key={c.id}
              board={currBoard}
              priority={c.priority}
              title={c.title}
              id={c.id}
              column={column}
              card={c}
              updateCardInBoard={updateCardInBoard}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default React.memo(Column);