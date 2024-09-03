import React, { useEffect, useState } from 'react'
import Column from './Column';
import Delete from './Delete';
import { useAuth } from '@/context/AuthProvider';
import axios from 'axios';
import { FiPlus } from "react-icons/fi";

const Board = () => {
  // const [cards, setCards] = useState([]);
  const [columns, setColumns] = useState([]);
  const value = useAuth()
  const user = value.user;
  const board = value.currBoard;
  // const currBoardWColumns = value.currBoardWColumns
  // console.log("board with columns : " + currBoardWColumns)

  // useEffect(() => {
  //   const fetchBoard = async () => {
  //     const response = await axios.request({
  //       url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/board/${board?.id}`,
  //       method: "get",
  //     })
  //     console.log("board " + response.data.columns[0].title)
  //     setColumns(response.data.columns)
  //   }
  //   if (board && board.id) {
  //     fetchBoard()
  //   }
  // }, [board])

  useEffect(() => {
    const fetchBoard = async () => {
      const response = await axios.request({
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/column/${board?.id}`,
        method: "get",
      })
      console.log(response)
      setColumns(response.data)
    }
    if (board && board.id) {
      fetchBoard()
    }
  }, [board])
  return (
    <div className="flex min-h-full min-w-full gap-3 p-12">
      {
        columns.length > 0 ? (
          columns.map((c: any) => (
            <Column key={c?.id} title={c?.title} column={c?.id} headingColor={"text-neutral-500"} cards={c?.cards} />
          ))
        ) : ("")
      }
      {/* <Column
        title="Backlog"
        column="backlog"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In progress"
        column="doing"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-emerald-200"
        cards={cards}
        setCards={setCards}
      /> */}
      <div className='flex items-center min-h-full hover:bg-gray-500 cursor-pointer px-8'><FiPlus className='text-xl mr-2' />Add column</div>
      {/* <Delete setCards={setCards} /> */}
    </div >
  );
};



const DEFAULT_CARDS = [
  // BACKLOG
  { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
  { title: "SOX compliance checklist", id: "2", column: "backlog" },
  { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
  { title: "Document Notifications service", id: "4", column: "backlog" },
  // TODO
  {
    title: "Research DB options for new microservice",
    id: "5",
    column: "todo",
  },
  { title: "Postmortem for outage", id: "6", column: "todo" },
  { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },

  // DOING
  {
    title: "Refactor context providers to use Zustand",
    id: "8",
    column: "doing",
  },
  { title: "Add logging to daily CRON", id: "9", column: "doing" },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    column: "done",
  },
];

export default Board