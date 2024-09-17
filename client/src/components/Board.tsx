import React, { useEffect, useState } from 'react';
import Column from './Column';
import AddBoard from './AddBoard';
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';


// type = {
//   id: string,
//   title: string,
//   cards: {
//     id: string,
//     title: string
//   }[]
// }

const Board = () => {
  const [columns, setColumns] = useState<any[]>([]);
  const value = useAuth();
  const board = value.currBoard;

  useEffect(() => {
    if (board && board.columns) {
      console.log("inside if of board useeffect")
      console.log(JSON.stringify(board.columns, null, 2))
      setColumns(board?.columns);
    }
  }, [board]);

  const updateCardInBoard = async (currBoard: any) => {
    try {
      console.log(currBoard?.id)
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/board/${currBoard?.id}`);
      value.setCurrBoard(response.data);
    } catch (error) {
      console.error('Error updating card in board:', error);
    }
  };

  console.log("Board refetched")

  return (
    <div className="flex min-h-full overflow-x-auto scrollbar-hide overflow-y-hidden min-w-full gap-4 p-12">
      {
        columns.length > 0 &&
        columns.map((c: any, index: number) => (
          <Column key={c?.id} title={c?.title} column={c} headingColor={tailwindColors[index]} cards={c.cards} updateCardInBoard={updateCardInBoard} />
        ))
      }
      <div className='flex mt-8 w-72 rounded-xl justify-center items-center max-h-full hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer px-8'>
        <AddBoard board={board} existingTitle={board?.title} existingColumns={columns} isEditMode={true} buttonTitle='Add Column' />
      </div>
    </div>
  );
};

const tailwindColors = [
  "bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-400", "bg-teal-400",
  "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"
];

export default Board;


// import React, { useState, useEffect } from 'react';
// import { DndContext, closestCenter } from '@dnd-kit/core';
// import {
//   SortableContext,
//   useSortable,
//   arrayMove,
//   horizontalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import Column from './Column';
// import { useAuth } from '@/context/AuthProvider';
// import axios from 'axios';
// import AddBoard from './AddBoard';

// const Board = () => {
//   const [columns, setColumns] = useState<any[]>([]);
//   const value = useAuth();
//   const board = value.currBoard;

//   useEffect(() => {
//     if (board && board.columns) {
//       console.log("inside if of board useeffect")
//       console.log(JSON.stringify(board.columns, null, 2))
//       setColumns(board?.columns);
//     }
//   }, [board]);

//   const updateCardInBoard = async (currBoard: any) => {
//     try {
//       console.log(currBoard?.id)
//       const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/board/${currBoard?.id}`);
//       value.setCurrBoard(response.data);
//     } catch (error) {
//       console.error('Error updating card in board:', error);
//     }
//   };

//   const handleDragEnd = (event: any) => {
//     const { active, over } = event;
//     if (active.id !== over.id) {
//       setColumns((prevColumns: any) => {
//         const oldIndex = prevColumns.findIndex((col: any) => col.id === active.id);
//         const newIndex = prevColumns.findIndex((col: any) => col.id === over.id);
//         return arrayMove(prevColumns, oldIndex, newIndex);
//       });
//     }
//   };

//   return (
//     <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//       <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
//         <div className="board flex min-h-full overflow-x-auto scrollbar-hide overflow-y-hidden min-w-full gap-4 p-12">
//           {columns.length > 0 && columns.map((column,index) => (
//             <SortableColumn key={column.id} column={column} cards={column.cards} updateCardInBoard={updateCardInBoard} headingColor={tailwindColors[index]} />
//           ))}
//         </div>
//       </SortableContext>
//       <div className='flex mt-8 w-72 rounded-xl justify-center items-center max-h-full hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer px-8'>
//         <AddBoard board={board} existingTitle={board?.title} existingColumns={columns} isEditMode={true} buttonTitle='Add Column' />
//       </div>
//     </DndContext>
//   );
// };

// const tailwindColors = [
//   "bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-400", "bg-teal-400",
//   "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"
// ];

// const SortableColumn = ({ column,headingColor,cards,updateCardInBoard }:any) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
//     id: column.id,
//   });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <Column title={column.title} column={column} cards={cards} updateCardInBoard={updateCardInBoard} headingColor={headingColor} cards={column.cards} />
//     </div>
//   );
// };

// export default Board;
