"use client";

import { Booking, deleteBookings } from "@/actions/kv";
import { format, parseISO } from "date-fns";
import { useState, useMemo } from "react";
import BookingModal from "./BookingModal";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, CheckCircle2, Clock, XCircle, AlertCircle, Calendar, Search, ShoppingBag, ExternalLink } from "lucide-react";

export default function NotificationsClient({ bookings, paidOrders = [] }: { bookings: Booking[], paidOrders?: any[] }) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Filter States
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  const sortedBookings = useMemo(() => {
    // Sort by newest created first. If createdAt is missing, fallback to date parsing.
    return [...bookings].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateB - dateA;
    });
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (filterStatus === "paid-orders") return [];
    return sortedBookings.filter(b => {
      if (filterStatus !== "all" && b.status !== filterStatus) return false;
      if (searchTerm && !b.name.toLowerCase().includes(searchTerm.toLowerCase()) && !b.treatment.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [sortedBookings, filterStatus, searchTerm]);

  const filteredPaidOrders = useMemo(() => {
    if (filterStatus !== "all" && filterStatus !== "paid-orders") return [];
    return paidOrders.filter(o => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        o.order_number?.toLowerCase().includes(term) ||
        o.customer?.name?.toLowerCase().includes(term) ||
        o.customer?.email?.toLowerCase().includes(term)
      );
    });
  }, [paidOrders, filterStatus, searchTerm]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredBookings.length && filteredBookings.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredBookings.map(b => b.id)));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} notification(s)? This will also remove the appointment(s).`)) return;
    
    setIsDeleting(true);
    await deleteBookings(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsDeleting(false);
    router.refresh();
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-xl border border-accent/20 shadow-sm w-full md:w-64 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search notifications or orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm outline-none bg-transparent w-full placeholder:text-gray-400"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white px-4 py-2.5 rounded-xl border border-accent/20 shadow-sm text-sm outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer w-full sm:w-56 transition"
          >
            <option value="all">All Notifications</option>
            <option value="pending">Pending Reservations</option>
            <option value="paid-orders">Paid Store Orders ({paidOrders.length})</option>
            <option value="confirmed">Confirmed Appointments</option>
            <option value="declined">Declined</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600 bg-white px-4 py-2.5 rounded-xl border border-accent/20 shadow-sm">
            <input 
              type="checkbox" 
              checked={selectedIds.size === filteredBookings.length && filteredBookings.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300"
            />
            Select All
          </label>

          {selectedIds.size > 0 && (
            <button 
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl text-sm font-bold transition border border-red-200 shadow-sm whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Deleting..." : `Delete (${selectedIds.size})`}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 pb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {filteredBookings.map((booking) => {
          const isSelected = selectedIds.has(booking.id);
          
          let icon = <Clock className="w-5 h-5 text-amber-500" />;
          let bgClass = "bg-amber-50";
          let borderClass = "border-amber-100";
          
          if (booking.status === "confirmed") {
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            bgClass = "bg-emerald-50";
            borderClass = "border-emerald-100";
          } else if (booking.status === "declined") {
            icon = <XCircle className="w-5 h-5 text-red-500" />;
            bgClass = "bg-red-50";
            borderClass = "border-red-100";
          } else if (booking.status === "cancelled") {
            icon = <AlertCircle className="w-5 h-5 text-gray-500" />;
            bgClass = "bg-gray-50";
            borderClass = "border-gray-200";
          }

          return (
            <div 
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className={`flex flex-col sm:flex-row gap-4 p-4 md:p-5 rounded-2xl border transition-all cursor-pointer group ${
                isSelected ? 'border-primary shadow-md bg-primary/5 ring-1 ring-primary/20' : 'bg-white border-gray-100 shadow-sm hover:border-primary/30 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div onClick={(e) => toggleSelect(booking.id, e)} className="mt-1 flex-shrink-0 cursor-pointer p-1">
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    readOnly
                    className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 pointer-events-none"
                  />
                </div>
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bgClass} ${borderClass} border`}>
                  {icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">
                      {booking.status === 'pending' ? 'New Booking Request' : 
                       booking.status === 'confirmed' ? 'Appointment Confirmed' : 
                       booking.status === 'declined' ? 'Request Declined' : 'Appointment Cancelled'}
                    </h3>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0 bg-gray-50 px-2.5 py-1 rounded-lg">
                      {booking.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    <span className="font-semibold text-gray-900">{booking.name}</span> has an appointment status of <span className="lowercase font-semibold">{booking.status}</span> for <span className="font-medium text-primary">{booking.treatment}</span>.
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {format(parseISO(booking.date), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {booking.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Paid Product Orders */}
        {filteredPaidOrders.map((order) => (
          <Link
            key={`paid-order-${order.order_number}`}
            href={`/admin/orders/${order.order_number}`}
            className="flex flex-col sm:flex-row gap-4 p-4 md:p-5 rounded-2xl border bg-white border-gray-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group block"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 border border-emerald-100 text-emerald-600">
                <ShoppingBag className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                      Product Order Paid: #{order.order_number}
                    </h3>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 uppercase tracking-wider shrink-0">
                    Order Paid
                  </span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  Customer <span className="font-semibold text-gray-900">{order.customer?.name || "Customer"}</span> has paid{" "}
                  <span className="font-bold text-emerald-700">{formatPrice(order.total || order.totalAmount)}</span> for{" "}
                  <span className="font-medium text-gray-900">{order.items?.length || 1} item(s)</span>. Ready for courier shipping request.
                </p>

                <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {order.paid_at || order.created_at ? new Date(order.paid_at || order.created_at).toLocaleDateString('en-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  </span>
                  {order.shipping?.courier && (
                    <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg uppercase">
                      Courier: {order.shipping.courier} {order.shipping.service || ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filteredBookings.length === 0 && filteredPaidOrders.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg text-gray-500">No notifications found.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <BookingModal 
            booking={selectedBooking} 
            onClose={() => setSelectedBooking(null)} 
            onUpdate={() => {
              setSelectedIds(new Set());
              router.refresh();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
