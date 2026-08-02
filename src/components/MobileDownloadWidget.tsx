"use client";

import { Smartphone, Download, X } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileDownloadWidget() {
  const [isNative, setIsNative] = useState(true); // Default true to avoid flash
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const checkNative = Capacitor.isNativePlatform();
    setIsNative(checkNative);
    if (!checkNative) {
      // Delay visibility slightly to ensure smooth entry after page load
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (isNative) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && !isDismissed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 left-0 right-0 z-50 md:hidden flex justify-center px-4 pointer-events-none"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-2xl flex items-center p-2 pr-3 pointer-events-auto w-full max-w-sm relative overflow-hidden group">
              {/* Glossy overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-2.5 rounded-xl mr-3 shrink-0 shadow-md">
                <Smartphone className="w-6 h-6" />
              </div>
              
              <div className="flex flex-col mr-2 shrink">
                <span className="text-[13px] font-bold text-gray-900 leading-tight tracking-tight">AuraSkin Admin APP</span>
                <span className="text-[11px] text-gray-500 font-medium">Experience Native Speed</span>
              </div>
              
              <a
                href="/Admin-Auraskin-Prototype.apk"
                download="Admin-Auraskin-Prototype.apk"
                onClick={() => setIsDismissed(true)}
                className="ml-auto bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95"
              >
                GET APP
                <Download className="w-3.5 h-3.5" />
              </a>
              
              <button 
                onClick={() => setIsDismissed(true)}
                className="ml-2 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDismissed && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDismissed(false)}
            className="fixed bottom-6 right-6 z-50 md:hidden bg-primary text-white p-3.5 rounded-full shadow-xl flex items-center justify-center border border-white/20 transition-all"
            aria-label="Show Download App Banner"
          >
            <Download className="w-5 h-5 drop-shadow-md" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
