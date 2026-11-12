"use client";

import { Bell, Search, Info, Menu, X, Calendar, CalendarDays, Users, ShoppingBag, Package, Volume2, VolumeX, CreditCard, Sparkles, Settings, Square } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  playNotificationSound, 
  stopNotificationSound, 
  subscribeAudioPlayback, 
  isNotificationAudioPlaying,
  isSoundMuted, 
  setSoundMuted 
} from "@/lib/notificationSound";
import BookingModal from "./BookingModal";
import OrderDetailModal from "./OrderDetailModal";
import { Booking } from "@/actions/kv";

interface HeaderProps {
  title: string;
  subtitle: string;
  pendingCount?: number;
}

interface PendingBookingItem extends Booking {}

interface PaidOrderItem {
  order_number: string;
  customer_name: string;
  customer_email?: string;
  total: number;
  paid_at?: string;
  item_count?: number;
  [key: string]: any;
}

function HeaderContent({ title, subtitle, pendingCount = 0 }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Notifications & Sound State
  const [pendingBookings, setPendingBookings] = useState<PendingBookingItem[]>([]);
  const [paidOrders, setPaidOrders] = useState<PaidOrderItem[]>([]);
  const [clearedIds, setClearedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"all" | "reservations" | "orders">("all");
  const [soundMuted, setSoundMutedState] = useState<boolean>(false);
  const [isTestPlaying, setIsTestPlaying] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // In-place modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const seenIdsRef = useRef<Set<string>>(new Set());
  const isInitialFetchRef = useRef<boolean>(true);

  // Subscribe to audio playback state changes
  useEffect(() => {
    const unsub = subscribeAudioPlayback((playing) => {
      setIsAudioPlaying(playing);
    });
    return () => unsub();
  }, []);

  // Initialize sound mute and cleared notifications from localStorage
  useEffect(() => {
    setSoundMutedState(isSoundMuted());
    try {
      const storedCleared = localStorage.getItem("auraskin_cleared_notification_ids");
      if (storedCleared) {
        setClearedIds(new Set(JSON.parse(storedCleared)));
      }
    } catch (e) {}
  }, []);

  const toggleMute = () => {
    const nextState = !soundMuted;
    setSoundMutedState(nextState);
    setSoundMuted(nextState);
    if (nextState) {
      stopNotificationSound();
    }
  };

  const handleTestSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAudioPlaying) {
      stopNotificationSound();
      return;
    }
    setIsTestPlaying(true);
    playNotificationSound();
    setTimeout(() => setIsTestPlaying(false), 800);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextCleared = new Set(clearedIds);
    pendingBookings.forEach((b) => nextCleared.add(`booking:${b.id}`));
    paidOrders.forEach((o) => nextCleared.add(`order:${o.order_number}`));
    setClearedIds(nextCleared);
    try {
      localStorage.setItem("auraskin_cleared_notification_ids", JSON.stringify(Array.from(nextCleared)));
    } catch (e) {}
  };

  // Poll for notification updates
  const fetchNotificationsSummary = async () => {
    try {
      const res = await fetch("/api/admin/notifications-summary");
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success) return;

      const incomingBookings: PendingBookingItem[] = data.pendingBookings || [];
      const incomingOrders: PaidOrderItem[] = data.paidOrders || [];

      // Check for genuinely new incoming items
      let hasNewEvent = false;
      const currentIds = new Set<string>();

      incomingBookings.forEach((b) => {
        const key = `booking:${b.id}`;
        currentIds.add(key);
        if (!isInitialFetchRef.current && !seenIdsRef.current.has(key)) {
          hasNewEvent = true;
        }
      });

      incomingOrders.forEach((o) => {
        const key = `order:${o.order_number}`;
        currentIds.add(key);
        if (!isInitialFetchRef.current && !seenIdsRef.current.has(key)) {
          hasNewEvent = true;
        }
      });

      seenIdsRef.current = currentIds;

      // Play audio chime if a new reservation request or paid product order came in
      if (hasNewEvent && !isInitialFetchRef.current) {
        playNotificationSound();
      }

      isInitialFetchRef.current = false;
      setPendingBookings(incomingBookings);
      setPaidOrders(incomingOrders);
    } catch (err) {
      console.warn("Failed to fetch notification summary:", err);
    }
  };

  useEffect(() => {
    fetchNotificationsSummary();
    const interval = setInterval(fetchNotificationsSummary, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  // Filter out any cleared notifications
  const activeBookings = pendingBookings.filter((b) => !clearedIds.has(`booking:${b.id}`));
  const activeOrders = paidOrders.filter((o) => !clearedIds.has(`order:${o.order_number}`));
  const displayTotalCount = activeBookings.length + activeOrders.length;

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

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
                  <Link href="/admin/orders" onClick={() => setShowMobileMenu(false)} className={cn("flex items-center px-4 py-3 rounded-md font-medium text-sm", pathname === "/admin/orders" ? "bg-primary/10 text-primary" : "text-text hover:bg-accent/10")}>
                    <Package className="h-4 w-4 mr-3" /> Orders
                  </Link>
                  <Link href="/admin/product" onClick={() => setShowMobileMenu(false)} className={cn("flex items-center px-4 py-3 rounded-md font-medium text-sm", pathname === "/admin/product" ? "bg-primary/10 text-primary" : "text-text hover:bg-accent/10")}>
                    <ShoppingBag className="h-4 w-4 mr-3" /> Products
                  </Link>
                  <Link href="/admin/settings" onClick={() => setShowMobileMenu(false)} className={cn("flex items-center px-4 py-3 rounded-md font-medium text-sm", pathname === "/admin/settings" ? "bg-primary/10 text-primary" : "text-text hover:bg-accent/10")}>
                    <Settings className="h-4 w-4 mr-3" /> Settings
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
      
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6">
          {/* Active Ringtone Indicator & Instant Silence Button */}
          {isAudioPlaying && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                stopNotificationSound();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md animate-pulse transition-all cursor-pointer ring-2 ring-red-300"
              title="Stop ringing audio"
            >
              <Square className="w-3 h-3 fill-white" />
              <span>Stop Sound</span>
            </button>
          )}

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => {
                const nextState = !showNotifications;
                setShowNotifications(nextState);
                if (nextState) {
                  // Admin is opening notifications: automatically silence ringing ringtone!
                  stopNotificationSound();
                }
              }}
              className="relative p-2 rounded-full hover:bg-accent/20 transition-colors text-text"
              aria-label="Open notifications"
            >
              <Bell className="w-5 h-5" />
              {displayTotalCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {displayTotalCount > 99 ? "99+" : displayTotalCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-84 md:w-96 bg-white rounded-2xl shadow-2xl border border-accent/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Header with audio controls */}
                <div className="p-4 border-b border-accent/20 bg-primary/5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-primary text-base">Notifications</h3>
                    {displayTotalCount > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                        {displayTotalCount} New
                      </span>
                    )}
                  </div>

                  {/* Sound controls */}
                  <div className="flex items-center gap-1.5">
                    {isAudioPlaying && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          stopNotificationSound();
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 text-xs font-semibold shadow-xs transition-colors"
                        title="Stop audio right now"
                      >
                        <Square className="w-3 h-3 fill-white" />
                        <span>Stop Audio</span>
                      </button>
                    )}
                    <button
                      onClick={handleTestSound}
                      title="Test Notification Chime"
                      className={cn(
                        "p-1.5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors text-primary flex items-center gap-1 text-xs font-medium",
                        isTestPlaying && "bg-primary/20 scale-105"
                      )}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[11px] hidden sm:inline">Test Sound</span>
                    </button>
                    <button
                      onClick={toggleMute}
                      title={soundMuted ? "Unmute notification sound" : "Mute notification sound"}
                      className={cn(
                        "p-1.5 rounded-lg border transition-colors",
                        soundMuted 
                          ? "bg-red-50 border-red-200 text-red-600" 
                          : "border-primary/20 hover:bg-primary/10 text-primary"
                      )}
                    >
                      {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex border-b border-accent/15 bg-gray-50/70 p-1 gap-1 text-xs">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={cn(
                      "flex-1 py-1.5 rounded-md font-medium transition-all text-center",
                      activeTab === "all" ? "bg-white text-primary shadow-xs font-semibold" : "text-text/60 hover:text-text"
                    )}
                  >
                    All ({displayTotalCount})
                  </button>
                  <button
                    onClick={() => setActiveTab("reservations")}
                    className={cn(
                      "flex-1 py-1.5 rounded-md font-medium transition-all text-center",
                      activeTab === "reservations" ? "bg-white text-primary shadow-xs font-semibold" : "text-text/60 hover:text-text"
                    )}
                  >
                    Reservations ({activeBookings.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={cn(
                      "flex-1 py-1.5 rounded-md font-medium transition-all text-center",
                      activeTab === "orders" ? "bg-white text-primary shadow-xs font-semibold" : "text-text/60 hover:text-text"
                    )}
                  >
                    Paid Orders ({activeOrders.length})
                  </button>
                </div>

                {/* Notification Items List */}
                <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-100">
                  {displayTotalCount === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                      <Bell className="w-8 h-8 opacity-25 mb-2 text-primary" />
                      <p className="font-medium text-gray-500">No active alerts right now.</p>
                      <p className="text-xs text-gray-400 mt-1">New reservations and paid product orders will appear here.</p>
                    </div>
                  ) : (
                    <>
                      {/* Reservation Requests - Open BookingModal in-place */}
                      {(activeTab === "all" || activeTab === "reservations") && activeBookings.map((b) => (
                        <div 
                          key={`booking-${b.id}`}
                          onClick={() => {
                            setSelectedBooking(b);
                            setShowNotifications(false);
                            stopNotificationSound();
                          }}
                          className="p-3.5 hover:bg-primary/5 transition-colors group cursor-pointer"
                        >
                          <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  Reservation Request
                                </span>
                                <span className="text-[11px] text-text/50">{b.date}</span>
                              </div>
                              <p className="text-sm font-semibold text-text mt-1 truncate group-hover:text-primary transition-colors">
                                {b.name}
                              </p>
                              <p className="text-xs text-text/60 truncate">
                                {b.treatment} • at {b.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Paid Product Orders - Open OrderDetailModal in-place */}
                      {(activeTab === "all" || activeTab === "orders") && activeOrders.map((o) => (
                        <div 
                          key={`order-${o.order_number}`}
                          onClick={() => {
                            setSelectedOrder(o);
                            setShowNotifications(false);
                            stopNotificationSound();
                          }}
                          className="p-3.5 hover:bg-emerald-50/50 transition-colors group cursor-pointer"
                        >
                          <div className="flex gap-3 items-start">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                              <ShoppingBag className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Order Paid
                                </span>
                                <span className="text-xs font-bold text-emerald-700">
                                  {formatPrice(o.total)}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-text mt-1 truncate group-hover:text-primary transition-colors">
                                #{o.order_number}
                              </p>
                              <p className="text-xs text-text/60 truncate">
                                Paid by {o.customer_name} ({o.item_count} item{o.item_count !== 1 ? 's' : ''})
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Footer Buttons: Clear & Notification Tab */}
                <div className="flex border-t border-accent/20 bg-gray-50/70 p-2 gap-2">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    disabled={displayTotalCount === 0}
                    className="flex-1 py-2 px-3 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition-colors border border-red-200 bg-white"
                  >
                    Clear
                  </button>
                  <Link 
                    href="/admin/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="flex-1 py-2 px-3 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/20 bg-white text-center flex items-center justify-center"
                  >
                    Notification Tab
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-secondary/50 flex items-center justify-center text-primary font-bold overflow-hidden shadow-sm">
            <span className="text-sm">AS</span>
          </div>
        </div>
      </header>

      {/* In-place Reservation Booking Modal */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={fetchNotificationsSummary}
        />
      )}

      {/* In-place Paid Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={fetchNotificationsSummary}
        />
      )}
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
