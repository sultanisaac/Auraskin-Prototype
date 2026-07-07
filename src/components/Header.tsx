import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Calendar, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Treatments', path: '/#treatments' },
    { label: 'Results', path: '/#results' },
    { label: 'Reviews', path: '/#reviews' },
    { label: 'Pricing', path: '/pricing' }
  ];

  return (
    <header className={`sticky top-0 transition-all duration-300 ${isOpen ? 'z-[100]' : 'z-50'} ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 relative z-[60]">
          <img src="/logo.png" alt="AuraSkin Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-md shadow-sm" />
          <span className="font-serif text-xl md:text-2xl font-bold text-primary">AuraSkin</span>
          <span className="ml-2 px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] md:text-[10px] font-bold tracking-widest uppercase rounded shadow-sm">Prototype</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.filter(item => item.label !== 'Home').map((item) => (
            <Link key={item.label} to={item.path} className="text-gray-600 hover:text-primary transition font-medium">
              {item.label}
            </Link>
          ))}
        </nav>
        
        <Link to="/book-consultation" className="hidden md:inline-block">
          <Button variant="primary">
            Book Consultation
          </Button>
        </Link>

        {/* Hamburger Menu Icon */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-primary focus:outline-none relative z-[60] active:scale-95 transition-transform"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[40] md:hidden"
            />
            {/* Content Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ backgroundColor: '#ffffff', height: '100vh' }}
              className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-[340px] shadow-2xl z-[50] flex flex-col p-6 pt-24 md:hidden border-l border-gray-100"
            >
              <div className="flex flex-col space-y-5 flex-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.label} 
                    to={item.path} 
                    className="text-lg font-medium text-gray-800 hover:text-primary transition-colors py-2 border-b border-gray-50 flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/60 opacity-0 hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
              <div className="space-y-4 mt-auto">
                <a href="tel:+6281288882828" className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                  Contact Clinic
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
