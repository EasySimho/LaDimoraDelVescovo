"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

/**
 * Una sola transizione, sempre la stessa: cross-fade con 8px di scorrimento.
 * `key={pathname}` la fa ripartire a ogni cambio pagina; `motion` disattiva
 * l'animazione da solo se il sistema ha "riduci movimento".
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
