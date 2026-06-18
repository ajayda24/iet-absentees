"use client";

import { motion } from "framer-motion";
import { useStep } from "@/context/StepContext";
import { useSwipe } from "@/hooks/useSwipe";

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export default function StepContainer({ children }) {
  const { currentStep, nextStep, prevStep } = useStep();

  useSwipe(nextStep, prevStep);

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        key={currentStep}
        custom={1}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
