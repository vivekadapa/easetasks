import React from 'react'
import { motion } from "framer-motion";


const DropIndicator = ({ beforeId, column }: any) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};


const Card = ({ title, id, column, handleDragStart, priority }: any) => {

  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e: Event) => handleDragStart(e, { title, id, column })}
        className="cursor-grab flex flex-col items-start gap-3 justify-between rounded text-neutral-700 dark:text-neutral-100 border  border-neutral-700 bg-neutral-200 dark:bg-[#2b2c37] p-3 active:cursor-grabbing"
      >

        <p className="text-md">{title.length > 20 ? title.slice(0, 20) + "..." : title}</p>

        {/* <img src="" alt="" /> */}


        <div className='flex w-full justify-between items-center'>
          <p className='text-sm text-[#828fa3]'>0 of 0 subtasks</p>
          <img src={`./${priority}.svg`} className='w-6 h-6' alt="" />
        </div>
        {/* <button onClick={() => console.log("hello world")}>more</button> */}
      </motion.div>
    </>
  );
};


export default Card