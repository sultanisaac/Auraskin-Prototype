"use client";

import { X, Calendar as CalendarIcon, Phone, User, Activity } from "lucide-react";
import { Booking, updateBookingStatus } from "@/actions/kv";
import { useTransition, useState } from "react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BookingModalProps {
  booking: Booking | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function BookingModal({ booking, onClose, onUpdate }: BookingModalProps) {
  const [isPending, startTransition] = useTransition();
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [actionType, setActionType] = useState<"declined" | "cancelled" | null>(null);

  if (!booking) return null;

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text/20 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white/90 backdrop-blur-xl border border-white/50 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="relative h-24 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center px-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-text"
          >
            <X className="w-4 h-4" />
          </button>
          <div>
            <h3 className="font-serif font-bold text-2xl text-primary">Appointment</h3>
            <div className={cn(
              "text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex mt-1 uppercase tracking-wider",
              booking.status === "pending" ? "bg-amber-100 text-amber-700" :
              booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
              "bg-red-100 text-red-700"
            )}>
              {booking.status}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-text">
              <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-text/60 uppercase tracking-wider font-semibold">Patient</p>
                <p className="font-medium text-lg">{booking.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-text">
              <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center text-primary">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-text/60 uppercase tracking-wider font-semibold">Contact Info</p>
                <p className="font-medium">{booking.phone}</p>
                <p className="text-sm text-text/70">{booking.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-text">
              <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center text-primary">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-text/60 uppercase tracking-wider font-semibold">Treatment</p>
                <p className="font-medium">{booking.treatment}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-text">
              <div className="w-10 h-10 rounded-full bg-accent/30 flex items-center justify-center text-primary">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-text/60 uppercase tracking-wider font-semibold">Date & Time</p>
                <p className="font-medium">
                  {format(parseISO(booking.date), "EEEE, MMMM d, yyyy")} at {booking.time}
                </p>
              </div>
            </div>

            {booking.moreInfo && (
              <div className="bg-accent/10 p-4 rounded-xl border border-accent/20">
                <p className="text-xs text-text/60 uppercase tracking-wider font-semibold mb-1">Additional Notes</p>
                <p className="text-sm font-medium italic text-text/80">"{booking.moreInfo}"</p>
              </div>
            )}
            
            {booking.cancelReason && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <p className="text-xs text-red-600 uppercase tracking-wider font-semibold mb-1">Reason for {booking.status}</p>
                <p className="text-sm font-medium text-red-800">{booking.cancelReason}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-accent/30">
            {showReasonInput ? (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium text-text">
                  Reason for {actionType === 'cancelled' ? 'cancelling' : 'declining'}
                </label>
                <textarea 
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Type a reason or note here..."
                  className="w-full p-3 border border-accent/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReasonInput(false)}
                    className="flex-1 px-4 py-2 rounded-md font-medium border border-accent/30 hover:bg-accent/10 transition-colors text-text"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(actionType!)}
                    disabled={isPending}
                    className="flex-1 px-4 py-2 rounded-md font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isPending ? "Updating..." : `Confirm ${actionType === 'cancelled' ? 'Cancel' : 'Decline'}`}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                {booking.status !== "declined" && booking.status !== "cancelled" && (
                  <button
                    onClick={() => handleNegativeActionClick(booking.status === "confirmed" ? "cancelled" : "declined")}
                    disabled={isPending}
                    className="flex-1 px-4 py-3 rounded-md font-medium border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {booking.status === "confirmed" ? "Cancel Appointment" : "Decline"}
                  </button>
                )}
                
                {booking.status !== "confirmed" && (
                  <button
                    onClick={() => handleStatusUpdate("confirmed")}
                    disabled={isPending}
                    className="flex-1 px-4 py-3 rounded-md font-medium bg-[#0F4C5C] text-white hover:bg-[#0F4C5C]/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                  >
                    {isPending ? "Updating..." : "Confirm Booking"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
