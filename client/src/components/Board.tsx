import { useEffect, useState } from 'react';
import Column from './Column';
import AddBoard from './AddBoard';
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragCancelEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import React from 'react';

const Board = () => {
  const [columns, setColumns] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<any | null>(null);
  const [initialColumns, setInitialColumns] = useState<any[]>([]);
  const value = useAuth();
  const board = value.currBoard;
  const sidebarStatus = value.sidebarOff;

  useEffect(() => {

    const fetchBoardDetails = async (board: any) => {
      try {
        const response = await axios.request({
          url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/board/${board.id}`,
          method: "GET"
        })
        if (response.status === 200) {
          setColumns(response.data.columns);
          setInitialColumns(response.data.columns);
        }
      } catch (error) {
        console.log(activeId)
        console.log(error)
      }
    }

    if (board) {
      fetchBoardDetails(board)
    }


  }, [board]);

  const updateCardInBoard = async (currBoard: any) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/board/${currBoard?.id}`, {
        withCredentials: true
      });
      value.setCurrBoard(response.data);
    } catch (error) {
      console.error('Error updating card in board:', error);
    }
  };

  const handleUpdateCard = async (cardId: any, updatedColumnId: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/card/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // priority,
          columnId: updatedColumnId, // Send the new status (column ID)
          // subtasks: subtasks.map((subtask: any) => ({ id: subtask.id, title: subtask.title, isComplete: subtask.isComplete })), // Ensure subtasks are included if needed
        }),
        credentials: 'include'
      });

      // if (response.ok) {
      //     // const updatedCard = await response.json();
      //     updateCardInBoard(currBoard);
      // }
      if (!response.ok) {
        throw new Error('Failed to update card');
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragCancel = (event: DragCancelEvent) => {
    console.log(event)
    setColumns(initialColumns);
    setActiveId(null);
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === 'card';
    const isOverACard = over.data.current?.type === 'card';

    if (!isActiveACard) return;

    // Dropping a Card over another Card
    if (isActiveACard && isOverACard) {
      const activeColumn = columns.find(col =>
        col.cards.some((card: any) => card.id === activeId)
      );
      const overColumn = columns.find(col =>
        col.cards.some((card: any) => card.id === overId)
      );

      if (!activeColumn || !overColumn) return;

      const activeCardIndex = activeColumn.cards.findIndex(
        (card: any) => card.id === activeId
      );
      const overCardIndex = overColumn.cards.findIndex(
        (card: any) => card.id === overId
      );

      if (activeColumn === overColumn) {
        // Same column card reorder
        const newCards = arrayMove(
          activeColumn.cards,
          activeCardIndex,
          overCardIndex
        );

        const newColumns = columns.map(col => {
          if (col.id === activeColumn.id) {
            return { ...col, cards: newCards };
          }
          return col;
        });

        setColumns(newColumns);
      } else {
        // Moving card to different column
        await handleUpdateCard(active.id, overColumn.id)
        const newColumns = columns.map(col => {
          if (col.id === activeColumn.id) {
            return {
              ...col,
              cards: col.cards.filter((card: any) => card.id !== activeId)
            };
          }
          if (col.id === overColumn.id) {
            const newCards = [...col.cards];
            newCards.splice(overCardIndex, 0, activeColumn.cards[activeCardIndex]);
            return { ...col, cards: newCards };
          }
          return col;
        });

        setColumns(newColumns);
      }
    }

    // Dropping a Card over a Column
    const isOverAColumn = over.data.current?.type === 'column';

    if (isActiveACard && isOverAColumn) {
      const activeColumn = columns.find(col =>
        col.cards.some((card: any) => card.id === activeId)
      );
      const overColumn = columns.find(col => col.id === overId);

      if (!activeColumn || !overColumn) return;

      const activeCardIndex = activeColumn.cards.findIndex(
        (card: any) => card.id === activeId
      );

      const newColumns = columns.map(col => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            cards: col.cards.filter((card: any) => card.id !== activeId)
          };
        }
        if (col.id === overColumn.id) {
          return {
            ...col,
            cards: [...col.cards, activeColumn.cards[activeCardIndex]]
          };
        }
        return col;
      });

      setColumns(newColumns);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;


    if (!over) {
      setColumns(initialColumns);
      setActiveId(null);
      return;
    }

    // Handle column reordering
    if (active.data.current?.type === 'column') {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);

      if (oldIndex !== newIndex) {
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        setColumns(newColumns);
        setInitialColumns(newColumns);
      }
    }

    setActiveId(null);
  };

  return (
    <div className={`${sidebarStatus ? 'ml-16' : 'ml-[20rem]'} px-8 mt-16 transform transition-all duration-300 overflow-y-hidden`}>
      <div className="flex h-full overflow-x-auto scrollbar-hide overflow-y-hidden gap-6 mt-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={columns.map(column => column.id)} strategy={verticalListSortingStrategy}>
            {columns.length > 0 &&
              columns.map((c: any, index: number) => (
                <Column
                  key={c?.id}
                  title={c?.title}
                  column={c}
                  headingColor={tailwindColors[index]}
                  cards={c.cards}
                  updateCardInBoard={updateCardInBoard}
                />
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

export default React.memo(Board);