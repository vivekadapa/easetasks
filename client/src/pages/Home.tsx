import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import Board from "@/components/Board";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";

export const CustomKanban = () => {

  const value = useAuth();
  const { user, verifyToken } = value;
  const navigate = useNavigate();
  console.log(user)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate('/login')
    }
  }, [])

  return (
    <div className="h-[88vh] text-neutral-50">
      <Board />
    </div>
  );
};

