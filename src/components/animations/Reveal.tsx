"use client";

import { motion } from "motion/react";

interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
}

export default function Reveal({ children, delay = 0 }: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
