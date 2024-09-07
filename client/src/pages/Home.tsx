import { useEffect } from "react";
import Board from "@/components/Board";
import { useNavigate } from "react-router-dom";

export const CustomKanban = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate('/login')
    }
  }, [])

  return (
    <div className="my-8 h-[92vh] w-full text-neutral-50">
      <Board />
    </div>
  );
};

