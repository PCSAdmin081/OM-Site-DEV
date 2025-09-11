"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LoadingSplash({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame: number;
    function tick() {
      setProgress((p) => {
        if (p >= 100) {
          cancelAnimationFrame(frame);
          setTimeout(() => setDone(true), 500);
          return 100;
        }
        return p + 1;
      });
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (done) {
      // call parent when finished loading
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [done, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className="fixed inset-0 z-[99999] flex items-end justify-start bg-black"
        >
          {/* Rising water */}
          <motion.div
            initial={{ height: "0%" }}
            animate={{ height: `${progress}%` }}
            transition={{ ease: "easeInOut", duration: 1, repeat: Infinity, repeatType: "mirror" }}
            className="absolute bottom-0 left-0 right-0 bg-blue-500/80"
          />

          {/* Loading percentage bottom-left */}
          <div className="relative z-10 m-6 text-white font-bold text-2xl">
            {progress}%
          </div>
        </motion.div>
      )}

      {done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[99998] flex flex-col items-center justify-center bg-black"
        >
          <Image
            src="/OverlyLogo.svg"
            alt="Overly logo"
            width={200}
            height={80}
            className="invert mb-6"
            priority
          />
          <Button onClick={onComplete}>Enter Website</Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}