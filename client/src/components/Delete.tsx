import  { useState } from 'react'
import { FaFire } from 'react-icons/fa'
import { FiTrash } from 'react-icons/fi'

const Delete = ({ setCards }: any) => {
    const [active, setActive] = useState(false);

    //@ts-ignore
    const handleDragOver = (e) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    //@ts-ignore
    const handleDragEnd = (e) => {
        const cardId = e.dataTransfer.getData("cardId");
        //@ts-ignore

        setCards((pv) => pv.filter((c) => c.id !== cardId));

        setActive(false);
    };

    return (
        <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${active
                ? "border-red-800 bg-red-800/20 text-red-500"
                : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
                }`}
        >
            {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
        </div>
    );
};


export default Delete