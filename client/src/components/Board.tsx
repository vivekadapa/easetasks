import { useEffect, useState } from 'react';
import Column from './Column';
import AddBoard from './AddBoard';
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';
import { closestCorners, DndContext, DragEndEvent, DragMoveEvent, DragStartEvent, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

const Board = () => {
  const [columns, setColumns] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<any | null>(null);
  const value = useAuth();
  const board = value.currBoard;

  const token = localStorage.getItem("token")
  useEffect(() => {
    if (board && board.columns) {
      setColumns(board?.columns);
    }
  }, [board]);

  const updateCardInBoard = async (currBoard: any) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/board/${currBoard?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      value.setCurrBoard(response.data);
    } catch (error) {
      console.error('Error updating card in board:', error);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log(activeId)
    setActiveId(active.id);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeIndex = columns.findIndex(col => col.id === active.id);
    const overIndex = columns.findIndex(col => col.id === over.id);

    if (activeIndex !== overIndex) {
      const newColumns = arrayMove(columns, activeIndex, overIndex);

      setColumns(newColumns);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("handle drag end called")
    const { active, over } = event;
    console.log(active)
    console.log(over)
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);

      const newColumns = arrayMove(columns, oldIndex, newIndex);
      console.log(newColumns)
      setColumns(newColumns);
      // Optionally: You can make an API call to persist the new order
    }

    setActiveId(null);
  };






  return (
    <div className="flex min-h-full overflow-x-auto scrollbar-hide overflow-y-hidden min-w-full gap-6 p-12">
      <div className="flex min-h-full overflow-x-auto scrollbar-hide overflow-y-hidden gap-6 mt-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={columns.map(column => column.id)} strategy={verticalListSortingStrategy}>
            {columns.length > 0 &&
              columns.map((c: any, index: number) => (
                <Column key={c?.id} title={c?.title} column={c} headingColor={tailwindColors[index]} cards={c.cards} updateCardInBoard={updateCardInBoard} />
              ))
            }
          </SortableContext>
        </DndContext>
        <div className='flex pr-24 mt-8 w-72 rounded-xl justify-center items-center max-h-full hover:bg-gray-100 dark:hover:bg-gray-500 cursor-pointer px-8'>
          <AddBoard board={board} existingTitle={board?.title} existingColumns={columns} isEditMode={true} buttonTitle='Add Column' />
        </div>
      </div>
    </div>
  );
};

const tailwindColors = [
  "bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-400", "bg-teal-400",
  "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500"
];

export default Board;


