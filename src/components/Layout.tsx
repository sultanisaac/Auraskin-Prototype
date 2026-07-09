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
    <div className="min-h-screen bg-background font-sans text-text flex flex-col justify-between w-full relative">
      <ScrollToHash />
      <div>
        <TopBar />
        <Header />
        <main className="overflow-x-hidden w-full relative">
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
        <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-[0_10px_35px_rgba(15,76,92,0.15)] z-50 p-3 flex items-center gap-3">
          <a 
            href="https://wa.me/6281288882828" 
            target="_blank" 
            rel="noreferrer"
            className="w-12 h-12 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-100 active:scale-95 transition-all shrink-0"
            aria-label="WhatsApp Chat"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
          <Link to="/book-consultation" className="flex-1">
            <button className="w-full bg-primary text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md hover:bg-primary/95 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Book Free Consultation
            </button>
          </Link>
        </div>
      )}
      
      {/* Padding on mobile to prevent content from hiding behind mobile bar */}
      {!isBookingPage && <div className="h-28 md:hidden w-full"></div>}
    </div>
  );
};
