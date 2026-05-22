'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const announcements = [
  'END OF SEASON SALE: UP TO 60% OFF DECOR & FURNITURE',
  'FREE SHIPPING ON ORDER VALUES ABOVE ₹49,999 | USE CODE: WELCOMEWE',
  'NEW SEASON LINEN ARRIVALS - EXPLORE SUSTAINABLY SOURCE BELGIAN FLAX',
  'HURRY! 10% EXTRA DISCOUNT ON CRED CARDS | T&C APPLY'
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#f6f4f0] text-[#111111] text-[10px] md:text-xs font-semibold py-2.5 px-4 tracking-[0.15em] border-b border-[#e5e5e5] select-none">
      <div className="max-w-7xl mx-auto relative flex justify-center items-center h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="text-center w-full uppercase"
          >
            {announcements[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
