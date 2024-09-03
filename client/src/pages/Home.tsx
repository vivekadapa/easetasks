import { useEffect } from "react";
// import { FiPlus, FiTrash } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { FaFire } from "react-icons/fa";
import Board from "@/components/Board";
// import { useAuth } from "@/context/AuthProvider";
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
    <div className="my-8 h-[92vh] text-neutral-50">
      <Board />
    </div>
  );
};

