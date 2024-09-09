import React, { useEffect, useState } from 'react'
import AddCard from './AddCard';
import Card from './CustomCard';
import axios from 'axios';
import Loader from './Loader';


//@ts-ignore

const Column = ({ title, headingColor, column, cards, updateCardInBoard }) => {
  if (!column) {
    return null;
  }
  const [active, setActive] = useState(false);
  //@ts-ignore

  const handleDragStart = (e, card) => {
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
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";
      let insertAtIndex
      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      // Update card on the server after it's moved
      try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/card/${cardToTransfer.id}`, {
          columnId: column, // Update column ID
          order: insertAtIndex !== undefined ? insertAtIndex : copy.length - 1, // Update order if needed
        });
        const updatedCard = response.data;
        updateCardInBoard(updatedCard); // Call the updateCardInBoard function
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