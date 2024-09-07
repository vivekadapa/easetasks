import React, { useEffect, useState } from 'react';
import Column from './Column';
import AddBoard from './AddBoard';
import { useAuth } from '@/context/AuthProvider';

const Board = () => {
  const [columns, setColumns] = useState<any[]>([]);
  const value = useAuth();
  const board = value.currBoard;

  useEffect(() => {
    if (board && board.columns) {
      console.log(JSON.stringify(board.columns, null, 2))
      setColumns(board?.columns);
    }
  }, [board]);

  console.log("Board refetched")

  return (
    <div className="flex min-h-full overflow-x-auto scrollbar-hide overflow-y-hidden min-w-full gap-4 p-12">
      {
        columns.length > 0 &&
        columns.map((c: any, index: number) => (
          <Column key={c?.id} title={c?.title} column={c?.id} headingColor={tailwindColors[index]} cards={c.cards} />
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
