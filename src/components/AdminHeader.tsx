"use client";

import { Bell, Search, Info, Menu, X, Calendar, CalendarDays, Users } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle: string;
  pendingCount?: number;
}

function HeaderContent({ title, subtitle, pendingCount = 0 }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col shrink-0">
      <header className="h-auto min-h-20 py-4 bg-white border-b border-accent/30 flex items-center justify-between px-4 md:px-8 z-50 relative">
        <div className="flex items-center gap-3">
          <div className="md:hidden relative" ref={mobileMenuRef}>
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 -ml-2 rounded-md hover:bg-accent/20 text-primary"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            {showMobileMenu && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-accent/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <nav className="flex flex-col p-2">
                  <Link href="/admin" onClick={() => setShowMobileMenu(false)} className={cn("flex items-center px-4 py-3 rounded-md font-medium text-sm", pathname === "/admin" || pathname === "/" ? "bg-primary/10 text-primary" : "text-text hover:bg-accent/10")}>
                    <Calendar className="h-4 w-4 mr-3" /> Appointments
                  </Link>
                  <Link href="/admin/calendar" onClick={() => setShowMobileMenu(false)} className={cn("flex items-center px-4 py-3 rounded-md font-medium text-sm", pathname === "/admin/calendar" ? "bg-primary/10 text-primary" : "text-text hover:bg-accent/10")}>
                    <CalendarDays className="h-4 w-4 mr-3" /> Calendar
                  </Link>
                  <Link href="/admin/patients" onClick={() => setShowMobileMenu(false)} className={cn("flex items-center px-4 py-3 rounded-md font-medium text-sm", pathname === "/admin/patients" ? "bg-primary/10 text-primary" : "text-text hover:bg-accent/10")}>
                    <Users className="h-4 w-4 mr-3" /> Patients
                  </Link>
                  <Link href="/admin/notifications" onClick={() => setShowMobileMenu(false)} className={cn("flex items-center px-4 py-3 rounded-md font-medium text-sm", pathname === "/admin/notifications" ? "bg-primary/10 text-primary" : "text-text hover:bg-accent/10")}>
                    <Bell className="h-4 w-4 mr-3" /> Notifications
                  </Link>
                </nav>
              </div>
            )}
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary">{title}</h1>
            <p className="text-text/60 text-xs md:text-sm mt-0.5 md:mt-1 font-medium hidden sm:block">{subtitle}</p>
          </div>
        </div>
      
        <div className="flex items-center gap-3 md:gap-6">

          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-accent/20 transition-colors text-text"
            >
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-accent/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-accent/20 bg-primary/5 flex justify-between items-center">
                  <h3 className="font-bold text-primary">Notifications</h3>
                  {pendingCount > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">{pendingCount} New</span>
                  )}
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {pendingCount > 0 ? (
                    <Link 
                      href="/admin/notifications" 
                      onClick={() => setShowNotifications(false)}
                      className="block p-4 hover:bg-accent/10 border-b border-accent/10 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0"></div>
                        <div>
                          <p className="text-sm font-semibold text-text">Pending Approvals</p>
                          <p className="text-xs text-text/60 mt-1">You have {pendingCount} new appointments awaiting confirmation.</p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-6 text-center text-gray-500 text-sm">
                      No new notifications right now.
                    </div>
                  )}
                </div>
                <Link 
                  href="/admin/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="block w-full text-center p-3 text-xs font-bold text-primary hover:bg-primary/5 transition-colors border-t border-accent/20 uppercase tracking-wider"
                >
                  View All in Notifications Tab
                </Link>
              </div>
            )}
          </div>
          
          <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-secondary/50 flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm">
            <span className="text-sm">AS</span>
          </div>
        </div>
      </header>
    </div>
  );
}

import { Suspense as ReactSuspense } from "react";
export default function Header(props: HeaderProps) {
  return (
    <ReactSuspense fallback={<div className="h-24 w-full bg-white border-b border-accent/30 animate-pulse"></div>}>
      <HeaderContent {...props} />
    </ReactSuspense>
  );
}
