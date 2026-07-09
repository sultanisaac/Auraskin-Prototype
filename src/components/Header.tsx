import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Calendar, Phone, Smartphone, ShieldCheck } from 'lucide-react';
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
    <header className={`sticky top-0 w-full transition-all duration-300 ${isOpen ? 'z-[100]' : 'z-50'} ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 relative z-[60]">
          <img src="/logo.png" alt="AuraSkin Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-md shadow-sm" />
          <span className="font-serif text-xl md:text-2xl font-bold text-primary">AuraSkin</span>
          <span className="ml-2 px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] md:text-[10px] font-bold tracking-widest uppercase rounded shadow-sm">Prototype</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
          {navItems.filter(item => item.label !== 'Home').map((item) => (
            <Link key={item.label} to={item.path} className="text-gray-600 hover:text-primary transition font-medium text-sm lg:text-base">
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center space-x-4 lg:space-x-5">
          <a href="https://admin-auraskin-prototype.vercel.app/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary transition flex items-center gap-1.5 font-medium text-sm" title="Admin Demo">
            <ShieldCheck className="w-4 h-4" /> <span className="hidden lg:inline">Admin</span>
          </a>
          <a href="/Auraskin-Prototype.apk" download className="text-gray-500 hover:text-primary transition flex items-center gap-1.5 font-medium text-sm" title="Get App">
            <Smartphone className="w-4 h-4" /> <span className="hidden lg:inline">App</span>
          </a>
          <Link to="/book-consultation">
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

      {/* Mobile Dropdown Navigation */}
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
            {/* Content Dropdown */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white shadow-2xl z-[50] flex flex-col p-6 md:hidden border-t border-gray-100 max-h-[85vh] overflow-y-auto rounded-b-3xl"
            >
              <div className="flex flex-col space-y-4 flex-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.label} 
                    to={item.path} 
                    className="text-lg font-medium text-gray-800 hover:text-primary transition-colors py-2.5 border-b border-gray-50 flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/60 opacity-0 hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
                
                <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col space-y-2">
                  <a href="/Auraskin-Prototype.apk" download className="flex items-center text-base font-medium text-gray-700 hover:text-primary transition-colors py-2.5">
                    <div className="bg-primary/5 p-2 rounded-lg text-primary mr-3"><Smartphone className="w-5 h-5"/></div>
                    Get Mobile App (APK)
                  </a>
                  <a href="https://admin-auraskin-prototype.vercel.app/" target="_blank" rel="noreferrer" className="flex items-center text-base font-medium text-gray-700 hover:text-primary transition-colors py-2.5">
                    <div className="bg-primary/5 p-2 rounded-lg text-primary mr-3"><ShieldCheck className="w-5 h-5"/></div>
                    Open Admin Demo
                  </a>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <a href="tel:+6281288882828" className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gray-50 text-gray-700 font-bold text-sm hover:bg-gray-100 transition-colors">
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
