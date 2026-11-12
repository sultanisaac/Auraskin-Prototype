"use client";

import { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  MessageCircle, 
  CalendarPlus, 
  Share2, 
  Sparkles, 
  User, 
  Activity, 
  ExternalLink,
  Copy,
  Check
} from "lucide-react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { getGoogleCalendarUrl, downloadIcsCalendar } from "@/lib/calendarSync";
import { getClinicWhatsAppUrl } from "@/lib/whatsapp";
import { Booking } from "@/actions/kv";

export default function AppointmentTrackerClient({ booking }: { booking: Booking }) {
  const [copied, setCopied] = useState(false);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  const formattedDate = (() => {
    try {
      return format(parseISO(booking.date), "EEEE, MMMM d, yyyy");
    } catch (e) {
      return booking.date;
    }
  })();

  const calendarInfo = {
    title: `AuraSkin: ${booking.treatment}`,
    treatment: booking.treatment,
    patientName: booking.name,
    date: booking.date,
    time: booking.time,
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `https://auraskin-prototype.vercel.app/appointment/${booking.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isPending = booking.status === "pending";
  const isConfirmed = booking.status === "confirmed";
  const isCancelled = booking.status === "cancelled" || booking.status === "declined";

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <Link href="/" className="text-primary hover:underline font-medium flex items-center gap-1">
            ← Back to AuraSkin
          </Link>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-2xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
            <span>{copied ? "Link Copied!" : "Share Link"}</span>
          </button>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm border bg-primary/10 text-primary border-primary/20">
            {isConfirmed ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            ) : isCancelled ? (
              <XCircle className="w-8 h-8 text-red-500" />
            ) : (
              <Clock className="w-8 h-8 text-primary animate-pulse" />
            )}
          </div>

          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-gray-400 block mb-1">
            Booking ID: #{booking.id.slice(0, 8).toUpperCase()}
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {isConfirmed ? "Appointment Confirmed! ✨" : isCancelled ? "Appointment Notice" : "Reservation Under Review"}
          </h1>

          <p className="text-gray-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            {isConfirmed
              ? `Hello ${booking.name}, your consultation for ${booking.treatment} has been confirmed. We look forward to welcoming you at AuraSkin.`
              : isCancelled
              ? `Hello ${booking.name}, your booking request for ${booking.treatment} on ${formattedDate} has been ${booking.status}.`
              : `Thank you for your request, ${booking.name}. Our clinic doctors & team are reviewing your schedule and will confirm your booking shortly.`}
          </p>

          {booking.cancelReason && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs text-left max-w-md mx-auto">
              <span className="font-bold block mb-0.5">Note from Clinic:</span>
              <p>{booking.cancelReason}</p>
            </div>
          )}

          {/* Progress Timeline */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between max-w-md mx-auto relative">
              <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-gray-200 -z-0" />
              <div 
                className={`absolute top-1/2 left-0 -translate-y-1/2 h-0.5 transition-all -z-0 ${
                  isConfirmed ? "w-full bg-emerald-500" : isCancelled ? "w-1/2 bg-red-400" : "w-1/2 bg-primary"
                }`} 
              />

              {/* Step 1 */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  ✓
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-800 mt-1.5">Submitted</span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                  isConfirmed ? "bg-emerald-500 text-white" : isCancelled ? "bg-red-500 text-white" : "bg-primary text-white ring-4 ring-primary/20"
                }`}>
                  {isConfirmed ? "✓" : isCancelled ? "✕" : "2"}
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-800 mt-1.5">Staff Review</span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                  isConfirmed ? "bg-emerald-600 text-white ring-4 ring-emerald-100" : isCancelled ? "bg-gray-200 text-gray-400" : "bg-gray-200 text-gray-500"
                }`}>
                  {isConfirmed ? "✓" : "3"}
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-800 mt-1.5">Confirmed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Calendar Sync Button */}
          <div className="relative">
            <button
              onClick={() => setShowCalendarMenu(!showCalendarMenu)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-semibold text-xs sm:text-sm shadow-2xs transition-all"
            >
              <CalendarPlus className="w-4 h-4 text-primary" />
              <span>Add to Calendar</span>
            </button>

            {showCalendarMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-30 animate-in fade-in zoom-in-95">
                <a
                  href={getGoogleCalendarUrl(calendarInfo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowCalendarMenu(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                >
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span>Google Calendar</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    downloadIcsCalendar(calendarInfo);
                    setShowCalendarMenu(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                >
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span>Apple / Outlook (.ics file)</span>
                </button>
              </div>
            )}
          </div>

          {/* WhatsApp Direct Help */}
          <a
            href={getClinicWhatsAppUrl(booking.id, booking.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Clinic on WhatsApp</span>
          </a>
        </div>

        {/* Appointment Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Schedule & Patient */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs space-y-3.5 text-xs sm:text-sm">
            <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2">
              Appointment Summary
            </h3>

            <div className="flex items-start gap-3">
              <Activity className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Treatment</span>
                <p className="font-semibold text-gray-900">{booking.treatment}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarIcon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Date & Time</span>
                <p className="font-semibold text-gray-900">{formattedDate}</p>
                <p className="text-gray-500 font-mono text-xs mt-0.5">at {booking.time} WIB</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Patient Details</span>
                <p className="font-semibold text-gray-900">{booking.name}</p>
                <p className="text-gray-500 text-xs">{booking.phone}</p>
                <p className="text-gray-500 text-xs">{booking.email}</p>
              </div>
            </div>

            {booking.moreInfo && (
              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Notes</span>
                <p className="italic">"{booking.moreInfo}"</p>
              </div>
            )}
          </div>

          {/* Card 2: Clinic Location & Preparation */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs space-y-3.5 text-xs sm:text-sm flex flex-col justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2">
                Clinic Location & Tips
              </h3>

              <div className="flex items-start gap-3 mt-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Clinic Address</span>
                  <p className="font-semibold text-gray-900">AuraSkin Aesthetic Clinic</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                    Grand Indonesia Mall, Level 3 East Mall, Jl. M.H. Thamrin No.1, Jakarta Pusat
                  </p>
                  <a
                    href="https://maps.google.com/?q=Grand+Indonesia+Jakarta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-xs font-semibold hover:underline mt-1.5"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Preparation Guidelines</span>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">•</span>
                    <span>Please arrive 10–15 minutes before your slot.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">•</span>
                    <span>Avoid active retinoid/chemical peels 24 hours prior.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-primary font-bold">•</span>
                    <span>Complimentary skin tea and valet parking available.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link 
                href="/book-consultation"
                className="text-xs text-gray-500 hover:text-primary transition-colors underline"
              >
                Need to book another treatment?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

