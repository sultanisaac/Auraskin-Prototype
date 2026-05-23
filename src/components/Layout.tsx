import { Outlet, Link, useLocation } from 'react-router-dom';
import { MessageCircle, Phone, Calendar } from 'lucide-react';
import { TopBar } from './TopBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToHash } from './ScrollToHash';

export const Layout = () => {
  const location = useLocation();
  const isBookingPage = location.pathname === '/book-consultation';

  return (
    <div className="min-h-screen bg-background font-sans text-text flex flex-col justify-between">
      <ScrollToHash />
      <div>
        <TopBar />
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      <Footer />
      
      {/* Floating WhatsApp - Desktop Only */}
      <a 
        href="https://wa.me/6281288882828" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-transform hover:scale-110 z-50 hidden md:flex items-center justify-center"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
      </a>

      {/* Mobile Sticky Action Bar - Hidden on Booking page to avoid duplication */}
      {!isBookingPage && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 flex">
          <a href="tel:+6281288882828" className="flex-1 py-4 flex flex-col items-center justify-center gap-1 font-medium text-gray-700 border-r border-gray-200 active:bg-gray-50">
            <Phone className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Call Us</span>
          </a>
          <Link to="/book-consultation" className="flex-1 py-4 flex flex-col items-center justify-center gap-1 font-bold bg-primary text-white active:bg-primary/90">
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-wider">Book Now</span>
          </Link>
        </div>
      )}
      
      {/* Padding on mobile to prevent content from hiding behind mobile bar */}
      {!isBookingPage && <div className="h-20 md:hidden bg-gray-900 w-full"></div>}
    </div>
  );
};
