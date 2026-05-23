import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="text-secondary w-8 h-8 animate-pulse" />
          <span className="font-serif text-2xl font-bold text-primary">AuraSkin</span>
          <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold tracking-widest uppercase rounded shadow-sm">Prototype</span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link to="/#treatments" className="text-gray-600 hover:text-primary transition font-medium">Treatments</Link>
          <Link to="/#results" className="text-gray-600 hover:text-primary transition font-medium">Results</Link>
          <Link to="/#about" className="text-gray-600 hover:text-primary transition font-medium">Why Us</Link>
          <Link to="/pricing" className="text-gray-600 hover:text-primary transition font-medium">Pricing</Link>
        </nav>
        
        <Link to="/book-consultation" className="hidden md:inline-block">
          <Button variant="primary">
            Book Consultation
          </Button>
        </Link>
      </div>
    </header>
  );
};
