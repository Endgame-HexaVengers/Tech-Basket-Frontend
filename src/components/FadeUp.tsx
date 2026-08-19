"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";


interface FadeUpProps {
  children: ReactNode;
  delay?: number; 
  className?: string;
}

export default function FadeUp({ children, delay = 0, className = "" }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: "easeOut" }}
      className={className}>
      {children}
    </motion.div>
  );
}