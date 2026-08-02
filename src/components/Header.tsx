"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Sparkles, Menu, X, Calendar, Phone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location = { pathname, search: searchParams.toString(), hash: '' };
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { label: 'Treatments', path: '/treatments' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Our Team', path: '/our-team' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <header className={`sticky top-0 w-full transition-all duration-300 ${isOpen ? 'z-[100]' : 'z-50'} ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 relative z-[60]">
          <img src="/logo.png" alt="AuraSkin Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-md shadow-sm" />
          <span className="font-serif text-xl md:text-2xl font-bold text-primary">AuraSkin</span>
          <span className="ml-2 px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] md:text-[10px] font-bold tracking-widest uppercase rounded shadow-sm">Prototype</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
          {navItems.map((item) => (
            <Link key={item.label} href={item.path} className="text-gray-600 hover:text-primary transition font-medium text-sm lg:text-base">
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center space-x-4 lg:space-x-5">
          <Link href="/book-consultation">
            <Button variant="primary" className="py-2.5 px-4 lg:px-6 text-sm">
              Book Consultation
            </Button>
          </Link>
        </div>

        {/* Hamburger Menu Icon */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-primary focus:outline-none relative z-[60] active:scale-95 transition-transform"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Fullscreen Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '10%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '10%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 bg-white z-[110] flex flex-col md:hidden"
          >
            {/* Fullscreen Menu Header */}
            <div className="flex justify-between items-center px-4 py-4 border-b border-gray-100">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <img src="/logo.png" alt="AuraSkin Logo" className="w-8 h-8 object-contain rounded-md shadow-sm" />
                <span className="font-serif text-xl font-bold text-primary">AuraSkin</span>
                <span className="ml-2 px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] font-bold tracking-widest uppercase rounded shadow-sm">Prototype</span>
              </Link>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-primary focus:outline-none active:scale-95 transition-transform"
                aria-label="Close Menu"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            
            {/* Fullscreen Menu Content */}
            <div className="flex flex-col flex-1 px-6 py-8 overflow-y-auto">
              <div className="flex flex-col space-y-6 flex-1">
                {navItems.map((item) => (
                  <Link key={item.label} 
                    href={item.path} 
                    className="text-2xl font-serif font-medium text-gray-800 hover:text-primary transition-colors flex items-center justify-between border-b border-gray-50 pb-4"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 space-y-4">
                <Link href="/book-consultation" className="block w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full py-4 text-base font-bold shadow-lg">
                    Book Free Consultation
                  </Button>
                </Link>
                <a href="tel:+6281288882828" className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-gray-50 text-gray-700 font-bold text-base hover:bg-gray-100 transition-colors border border-gray-200">
                  <Phone className="w-5 h-5 text-primary" />
                  Call Clinic
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
