"use client";

import { X, Calendar as CalendarIcon, Phone, User, Activity, Edit, CalendarDays, MessageCircle, ExternalLink, CalendarPlus } from "lucide-react";
import { Booking, updateBookingStatus } from "@/actions/kv";
import { useTransition, useState } from "react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import BookingFormModal from "./BookingFormModal";
import { useRouter } from "next/navigation";
import { getWhatsAppBookingUrl } from "@/lib/whatsapp";
import { getGoogleCalendarUrl, downloadIcsCalendar } from "@/lib/calendarSync";

interface BookingModalProps {
  booking: Booking | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function BookingModal({ booking, onClose, onUpdate }: BookingModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [actionType, setActionType] = useState<"declined" | "cancelled" | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  if (!booking) return null;

  if (isEditing) {
    return (
      <BookingFormModal 
        initialData={booking} 
        onClose={() => setIsEditing(false)} 
        onSuccess={() => { setIsEditing(false); onUpdate(); onClose(); }} 
      />
    );
  }

  const handleStatusUpdate = (status: "confirmed" | "declined" | "cancelled") => {
    startTransition(async () => {
      await updateBookingStatus(booking.id, status, cancelReason);
      onUpdate();
      onClose();
    });
  };

  const handleNegativeActionClick = (type: "declined" | "cancelled") => {
    setActionType(type);
    setShowReasonInput(true);
  };

  const calendarInfo = {
    title: `AuraSkin: ${booking.treatment}`,
    treatment: booking.treatment,
    patientName: booking.name,
    date: booking.date,
    time: booking.time,
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-text/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white/95 backdrop-blur-xl border border-white/50 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-20 sm:h-24 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center px-5 sm:px-6 shrink-0">
          <div className="absolute top-3.5 right-3.5 flex gap-1.5">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-1.5 bg-white/70 hover:bg-white rounded-full transition-colors text-text shadow-2xs"
              title="Edit Booking"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 bg-white/70 hover:bg-white rounded-full transition-colors text-text shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-primary">Appointment</h3>
              <span className="font-mono text-[11px] sm:text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                #{booking.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className={cn(
              "text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex mt-1 uppercase tracking-wider",
              booking.status === "pending" ? "bg-amber-100 text-amber-700" :
              booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
              "bg-red-100 text-red-700"
            )}>
              {booking.status}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar flex-1 text-sm">
          <div className="space-y-3.5">
            {/* Patient Name */}
            <div className="flex items-center gap-3 text-text">
              <div className="w-9 h-9 rounded-full bg-accent/30 flex items-center justify-center text-primary shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-text/60 uppercase tracking-wider font-semibold">Patient</p>
                <p className="font-medium text-base sm:text-lg break-words">{booking.name}</p>
              </div>
            </div>

            {/* Contact Info + 1-Click WhatsApp Button */}
            <div className="flex items-center justify-between gap-2 text-text p-2.5 rounded-xl bg-gray-50/70 border border-gray-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-accent/30 flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-text/60 uppercase tracking-wider font-semibold">Contact Info</p>
                  <p className="font-semibold text-xs sm:text-sm text-gray-900 break-all">{booking.phone}</p>
                  <p className="text-xs text-text/70 break-all">{booking.email}</p>
                </div>
              </div>

              {booking.phone && (
                <a
                  href={getWhatsAppBookingUrl(booking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                  title="Direct WhatsApp Chat with Patient"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              )}
            </div>

            {/* Treatment */}
            <div className="flex items-center gap-3 text-text">
              <div className="w-9 h-9 rounded-full bg-accent/30 flex items-center justify-center text-primary shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-text/60 uppercase tracking-wider font-semibold">Treatment</p>
                <p className="font-medium text-xs sm:text-sm break-words">{booking.treatment}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-3 text-text">
              <div className="w-9 h-9 rounded-full bg-accent/30 flex items-center justify-center text-primary shrink-0">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-text/60 uppercase tracking-wider font-semibold">Date & Time</p>
                <p className="font-medium text-xs sm:text-sm break-words">
                  {format(parseISO(booking.date), "EEEE, MMMM d, yyyy")} at {booking.time}
                </p>
              </div>
            </div>

            {/* Notes */}
            {booking.moreInfo && (
              <div className="bg-accent/10 p-3 rounded-xl border border-accent/20">
                <p className="text-[10px] text-text/60 uppercase tracking-wider font-semibold mb-0.5">Additional Notes</p>
                <p className="text-xs font-medium italic text-text/80 break-words">"{booking.moreInfo}"</p>
              </div>
            )}
            
            {/* Cancellation reason */}
            {booking.cancelReason && (
              <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                <p className="text-[10px] text-red-600 uppercase tracking-wider font-semibold mb-0.5">Reason for {booking.status}</p>
                <p className="text-xs font-medium text-red-800 break-words">{booking.cancelReason}</p>
              </div>
            )}
          </div>

          {/* Quick Links: Live Patient Tracking Page */}
          <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
            <span className="text-gray-400 font-medium">Patient Tracking Portal:</span>
            <a
              href={`/appointment/${booking.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <span>View Live Page</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-accent/30">
            {showReasonInput ? (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-medium text-text">
                  Reason for {actionType === 'cancelled' ? 'cancelling' : 'declining'}
                </label>
                <textarea 
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Type a reason or note here..."
                  className="w-full p-2.5 border border-accent/30 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReasonInput(false)}
                    className="flex-1 px-3 py-2 rounded-lg font-medium border border-accent/30 hover:bg-accent/10 transition-colors text-text text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(actionType!)}
                    disabled={isPending}
                    className="flex-1 px-3 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 text-xs"
                  >
                    {isPending ? "Updating..." : `Confirm ${actionType === 'cancelled' ? 'Cancel' : 'Decline'}`}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* Secondary row: View in Calendar & Sync to Calendar */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push(`/admin/calendar?date=${booking.date}`);
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 font-semibold text-xs transition-all shadow-2xs"
                  >
                    <CalendarDays className="w-3.5 h-3.5 text-primary" />
                    <span>Admin Calendar</span>
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold text-xs transition-all shadow-2xs"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 text-primary" />
                      <span>Sync Calendar</span>
                    </button>

                    {showCalendarMenu && (
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 p-1 z-30 animate-in fade-in zoom-in-95">
                        <a
                          href={getGoogleCalendarUrl(calendarInfo)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShowCalendarMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <span>Google Calendar</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            downloadIcsCalendar(calendarInfo);
                            setShowCalendarMenu(false);
                          }}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <span>Apple / Outlook (.ics)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary confirmation / cancellation buttons */}
                <div className="flex gap-2">
                  {booking.status !== "declined" && booking.status !== "cancelled" && (
                    <button
                      onClick={() => handleNegativeActionClick(booking.status === "confirmed" ? "cancelled" : "declined")}
                      disabled={isPending}
                      className="flex-1 px-3 py-2.5 rounded-xl font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 text-xs"
                    >
                      {booking.status === "confirmed" ? "Cancel Appointment" : "Decline"}
                    </button>
                  )}
                  
                  {booking.status !== "confirmed" && (
                    <button
                      onClick={() => handleStatusUpdate("confirmed")}
                      disabled={isPending}
                      className="flex-1 px-3 py-2.5 rounded-xl font-semibold bg-[#0F4C5C] text-white hover:bg-[#0F4C5C]/90 shadow-md shadow-primary/20 transition-all disabled:opacity-50 text-xs"
                    >
                      {isPending ? "Updating..." : "Confirm Booking"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
