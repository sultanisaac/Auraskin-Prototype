"use client";

import { useState, useEffect, useRef } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO, startOfMonth, endOfMonth, endOfWeek, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Booking } from "@/actions/kv";
import BookingModal from "./BookingModal";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

interface CalendarProps {
  initialBookings: Booking[];
}

export default function Calendar({ initialBookings }: CalendarProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date("2026-07-10")); // Reference date matching mock data
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [filterMode, setFilterMode] = useState<"all" | "pending" | "confirmed" | "declined">("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Set initial view mode based on screen size and listen for resizes
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setViewMode("daily");
      }
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBookings = initialBookings.filter(b => {
    if (filterMode === "all") return true;
    return b.status === filterMode;
  });

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
  const timeSlots = Array.from({ length: 11 }).map((_, i) => `${i + 9}:00`); // 9 AM to 7 PM

  const getBookingsForDateTime = (date: Date, timeStr: string) => {
    return filteredBookings.filter(b => {
      const bDate = parseISO(b.date);
      const hour = timeStr.split(":")[0];
      return isSameDay(bDate, date) && b.time.startsWith(hour);
    });
  };

  const handleNextWeek = () => setCurrentDate(viewMode === "weekly" ? addDays(currentDate, 7) : addMonths(currentDate, 1));
  const handlePrevWeek = () => setCurrentDate(viewMode === "weekly" ? addDays(currentDate, -7) : addMonths(currentDate, -1));

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);
  const monthStartDate = startOfWeek(startOfCurrentMonth, { weekStartsOn: 1 });
  const monthEndDate = endOfWeek(endOfCurrentMonth, { weekStartsOn: 1 });
  
  const monthDays = [];
  let d = monthStartDate;
  while (d <= monthEndDate) {
    monthDays.push(d);
    d = addDays(d, 1);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-accent/20 overflow-hidden flex flex-col h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 md:px-6 py-4 border-b border-accent/20">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            <select 
              value={currentDate.getMonth()}
              onChange={handleMonthChange}
              className="font-serif text-xl md:text-2xl font-bold text-primary bg-transparent border-none cursor-pointer focus:outline-none hover:bg-accent/10 rounded-md px-1"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i}>
                  {format(new Date(2026, i, 1), "MMMM")}
                </option>
              ))}
            </select>
            <select 
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
              className="font-serif text-xl md:text-2xl font-bold text-primary bg-transparent border-none cursor-pointer focus:outline-none hover:bg-accent/10 rounded-md px-1"
            >
              {Array.from({ length: 10 }).map((_, i) => {
                const yearOption = new Date().getFullYear() - 2 + i; // from 2 years ago to 7 years ahead
                return <option key={yearOption} value={yearOption}>{yearOption}</option>;
              })}
            </select>
          </div>
          
          {filterMode !== "all" && (
            <span className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0",
              filterMode === "pending" ? "bg-amber-100 text-amber-700" : 
              filterMode === "confirmed" ? "bg-emerald-100 text-emerald-700" : 
              "bg-red-100 text-red-700"
            )}>
              {filterMode} Only
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center bg-background rounded-lg p-1 border border-accent/30 shrink-0">
            <button 
              onClick={() => setViewMode("daily")}
              className={cn("px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors", viewMode === "daily" ? "bg-white shadow-sm text-primary" : "text-text/60 hover:text-text")}
            >Daily</button>
            <button 
              onClick={() => setViewMode("weekly")}
              className={cn("px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors", viewMode === "weekly" ? "bg-white shadow-sm text-primary" : "text-text/60 hover:text-text")}
            >Weekly</button>
            <button 
              onClick={() => setViewMode("monthly")}
              className={cn("px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium rounded-md transition-colors", viewMode === "monthly" ? "bg-white shadow-sm text-primary" : "text-text/60 hover:text-text")}
            >Monthly</button>
          </div>
          
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={handlePrevWeek} className="p-1.5 md:p-2 hover:bg-accent/20 rounded-md text-text transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNextWeek} className="p-1.5 md:p-2 hover:bg-accent/20 rounded-md text-text transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative shrink-0" ref={filterDropdownRef}>
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={cn("p-2 border rounded-md transition-colors", filterMode !== "all" ? "bg-primary/10 border-primary text-primary" : "border-accent/30 text-text hover:bg-accent/10")}
              title="Toggle Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            
            {showFilterDropdown && (
              <div className="absolute left-0 md:left-auto md:right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-accent/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2">
                  <p className="px-3 py-1.5 text-xs font-bold text-text/50 uppercase tracking-wider mb-1">Filter By Status</p>
                  {(["all", "pending", "confirmed", "declined"] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterMode(status);
                        setShowFilterDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 capitalize",
                        filterMode === status ? "bg-primary/10 text-primary" : "hover:bg-accent/10 text-text"
                      )}
                    >
                      {status === "all" ? "All Appointments" : status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {viewMode === "daily" ? (
          <div className="min-w-full flex flex-col h-full p-3 md:p-6 bg-background/30">
            {/* Mobile Calendar Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-accent/20 p-4 md:p-6 mb-6 shrink-0">
              {/* Days of week header */}
              <div className="grid grid-cols-7 mb-3">
                {weekDays.map((day, i) => (
                  <div key={i} className="text-center">
                    <span className="text-[10px] md:text-xs font-bold text-text/40 uppercase tracking-wider">{format(day, "EEE")}</span>
                  </div>
                ))}
              </div>
              
              {/* Month days grid */}
              <div className="grid grid-cols-7 gap-y-2 gap-x-1">
                {monthDays.map((day, i) => {
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  const isSelected = isSameDay(day, currentDate);
                  const hasBookings = filteredBookings.some(b => isSameDay(parseISO(b.date), day));
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentDate(day)}
                      className="flex flex-col items-center justify-center relative py-1.5"
                    >
                      <span className={cn(
                        "w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-sm md:text-base font-semibold transition-all",
                        isSelected ? "bg-primary text-white shadow-md shadow-primary/30 scale-110" : 
                        !isCurrentMonth ? "text-text/30" : "text-text hover:bg-accent/10",
                      )}>
                        {format(day, "d")}
                      </span>
                      {hasBookings && !isSelected && (
                        <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-primary shadow-sm"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Agenda */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-serif text-lg md:text-xl font-bold text-primary">
                  {isSameDay(currentDate, new Date()) ? "Today's Schedule" : format(currentDate, "MMMM d, yyyy")}
                </h3>
                <span className="text-xs font-semibold text-text/70 bg-white shadow-sm border border-accent/20 px-2.5 py-1 rounded-md">
                  {filteredBookings.filter(b => isSameDay(parseISO(b.date), currentDate)).length} Appointments
                </span>
              </div>
              
              <div className="space-y-3 pb-8">
                {timeSlots.map(time => {
                  const cellBookings = getBookingsForDateTime(currentDate, time);
                  if (cellBookings.length === 0) return null;
                  
                  return cellBookings.map(booking => (
                    <button
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className={cn(
                        "w-full text-left p-4 md:p-5 rounded-2xl transition-all shadow-sm flex items-start gap-4 md:gap-5 border",
                        booking.status === "pending" ? "bg-amber-50/50 border-amber-200 hover:bg-amber-50" :
                        booking.status === "confirmed" ? "bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50" :
                        "bg-red-50/50 border-red-200 hover:bg-red-50"
                      )}
                    >
                      <div className={cn(
                        "font-bold text-sm md:text-base min-w-[65px] pt-1",
                        booking.status === "pending" ? "text-amber-800" :
                        booking.status === "confirmed" ? "text-emerald-800" :
                        "text-red-800"
                      )}>
                        {booking.time}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                          <p className={cn(
                            "font-bold text-base md:text-lg",
                            booking.status === "pending" ? "text-amber-900" :
                            booking.status === "confirmed" ? "text-emerald-900" :
                            "text-red-900"
                          )}>
                            {booking.name}
                          </p>
                          <span className={cn(
                            "text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full shrink-0",
                            booking.status === "pending" ? "bg-amber-100 text-amber-700" :
                            booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {booking.status}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm font-medium mb-2",
                          booking.status === "pending" ? "text-amber-700/80" :
                          booking.status === "confirmed" ? "text-emerald-700/80" :
                          "text-red-700/80"
                        )}>
                          {booking.treatment}
                        </p>
                        {booking.phone && (
                          <p className="text-xs text-text/60 flex items-center gap-1.5 bg-white/50 w-fit px-2 py-1 rounded-md border border-black/5">
                            <span className="opacity-70 text-[10px]">📞</span> {booking.phone}
                          </p>
                        )}
                      </div>
                    </button>
                  ));
                })}
                
                {filteredBookings.filter(b => isSameDay(parseISO(b.date), currentDate)).length === 0 && (
                  <div className="text-center py-12 bg-white rounded-2xl border border-accent/20 border-dashed flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                      <span className="text-xl">📅</span>
                    </div>
                    <p className="text-text/50 font-medium">No appointments for this date</p>
                    <p className="text-text/40 text-xs mt-1">Select another day to view schedule</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : viewMode === "weekly" ? (
          <div className="min-w-[800px] h-full flex flex-col">
            {/* Days Header */}
            <div className="grid grid-cols-8 border-b border-accent/20 sticky top-0 bg-white z-10">
              <div className="py-4 px-2 text-center border-r border-accent/20 flex flex-col justify-center bg-background">
                <span className="text-xs font-semibold text-text/50 uppercase tracking-wider">Time</span>
              </div>
              {weekDays.map((day, i) => (
                <div key={i} className="py-4 px-2 text-center border-r border-accent/20 bg-background">
                  <p className="text-xs font-semibold text-text/50 uppercase tracking-wider">{format(day, "EEE")}</p>
                  <p className={cn(
                    "text-lg font-medium mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full transition-colors",
                    isSameDay(day, currentDate) ? "bg-primary text-white shadow-md shadow-primary/20" : "text-text"
                  )}>
                    {format(day, "d")}
                  </p>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="flex-1">
              {timeSlots.map((time, i) => (
                <div key={i} className="grid grid-cols-8 border-b border-accent/20 group">
                  <div className="py-4 px-2 text-center border-r border-accent/20 text-xs font-medium text-text/60">
                    {time}
                  </div>
                  
                  {weekDays.map((day, j) => {
                    const cellBookings = getBookingsForDateTime(day, time);
                    
                    return (
                      <div key={j} className="border-r border-accent/20 relative min-h-[80px] p-1.5 transition-colors group-hover:bg-accent/10">
                        {cellBookings.map((booking) => (
                          <button
                            key={booking.id}
                            onClick={() => setSelectedBooking(booking)}
                            className={cn(
                              "w-full text-left p-2.5 rounded-md mb-1.5 transition-all hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md",
                              booking.status === "pending" ? "bg-amber-50 border border-amber-200" :
                              booking.status === "confirmed" ? "bg-emerald-50 border border-emerald-200" :
                              "bg-red-50 border border-red-200"
                            )}
                          >
                            <p className={cn(
                              "text-xs font-semibold truncate",
                              booking.status === "pending" ? "text-amber-800" :
                              booking.status === "confirmed" ? "text-emerald-800" :
                              "text-red-800"
                            )}>
                              {booking.time} - {booking.name}
                            </p>
                            <p className="text-[10px] text-text/70 truncate mt-0.5">{booking.treatment}</p>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="min-w-[800px] h-full flex flex-col">
            {/* Monthly Days Header */}
            <div className="grid grid-cols-7 border-b border-accent/20 sticky top-0 bg-white z-10">
              {weekDays.map((day, i) => (
                <div key={i} className="py-3 px-2 text-center border-r border-accent/20 bg-background">
                  <p className="text-xs font-semibold text-text/50 uppercase tracking-wider">{format(day, "EEEE")}</p>
                </div>
              ))}
            </div>
            
            {/* Monthly Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5">
              {monthDays.map((day, i) => {
                // Get all bookings for this day regardless of time
                const dayBookings = filteredBookings.filter(b => isSameDay(parseISO(b.date), day));
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                
                return (
                  <div key={i} className={cn(
                    "border-r border-b border-accent/20 p-2 min-h-[120px] transition-colors hover:bg-accent/5",
                    !isCurrentMonth && "bg-background/50 opacity-60"
                  )}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium",
                        isSameDay(day, currentDate) ? "bg-primary text-white shadow-md shadow-primary/20" : 
                        "text-text"
                      )}>
                        {format(day, "d")}
                      </span>
                      {dayBookings.length > 0 && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                          {dayBookings.length}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1 mt-1 overflow-y-auto max-h-[80px] hide-scrollbar">
                      {dayBookings.map(booking => (
                        <button
                          key={booking.id}
                          onClick={() => setSelectedBooking(booking)}
                          className={cn(
                            "w-full text-left px-2 py-1 rounded text-[10px] font-medium truncate transition-all hover:scale-[1.02]",
                            booking.status === "pending" ? "bg-amber-100 text-amber-800" :
                            booking.status === "confirmed" ? "bg-emerald-100 text-emerald-800" :
                            "bg-red-100 text-red-800"
                          )}
                        >
                          {booking.time} {booking.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <BookingModal 
            booking={selectedBooking} 
            onClose={() => setSelectedBooking(null)} 
            onUpdate={() => {
              router.refresh();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
