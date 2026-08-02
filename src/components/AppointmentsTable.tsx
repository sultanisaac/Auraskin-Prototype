"use client";

import { Booking, deleteBookings } from "@/actions/kv";
import { format, parseISO } from "date-fns";
import { useState, useMemo } from "react";
import BookingModal from "./BookingModal";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Trash2, Filter, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";

export default function AppointmentsTable({ bookings }: { bookings: Booking[] }) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const router = useRouter();

  // Filter States
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPatient, setFilterPatient] = useState<string>("");
  const [filterTreatment, setFilterTreatment] = useState<string>("all");

  const filteredBookings = useMemo(() => {
    let result = bookings.filter(b => {
      if (filterStatus !== "all" && b.status !== filterStatus) return false;
      if (filterTreatment !== "all" && !b.treatment.includes(filterTreatment)) return false;
      if (filterPatient && !b.name.toLowerCase().includes(filterPatient.toLowerCase())) return false;
      return true;
    });

    result.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [bookings, filterStatus, filterPatient, filterTreatment, sortDirection]);

  const toggleSort = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

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
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} appointment(s)?`)) return;
    
    setIsDeleting(true);
    await deleteBookings(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsDeleting(false);
    router.refresh();
  };

  return (
    <>
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-accent/20 shadow-sm w-full md:w-auto">
            <Filter className="w-4 h-4 text-text/50" />
            <input 
              type="text" 
              placeholder="Search patient..." 
              value={filterPatient}
              onChange={(e) => setFilterPatient(e.target.value)}
              className="text-sm outline-none bg-transparent w-full md:w-32"
            />
          </div>
          
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white px-3 py-2 rounded-lg border border-accent/20 shadow-sm text-sm outline-none focus:ring-1 focus:ring-primary cursor-pointer w-full md:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="declined">Declined</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select 
            value={filterTreatment}
            onChange={(e) => setFilterTreatment(e.target.value)}
            className="bg-white px-3 py-2 rounded-lg border border-accent/20 shadow-sm text-sm outline-none focus:ring-1 focus:ring-primary cursor-pointer w-full md:w-auto max-w-[200px]"
          >
            <option value="all">All Treatments</option>
            <option value="Acne Treatment">Acne Treatment</option>
            <option value="Brightening Program">Brightening Program</option>
            <option value="Anti Aging">Anti Aging</option>
            <option value="Laser Rejuvenation">Laser Rejuvenation</option>
            <option value="Skin Booster">Skin Booster</option>
            <option value="General Consultation">General Consultation</option>
          </select>
        </div>

        {selectedIds.size > 0 && (
          <button 
            onClick={handleDeleteSelected}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-semibold transition border border-red-200 shadow-sm whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : `Delete Selected (${selectedIds.size})`}
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-accent/20 overflow-x-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-accent/30 bg-primary/5 text-primary">
              <th className="py-4 px-6 w-12">
                <input 
                  type="checkbox" 
                  checked={selectedIds.size === filteredBookings.length && filteredBookings.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-accent/30 text-primary focus:ring-primary cursor-pointer"
                />
              </th>
              <th className="py-4 px-6 font-semibold text-sm">Patient</th>
              <th className="py-4 px-6 font-semibold text-sm">Treatment</th>
              <th 
                className="py-4 px-6 font-semibold text-sm cursor-pointer hover:bg-primary/10 select-none group transition-colors"
                onClick={toggleSort}
              >
                <div className="flex items-center gap-1.5">
                  Date & Time
                  <div className="flex flex-col opacity-40 group-hover:opacity-100 transition-opacity">
                    {sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
                  </div>
                </div>
              </th>
              <th className="py-4 px-6 font-semibold text-sm">Contact</th>
              <th className="py-4 px-6 font-semibold text-sm">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-accent/20">
            {filteredBookings.map((booking) => {
              const isSelected = selectedIds.has(booking.id);
              return (
                <tr 
                  key={booking.id} 
                  onClick={() => setSelectedBooking(booking)}
                  className={`transition-colors group cursor-pointer ${isSelected ? 'bg-primary/5' : 'hover:bg-accent/5'}`}
                >
                  <td className="py-4 px-6" onClick={(e) => toggleSelect(booking.id, e)}>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      readOnly
                      className="w-4 h-4 rounded border-accent/30 text-primary focus:ring-primary cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-6 font-medium text-text">{booking.name}</td>
                  <td className="py-4 px-6 text-text/80 text-sm">{booking.treatment}</td>
                  <td className="py-4 px-6 text-text/80 text-sm">
                    {format(parseISO(booking.date), "MMM d, yyyy")} • {booking.time}
                  </td>
                  <td className="py-4 px-6 text-text/80 text-sm">{booking.phone}</td>
                  <td className="py-4 px-6">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      booking.status === "pending" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                      booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                      "bg-red-100 text-red-700 border border-red-200"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-text/50">
                  <p className="text-lg mb-2">No appointments found.</p>
                  <p className="text-sm">Try adjusting your filters.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <BookingModal 
            booking={selectedBooking} 
            onClose={() => setSelectedBooking(null)} 
            onUpdate={() => {
              setSelectedIds(new Set()); // clear selection if status updated might remove it from current filter
              router.refresh();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
