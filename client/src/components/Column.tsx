import React, { useEffect, useState } from 'react'
import AddCard from './AddCard';
import Card from './CustomCard';
import axios from 'axios';
import Loader from './Loader';
import { useAuth } from '@/context/AuthProvider';


//@ts-ignore
const Column = ({ title, headingColor, column, cards, updateCardInBoard }) => {
  if (!column) {
    return null;
  }
  const [active, setActive] = useState(false);


  const value = useAuth()
  const currBoard = value.currBoard
  //@ts-ignore
  const handleDragStart = (e, card) => {
    console.log(card.id)
    e.dataTransfer.setData("cardId", card.id);
  };
  //@ts-ignore

  const handleDragEnd = async (e: any) => {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      console.log("helloworld")
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      let insertAtIndex;
      const moveToBack = before === "-1";

      if (moveToBack) {
        insertAtIndex = copy.length; // Move to the last index
        copy.push(cardToTransfer);
      } else {
        insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === -1) return; // Prevent inserting at invalid index
        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      // Ensure the correct order is sent to the backend
      try {
        console.log(insertAtIndex)
        console.log(copy.length)
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/card/${cardToTransfer.id}`, {
          columnId: column.id, // Update column ID
          order: insertAtIndex !== undefined ? insertAtIndex : copy.length - 1, // Update order if needed
        });
        const updatedCard = response.data;
        console.log(updatedCard)
        updateCardInBoard(currBoard); // Call the updateCardInBoard function
      } catch (error) {
        console.error('Error updating card:', error);
      }
    }
  };


  const handleDragOver = (e: Event) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };
  //@ts-ignore
  const clearHighlights = (els) => {
    const indicators = els || getIndicators();
    //@ts-ignore
    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: Event) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };
  //@ts-ignore
  const getNearestIndicator = (e: Event, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      //@ts-ignore
      (closest, child) => {
        const box = child.getBoundingClientRect();
        //@ts-ignore
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    // console.log(el)

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };
  //@ts-ignore
  const handleDragLeave = () => {
    //@ts-ignore
    clearHighlights();
    setActive(false);
  };

  //@ts-ignore

  // const filteredCards = cards.filter((c) => c.columnId === column);

  return (
    <div className="w-64 py-4 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <div className='flex items-center gap-2'>
          <p className={`w-4 h-4 rounded-full ${headingColor}`}></p>
          <h3 className={`tracking-widest font-semibold text-slate-800 dark:text-slate-400`}>{title.toUpperCase()}</h3>
        </div>
        <span className="rounded text-sm text-neutral-400">
          {cards?.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`min-h-full max-h-96 overflow-y-auto scrollbar-hide w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"
          }`}
        >
          
        {cards && cards.length > 0 && cards.map((c: any) => {
          return <Card key={c.id} priority={c.priority} title={c.title} id={c.id} column={column} card={c} handleDragStart={handleDragStart} updateCardInBoard={updateCardInBoard} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        {/* <AddCard column={column} setCards={setCards} /> */}
      </div>
    </div>
  );
};

const DropIndicator = ({ beforeId, column }: any) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};



export default Column

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
