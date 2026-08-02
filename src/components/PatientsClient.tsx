"use client";

import { Booking, deleteBookings } from "@/actions/kv";
import { useState, useMemo } from "react";
import { User, Phone, Mail, Activity, Calendar, Clock, X, ChevronRight, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export interface GroupedPatient {
  id: string;
  email: string;
  name: string;
  phone: string;
  latestTreatment: string;
  latestDate: string;
  totalVisits: number;
  history: Booking[];
}

export default function PatientsClient({ bookings }: { bookings: Booking[] }) {
  const [selectedPatient, setSelectedPatient] = useState<GroupedPatient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const patients = useMemo(() => {
    const uniquePatientsMap = new Map<string, GroupedPatient>();

    // Sort bookings by newest first
    const sortedBookings = [...bookings].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime();
      const dateB = new Date(`${b.date}T${b.time}`).getTime();
      return dateB - dateA; 
    });

    sortedBookings.forEach(b => {
      const key = (b.email || b.phone).toLowerCase().trim(); 
      if (!uniquePatientsMap.has(key)) {
        uniquePatientsMap.set(key, {
          id: key,
          email: b.email || "",
          name: b.name,
          phone: b.phone,
          latestTreatment: b.treatment,
          latestDate: `${b.date} ${b.time}`,
          totalVisits: 1,
          history: [b]
        });
      } else {
        const existing = uniquePatientsMap.get(key)!;
        existing.totalVisits += 1;
        existing.history.push(b);
      }
    });

    return Array.from(uniquePatientsMap.values()).filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
    );
  }, [bookings, searchTerm]);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === patients.length && patients.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(patients.map(p => p.id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} patient(s)? This will remove all their booking history.`)) return;
    
    setIsDeleting(true);
    const bookingIdsToDelete: string[] = [];
    selectedIds.forEach(patientId => {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        patient.history.forEach(b => bookingIdsToDelete.push(b.id));
      }
    });
    
    if (bookingIdsToDelete.length > 0) {
      await deleteBookings(bookingIdsToDelete);
      setSelectedIds(new Set());
      setSelectedPatient(null);
    }
    setIsDeleting(false);
  };

  const handleDeleteSingle = async (patient: GroupedPatient) => {
    if (!confirm(`Are you sure you want to delete ${patient.name}?`)) return;
    setIsDeleting(true);
    const bookingIds = patient.history.map(b => b.id);
    await deleteBookings(bookingIds);
    setSelectedIds(new Set(Array.from(selectedIds).filter(id => id !== patient.id)));
    if (selectedPatient?.id === patient.id) {
      setSelectedPatient(null);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <input 
            type="text" 
            placeholder="Search patients by name, email, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white px-4 py-2.5 rounded-xl border border-accent/20 shadow-sm text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {selectedIds.size > 0 && (
            <button 
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium text-sm hover:bg-red-100 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected ({selectedIds.size})
            </button>
          )}
          <button 
            onClick={toggleSelectAll}
            className="px-4 py-2 bg-gray-50 text-text/80 border border-accent/20 rounded-xl font-medium text-sm hover:bg-gray-100 transition disabled:opacity-50 flex items-center gap-2"
          >
            {selectedIds.size === patients.length && patients.length > 0 ? "Deselect All" : "Select All"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        {patients.map((patient) => (
          <div 
            key={patient.id} 
            onClick={() => setSelectedPatient(patient)}
            className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border ${selectedIds.has(patient.id) ? 'border-primary/50 ring-1 ring-primary/50 bg-primary/5' : 'border-accent/20 hover:border-primary/30'} hover:shadow-md transition-all group cursor-pointer relative`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div onClick={(e) => e.stopPropagation()} className="pt-1">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.has(patient.id)}
                    onChange={() => toggleSelection(patient.id)}
                    className="w-5 h-5 rounded border-accent/30 text-primary focus:ring-primary cursor-pointer"
                  />
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg font-serif shrink-0">
                  {patient.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg text-text group-hover:text-primary transition-colors truncate">{patient.name}</h3>
                  <p className="text-xs font-semibold text-primary bg-primary/5 inline-block px-2 py-0.5 rounded-full mt-1">
                    {patient.totalVisits} {patient.totalVisits === 1 ? 'Visit' : 'Visits'} Total
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteSingle(patient); }}
                  disabled={isDeleting}
                  className="p-1.5 text-text/30 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                  title="Delete Patient"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="text-text/40 group-hover:text-primary transition-colors p-1">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-text/80">
                <Phone className="w-4 h-4 text-text/40 shrink-0" />
                <span className="truncate">{patient.phone}</span>
              </div>
              {patient.email && (
                <div className="flex items-center gap-3 text-sm text-text/80">
                  <Mail className="w-4 h-4 text-text/40 shrink-0" />
                  <span className="truncate">{patient.email}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-text/80">
                <Activity className="w-4 h-4 text-text/40 shrink-0" />
                <span className="truncate">Latest: {patient.latestTreatment}</span>
              </div>
            </div>
          </div>
        ))}
        
        {patients.length === 0 && (
          <div className="col-span-full py-16 text-center text-text/50">
            <User className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No patients found.</p>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 mt-16 sm:mt-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedPatient(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 md:p-8 border-b border-accent/20 bg-gray-50/50 flex justify-between items-start shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl font-serif shrink-0 border border-primary/20 shadow-sm">
                    {selectedPatient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{selectedPatient.phone}</span>
                      {selectedPatient.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{selectedPatient.email}</span>}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPatient(null)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" /> Booking History
                  </h3>
                  <span className="text-sm font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {selectedPatient.totalVisits} Records
                  </span>
                </div>

                <div className="space-y-4">
                  {selectedPatient.history.map((booking, idx) => (
                    <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                      {idx === 0 && (
                        <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                          Most Recent
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-gray-900 text-lg mb-1">{booking.treatment}</p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {format(parseISO(booking.date), "MMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-gray-400" />
                              {booking.time}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${
                            booking.status === "pending" ? "bg-amber-100 text-amber-700" :
                            booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      {booking.moreInfo && (
                        <div className="mt-4 pt-3 border-t border-gray-50 text-sm text-gray-600 bg-gray-50/50 p-3 rounded-lg">
                          <span className="font-semibold block mb-1">Patient Notes:</span>
                          {booking.moreInfo}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
