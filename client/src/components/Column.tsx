import Card from './CustomCard';
import { useAuth } from '@/context/AuthProvider';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'

//@ts-ignore
const Column = ({ title, headingColor, column, cards, updateCardInBoard }) => {
  if (!column) {
    return null;
  }
  // const [active, setActive] = useState(false);

  const { attributes, setNodeRef, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: "column"
    }
  })

  const value = useAuth()
  const currBoard = value.currBoard
  return (
    <div className={`w-64 py-4 shrink-0 ${isDragging && "opacity-50 h-full border-2"}`}
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform)
      }}
    >
      <div className="mb-3 flex items-center justify-between"   {...listeners}>
        <div className='flex items-center gap-2'>
          <p className={`w-4 h-4 rounded-full ${headingColor}`}></p>
          <h3 className={`tracking-widest font-semibold text-slate-800 dark:text-slate-400`}>{title.toUpperCase()}</h3>
        </div>
        <span className="rounded text-sm text-neutral-400">
          {cards?.length}
        </span>
      </div>
      <div
        className={`min-h-full gap-4 px-2 max-h-96 overflow-y-auto scrollbar-hide w-full transition-colors ${isDragging ? "bg-neutral-800/50" : "bg-neutral-800/0"
          }`}
      >
        <SortableContext items={cards.map((c: any) => c.id)}>
          {cards && cards.length > 0 && cards.map((c: any) => {
            return <Card board={currBoard} key={c.id} priority={c.priority} title={c.title} id={c.id} column={column} card={c}
              //  handleDragStart={handleDragStart} 
              updateCardInBoard={updateCardInBoard} />;
          })}
        </SortableContext>
        {/* <AddCard column={column} setCards={setCards} /> */}
      </div>
    </div>
  );
};



export default Column




// import React, { useState } from 'react'
// import Card from './CustomCard'
// import axios from 'axios'
// import { SortableContext, useSortable } from '@dnd-kit/sortable'
// import { CSS } from '@dnd-kit/utilities'
// import DropIndicator from './DropIndicator'

// // @ts-ignore
// const Column = ({ title, headingColor, column, cards, updateCardInBoard }) => {
//   const [active, setActive] = useState(false)

//   const { attributes, setNodeRef, listeners, transform, transition, isDragging } = useSortable({
//     id: column.id,
//     data: {
//       type: 'column',
//       columnId: column.id,
//     },
//   })

//   const handleDragEnd = async (e: any) => {
//     const cardId = e.dataTransfer.getData('cardId')
//     const newColumnId = e.dataTransfer.getData('newColumnId')

//     if (!cardId) return

//     const draggedCard = cards.find((c: any) => c.id === cardId)
//     const targetColumn = newColumnId || column.id

//     // Update card in backend
//     try {
//       const response = await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/card/${draggedCard.id}`, {
//         columnId: targetColumn,
//       })
//       const updatedCard = response.data
//       updateCardInBoard(updatedCard)
//     } catch (error) {
//       console.error('Error updating card:', error)
//     }
//   }

//   return (
//     <div className={`w-64 py-4 shrink-0 ${isDragging && 'opacity-50 h-full border-2'}`} ref={setNodeRef} {...attributes}>
//       <div className="mb-3 flex items-center justify-between" {...listeners}>
//         <div className="flex items-center gap-2">
//           <p className={`w-4 h-4 rounded-full ${headingColor}`}></p>
//           <h3 className="tracking-widest font-semibold text-slate-800 dark:text-slate-400">{title.toUpperCase()}</h3>
//         </div>
//         <span className="rounded text-sm text-neutral-400">{cards?.length}</span>
//       </div>
//       <div className={`min-h-full px-2 max-h-96 overflow-y-auto scrollbar-hide w-full transition-colors ${isDragging ? 'bg-neutral-800/50' : 'bg-neutral-800/0'}`}>
//         <SortableContext items={cards.map((c: any) => c.id)}>
//           {cards.map((card: any) => (
//             <Card key={card.id} card={card} column={column} handleDragEnd={handleDragEnd} updateCardInBoard={updateCardInBoard} />
//           ))}
//         </SortableContext>
//       </div>
//     </div>
//   )
// }

// export default Column





// import React from 'react';
// import { DndContext, closestCenter } from '@dnd-kit/core';
// import {
//   SortableContext,
//   useSortable,
//   arrayMove,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { useState } from 'react';
// import Card from './CustomCard';

// const Column = ({ title, column, cards, updateCardInBoard, headingColor }: any) => {


//   if (!column) {
//     return null;
//   }


//   const [localCards, setLocalCards] = useState(cards);

//   // Handles reordering cards in the same column
//   const handleDragEnd = (event: any) => {
//     const { active, over } = event;
//     if (active.id !== over.id) {
//       setLocalCards((prevCards: any) => {
//         const oldIndex = prevCards.findIndex((c) => c.id === active.id);
//         const newIndex = prevCards.findIndex((c) => c.id === over.id);
//         const newOrder = arrayMove(prevCards, oldIndex, newIndex);

//         updateCardInBoard(newOrder);
//         return newOrder;
//       });
//     }
//   };

//   return (
//     <div className="column w-64 py-4 shrink-0">
//       <div className="mb-3 flex items-center justify-between">
//         <div className='flex items-center gap-2'>
//           <p className={`w-4 h-4 rounded-full ${headingColor}`}></p>
//           <h3 className={`tracking-widest font-semibold text-slate-800 dark:text-slate-400`}>{title.toUpperCase()}</h3>
//         </div>
//         <span className="rounded text-sm text-neutral-400">
//           {cards?.length}
//         </span>
//       </div>
//       <div className='flex flex-col gap-4'>
//         <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//           <SortableContext items={localCards} strategy={verticalListSortingStrategy}>
//             {localCards.map((card: any) => (
//               <SortableCard key={card.id} card={card} updateCardInBoard={updateCardInBoard} column={column} />
//             ))}
//           </SortableContext>
//         </DndContext>
//       </div>
//     </div>
//   );
// };

// // Sortable card component
// const SortableCard = ({ card, column, updateCardInBoard }: any) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
//     id: card.id,
//   });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <Card title={card.title} id={card.id} priority={card.priority} column={column} card={card} updateCardInBoard={updateCardInBoard} />
//     </div>
//   );
// };

// export default Column;
