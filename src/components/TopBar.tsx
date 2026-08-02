"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export const TopBar = () => (
  <div className="bg-secondary text-white text-center py-2 px-4 text-sm font-medium">
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
      12 consultation slots available this week •{' '}
      <Link href="/book-consultation" className="underline cursor-pointer hover:text-white/95 transition">
        Book Now
      </Link>
    </motion.span>
  </div>
);
