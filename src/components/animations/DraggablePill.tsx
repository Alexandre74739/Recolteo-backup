"use client";

import { motion } from "motion/react";

interface DraggablePillProps {
  label: string;
  color: string;
  rotate: number;
  index: number;
}

export default function DraggablePill({
  label,
  color,
  rotate,
  index,
}: DraggablePillProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.1, zIndex: 50, rotate: 0 }}
      initial={{ y: -120, opacity: 0, rotate }}
      whileInView={{ y: 0, opacity: 1, rotate }}
      whileHover={{ scale: 1.04 }}
      transition={{
        y: { type: "spring", stiffness: 260, damping: 14, delay: index * 0.12 },
        opacity: { duration: 0.2, delay: index * 0.12 },
        scale: { duration: 0.18 },
      }}
      viewport={{ once: true, amount: 0.2 }}
      style={{ zIndex: index, position: "relative" }}
      className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-full font-bold text-base whitespace-nowrap shadow-md cursor-grab active:cursor-grabbing select-none ${color}`}
    >
      <span className="w-2.5 h-2.5 rounded-full bg-current opacity-50 shrink-0" />
      {label}
    </motion.div>
  );
}
