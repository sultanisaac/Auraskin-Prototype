"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Check,
  ExternalLink,
  CalendarPlus,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  Trash2,
  Loader2,
  Info,
  X,
  FileText,
  Star
} from "lucide-react";
import { Button } from "../components/Button";
import { getGoogleCalendarUrl } from "../lib/calendarSync";
import { getClinicWhatsAppUrl } from "../lib/whatsapp";
import { submitBooking, getActiveBookings, Booking } from "../actions/booking";
import {
  TREATMENTS_DATA,
  TreatmentItem,
  TREATMENT_CATEGORIES
} from "../data/treatmentsData";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isBefore,
  startOfDay,
  getDay,
  setMonth,
  setYear
} from "date-fns";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorParam = searchParams?.get("doctor") || "";
  const treatmentParam = searchParams?.get("treatment") || "";

  // Step state: 1 = Treatments, 2 = Date & Time, 3 = Personal Info, 4 = Review & Confirm
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Treatments State
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedTreatmentIds, setSelectedTreatmentIds] = useState<string[]>(() => {
    if (treatmentParam) {
      const match = TREATMENTS_DATA.find(
        (t) => t.name.toLowerCase() === treatmentParam.toLowerCase() || t.id === treatmentParam
      );
      if (match) return [match.id];
    }
    // Default to doctor consultation
    return ["doctor-consultation"];
  });
  const [additionalNotes, setAdditionalNotes] = useState<string>(
    doctorParam ? `Preferred specialist: ${doctorParam}` : ""
  );

  // Step 2: Date & Time State
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));

  // Step 3: Personal Information State
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [contactErrors, setContactErrors] = useState<{ [key: string]: string }>({});

  // Submission & Success State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Mobile sidebar drawer state
  const [showMobileSummary, setShowMobileSummary] = useState<boolean>(false);

  // Load existing bookings on mount to enforce double-booking prevention
  useEffect(() => {
    async function fetchExistingBookings() {
      setIsLoadingSlots(true);
      try {
        const bookings = await getActiveBookings();
        setConfirmedBookings(bookings || []);
      } catch (err) {
        console.warn("Could not fetch existing bookings:", err);
      } finally {
        setIsLoadingSlots(false);
      }
    }
    fetchExistingBookings();
  }, []);

  // Compute selected treatments array
  const selectedTreatments = useMemo(() => {
    return TREATMENTS_DATA.filter((t) => selectedTreatmentIds.includes(t.id));
  }, [selectedTreatmentIds]);

  // Compute totals
  const totalPrice = useMemo(() => {
    return selectedTreatments.reduce((acc, curr) => acc + curr.numericPrice, 0);
  }, [selectedTreatments]);

  const totalMinutes = useMemo(() => {
    return selectedTreatments.reduce((acc, curr) => acc + curr.numericMinutes, 0);
  }, [selectedTreatments]);

  // Format currency in IDR
  const formatIDR = (num: number) => {
    if (num === 0) return "FREE";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(num);
  };

  // Toggle treatment selection
  const toggleTreatment = (id: string) => {
    setSelectedTreatmentIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) {
          // Keep at least one or let them toggle
          return [];
        }
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Calendar dates calculation
  const today = startOfDay(new Date());
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(setMonth(currentMonth, parseInt(e.target.value)));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(setYear(currentMonth, parseInt(e.target.value)));
  };

  // Available Time Slots (9 AM to 7 PM)
  const getAvailableTimeSlots = (date: Date) => {
    const dayOfWeek = getDay(date); // 0 = Sun, 6 = Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const endHour = isWeekend ? 17 : 19; // 17:00 on weekends, 19:00 on weekdays

    const slots: string[] = [];
    for (let hour = 10; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  // Check if a specific slot is already taken on the selected date
  const isTimeSlotTaken = (time: string) => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    return confirmedBookings.some((b) => b.date === formattedDate && b.time === time);
  };

  // Recommendations for slots
  const getSlotRecommendation = (time: string) => {
    if (time === "10:00") return "🌅 Morning Glow (Calm & Quiet)";
    if (time === "14:00") return "✨ Popular (Doctor Peak)";
    if (time === "16:00") return "🍵 Afternoon Tea Slot";
    return null;
  };

  // Validate contact info in Step 3
  const validateContactInfo = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = "Please enter your full name.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Please enter a valid email address.";
    }
    const cleanPhone = phone.replace(/[\s\-\+]/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      errs.phone = "Please enter a valid WhatsApp or phone number.";
    }
    setContactErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Final Booking
  const handleFinalSubmit = async () => {
    setSubmitError("");
    if (selectedTreatments.length === 0) {
      setCurrentStep(1);
      return;
    }
    if (!selectedTime) {
      setCurrentStep(2);
      return;
    }
    if (!validateContactInfo()) {
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const treatmentsList = selectedTreatments.map((t) => t.name);

      const res = await submitBooking({
        fullName,
        email,
        phone,
        treatments: treatmentsList,
        date: formattedDate,
        time: selectedTime,
        moreInfo: additionalNotes
      });

      if (res.success && res.booking) {
        setCreatedBooking(res.booking);
        setIsSuccess(true);
      } else {
        const errorMsg = typeof res.error === "string" ? res.error : "Unable to confirm booking. Please try another slot.";
        setSubmitError(errorMsg);
      }
    } catch (err: any) {
      setSubmitError(err?.message || "A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered treatments in Step 1
  const filteredTreatments = useMemo(() => {
    if (selectedCategory === "All") return TREATMENTS_DATA;
    return TREATMENTS_DATA.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  /* =========================================================================
     SUCCESS VIEW
     ========================================================================= */
  if (isSuccess && createdBooking) {
    return (
      <div className="bg-background min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-xl w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-[11px] font-mono font-bold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full inline-block mb-3">
            Booking ID: #{createdBooking.id.slice(0, 8).toUpperCase()}
          </span>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Reservation Request Sent!
          </h2>

          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
            Thank you, <span className="font-bold text-gray-900">{createdBooking.name}</span>. Your consultation for{" "}
            <span className="font-semibold text-primary">{createdBooking.treatment}</span> on{" "}
            <strong>{format(selectedDate, "EEEE, MMMM d, yyyy")}</strong> at <strong>{selectedTime} WIB</strong> has been recorded.
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 text-left mb-6 border border-gray-100 space-y-2 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2 font-semibold text-gray-900">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>What Happens Next:</span>
            </div>
            <p>1. Our medical team will verify your schedule and send an automated confirmation pass to <strong>{createdBooking.email}</strong>.</p>
            <p>2. You can track review status anytime using the live tracking link below.</p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href={`/appointment/${createdBooking.id}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-white rounded-2xl font-semibold text-sm hover:bg-primary/90 shadow-md transition-all cursor-pointer"
            >
              <span>View Live Appointment Status</span>
              <ExternalLink className="w-4 h-4" />
            </Link>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={getGoogleCalendarUrl({
                  title: `AuraSkin: ${createdBooking.treatment}`,
                  treatment: createdBooking.treatment,
                  patientName: createdBooking.name,
                  date: createdBooking.date,
                  time: createdBooking.time
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-xs hover:bg-gray-50 transition-colors shadow-2xs"
              >
                <CalendarPlus className="w-4 h-4 text-primary" />
                <span>Add to Google Calendar</span>
              </a>

              <a
                href={getClinicWhatsAppUrl(createdBooking.id, createdBooking.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-medium text-xs hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat Clinic on WhatsApp</span>
              </a>
            </div>

            <Link href="/" className="block w-full pt-2">
              <Button variant="outline" className="w-full">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  /* =========================================================================
     MAIN 4-STEP BOOKING FLOW
     ========================================================================= */
  return (
    <div className="bg-background min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Back Button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
              } else {
                router.back();
              }
            }}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition font-medium text-xs sm:text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep > 1 ? "Previous Step" : "Back"}</span>
          </button>

          <span className="text-xs text-gray-400 font-medium hidden sm:inline">
            Step {currentStep} of 4 • AuraSkin Aesthetic Booking
          </span>
        </div>

        {/* Page Title */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-primary font-medium text-xs sm:text-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-primary text-primary" />
            <span>Doctor-Led Consultations • Zero Sales Pressure</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Book Your Consultation
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Select your desired treatments, choose your preferred consultation slot, and receive a customized clinical roadmap.
          </p>
        </div>

        {/* Step Progress Stepper Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-2xs mb-8">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { num: 1, label: "Treatments", desc: "Choose Services" },
              { num: 2, label: "Schedule", desc: "Date & Time" },
              { num: 3, label: "Your Details", desc: "Contact Info" },
              { num: 4, label: "Review", desc: "Confirm Booking" }
            ].map((s) => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;

              return (
                <button
                  key={s.num}
                  onClick={() => {
                    // Allow navigating to previous steps freely
                    if (s.num < currentStep) {
                      setCurrentStep(s.num as 1 | 2 | 3 | 4);
                    }
                  }}
                  disabled={s.num > currentStep}
                  className={`py-2 px-1 sm:px-3 rounded-xl transition-all text-left flex flex-col sm:flex-row items-center gap-2 ${
                    isActive
                      ? "bg-primary text-white shadow-xs font-semibold"
                      : isPast
                      ? "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed opacity-60"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isActive
                        ? "bg-white text-primary"
                        : isPast
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </span>
                  <div className="hidden sm:block min-w-0">
                    <p className="text-xs font-bold truncate leading-none">{s.label}</p>
                    <p className={`text-[10px] truncate mt-0.5 ${isActive ? "text-white/80" : "text-gray-400"}`}>
                      {s.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Layout: Main Step Content (8 cols) + Sticky Live Summary (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 8 COLUMNS: Active Step Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* STEP 1: TREATMENTS SELECTION */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gray-900">
                    1. Select Your Treatments
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    You can select more than one treatment. All doctor consultations include digital barrier mapping.
                  </p>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 pb-2">
                  {TREATMENT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-primary text-white shadow-xs"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {cat} {cat !== "All" && cat !== "General" ? "Treatments" : ""}
                    </button>
                  ))}
                </div>

                {/* Treatments Grid - Streamlined Treatment Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
                  {filteredTreatments.map((t) => {
                    const isSelected = selectedTreatmentIds.includes(t.id);

                    return (
                      <div
                        key={t.id}
                        onClick={() => toggleTreatment(t.id)}
                        className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30"
                            : "border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/50 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                                {t.category}
                              </span>
                              <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {t.duration}
                              </span>
                            </div>

                            <h3 className="font-serif font-bold text-sm sm:text-base text-gray-900 leading-snug">
                              {t.name}
                            </h3>

                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-sm font-bold text-primary font-mono">
                                {t.price}
                              </span>
                              {t.originalPrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  {t.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                              isSelected
                                ? "bg-primary border-primary text-white"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Notes Box */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Skin Concerns or Doctor Preferences (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="E.g., sensitive skin, prone to hormonal breakouts, or preferred specialist..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                {/* Next Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={selectedTreatmentIds.length === 0}
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>
                      Continue to Schedule ({selectedTreatmentIds.length} selected)
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: DATE & TIME SELECTION */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gray-900">
                    2. Choose Date & Visit Time
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Select a date and available slot. Booked slots are locked to prevent double reservations.
                  </p>
                </div>

                {/* Calendar Navigation & Grid */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Pick a Consultation Date
                    </span>

                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button
                        onClick={prevMonth}
                        disabled={isBefore(currentMonth, startOfMonth(today))}
                        className="p-1.5 rounded-lg hover:bg-white text-gray-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        aria-label="Previous month"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-100 text-xs font-bold">
                        <select
                          value={currentMonth.getMonth()}
                          onChange={handleMonthChange}
                          className="bg-transparent outline-none cursor-pointer"
                        >
                          {Array.from({ length: 12 }).map((_, i) => (
                            <option key={i} value={i}>
                              {format(new Date(2026, i, 1), "MMMM")}
                            </option>
                          ))}
                        </select>
                        <span className="text-gray-300">/</span>
                        <select
                          value={currentMonth.getFullYear()}
                          onChange={handleYearChange}
                          className="bg-transparent outline-none cursor-pointer"
                        >
                          {Array.from({ length: 4 }).map((_, i) => {
                            const year = today.getFullYear() + i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <button
                        onClick={nextMonth}
                        className="p-1.5 rounded-lg hover:bg-white text-gray-600 transition-all"
                        aria-label="Next month"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/70">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div
                          key={day}
                          className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 p-2 gap-1 sm:gap-1.5">
                      {daysInMonth.map((date) => {
                        const isPast = isBefore(date, today);
                        const isCurrentMonth = isSameMonth(date, currentMonth);
                        const isSelected = isSameDay(date, selectedDate);

                        return (
                          <button
                            key={date.toISOString()}
                            disabled={isPast || !isCurrentMonth}
                            onClick={() => {
                              setSelectedDate(date);
                            }}
                            className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                              isSelected
                                ? "bg-primary text-white font-bold shadow-sm ring-2 ring-primary ring-offset-1"
                                : isPast || !isCurrentMonth
                                ? "text-gray-300 cursor-not-allowed opacity-30 bg-transparent"
                                : "text-gray-700 bg-gray-50/80 hover:bg-primary/10 hover:text-primary font-medium"
                            }`}
                          >
                            <span>{format(date, "d")}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Time Slots Selection */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Select Available Time Slot
                    </span>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>

                  {isLoadingSlots ? (
                    <div className="p-8 text-center text-primary flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-xs">Checking real-time slot availability...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {getAvailableTimeSlots(selectedDate).map((time) => {
                        const isTaken = isTimeSlotTaken(time);
                        const isSelected = selectedTime === time;
                        const recommendation = getSlotRecommendation(time);

                        return (
                          <button
                            key={time}
                            disabled={isTaken}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? "bg-primary text-white border-primary shadow-xs ring-1 ring-primary/20"
                                : isTaken
                                ? "bg-gray-100/70 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                                : "bg-white border-gray-200 text-gray-700 hover:border-primary hover:bg-primary/5"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-sm">{time} WIB</span>
                              {isTaken && (
                                <span className="text-[9px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded">
                                  Booked
                                </span>
                              )}
                              {isSelected && !isTaken && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>

                            {recommendation && !isTaken && (
                              <span
                                className={`text-[10px] font-medium mt-1 truncate ${
                                  isSelected ? "text-white/80" : "text-amber-600"
                                }`}
                              >
                                {recommendation}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Back / Next Buttons */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    ← Back to Treatments
                  </button>

                  <button
                    type="button"
                    disabled={!selectedTime}
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Continue to Your Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: PERSONAL INFORMATION */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gray-900">
                    3. Personal Contact Details
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Your information is protected by medical confidentiality. We use this to send your booking confirmation pass.
                  </p>
                </div>

                <div className="space-y-4 max-w-xl">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (contactErrors.fullName) {
                            setContactErrors((prev) => ({ ...prev, fullName: "" }));
                          }
                        }}
                        placeholder="e.g. Jessica Widjaja"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                          contactErrors.fullName ? "border-red-500 bg-red-50/20" : "border-gray-200"
                        }`}
                      />
                    </div>
                    {contactErrors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1">{contactErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (contactErrors.email) {
                            setContactErrors((prev) => ({ ...prev, email: "" }));
                          }
                        }}
                        placeholder="e.g. jessica@example.com"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                          contactErrors.email ? "border-red-500 bg-red-50/20" : "border-gray-200"
                        }`}
                      />
                    </div>
                    {contactErrors.email && (
                      <p className="text-[11px] text-red-600 mt-1">{contactErrors.email}</p>
                    )}
                    <p className="text-[11px] text-gray-400 mt-1">
                      Your booking confirmation and live calendar pass will be emailed here.
                    </p>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      WhatsApp / Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (contactErrors.phone) {
                            setContactErrors((prev) => ({ ...prev, phone: "" }));
                          }
                        }}
                        placeholder="e.g. 0812-3456-7890 or +62 812..."
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                          contactErrors.phone ? "border-red-500 bg-red-50/20" : "border-gray-200"
                        }`}
                      />
                    </div>
                    {contactErrors.phone && (
                      <p className="text-[11px] text-red-600 mt-1">{contactErrors.phone}</p>
                    )}
                    <p className="text-[11px] text-gray-400 mt-1">
                      Our clinic will send visit reminders and location coordinates via WhatsApp.
                    </p>
                  </div>
                </div>

                {/* Back / Next Buttons */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    ← Back to Schedule
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateContactInfo()) {
                        setCurrentStep(4);
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <span>Review & Confirm</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: REVIEW & CONFIRMATION */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6"
              >
                <div>
                  <h2 className="font-serif text-2xl font-bold text-gray-900">
                    4. Final Review & Confirmation
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Please review your consultation request. No payment is required today for free consultations.
                  </p>
                </div>

                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Breakdown Card */}
                <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-4">
                  {/* Treatments list */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                      Selected Treatments ({selectedTreatments.length})
                    </span>
                    <div className="divide-y divide-gray-200/60 bg-white rounded-xl border border-gray-200/80 overflow-hidden">
                      {selectedTreatments.map((t) => (
                        <div key={t.id} className="p-3 flex items-center justify-between text-xs sm:text-sm">
                          <div>
                            <p className="font-semibold text-gray-900">{t.name}</p>
                            <p className="text-[11px] text-gray-400">⏱ {t.duration} • {t.category}</p>
                          </div>
                          <span className="font-mono font-bold text-primary">{t.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200/60 text-xs sm:text-sm">
                    <div className="bg-white p-3 rounded-xl border border-gray-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Date & Visit Time
                      </span>
                      <p className="font-semibold text-gray-900">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-xs text-primary font-mono font-bold mt-0.5">
                        {selectedTime} WIB
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-gray-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Patient Details
                      </span>
                      <p className="font-semibold text-gray-900">{fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{email}</p>
                      <p className="text-xs text-gray-500 font-mono">{phone}</p>
                    </div>
                  </div>

                  {additionalNotes && (
                    <div className="bg-white p-3 rounded-xl border border-gray-200/80 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Notes & Skin Concerns
                      </span>
                      <p className="text-gray-700 italic">"{additionalNotes}"</p>
                    </div>
                  )}

                  {/* Summary Totals */}
                  <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between text-sm sm:text-base font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">Total Investment:</span>
                      <span className="text-xs font-normal text-gray-400">({totalMinutes} mins)</span>
                    </div>
                    <span className="text-primary font-mono text-lg sm:text-xl">
                      {formatIDR(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* What Happens After Booking Guide */}
                <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 space-y-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span>What Happens After Submitting:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        1
                      </span>
                      <p>
                        <strong>Automated Booking Pass:</strong> You will immediately receive a Booking ID code and digital confirmation via email.
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        2
                      </span>
                      <p>
                        <strong>Live Status Tracker:</strong> Access your real-time booking tracker at <code>/appointment/[id]</code> anytime.
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        3
                      </span>
                      <p>
                        <strong>WhatsApp Coordination:</strong> Our aesthetic concierge coordinates any specific requests via WhatsApp.
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        4
                      </span>
                      <p>
                        <strong>Complimentary Clinic Care:</strong> Skin barrier herbal tea and free valet parking upon arrival.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Back / Confirm Submission Buttons */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    ← Back to Details
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                    className="px-7 py-3.5 rounded-xl bg-primary text-white font-bold text-sm sm:text-base hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-white" />
                        <span>Confirm & Send Booking Request</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </div>

          {/* RIGHT 4 COLUMNS: Sticky Live Summary Card (Small modal on the right side) */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h3 className="font-serif font-bold text-gray-900 text-base">
                    Live Booking Overview
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Step {currentStep} of 4
                </span>
              </div>

              {/* Treatments Itemization */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                  <span>Treatments</span>
                  <span>{selectedTreatments.length} chosen</span>
                </div>

                {selectedTreatments.length === 0 ? (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    Please select at least 1 treatment to proceed.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedTreatments.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 text-xs group"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-gray-800 truncate">{t.name}</p>
                          <p className="text-[10px] text-gray-400">⏱ {t.duration}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-bold text-primary">{t.price}</span>
                          <button
                            type="button"
                            onClick={() => toggleTreatment(t.id)}
                            className="text-gray-300 hover:text-red-500 p-0.5 transition-colors cursor-pointer"
                            title="Remove treatment"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Schedule Summary */}
              <div className="pt-3 border-t border-gray-100 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Chosen Schedule
                </span>
                <div className="flex items-center justify-between text-gray-800 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {format(selectedDate, "MMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1 font-mono font-bold text-primary">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {selectedTime} WIB
                  </span>
                </div>
              </div>

              {/* Patient Info Summary (if filled) */}
              {fullName && (
                <div className="pt-3 border-t border-gray-100 space-y-1 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Patient Profile
                  </span>
                  <p className="font-semibold text-gray-900 truncate">{fullName}</p>
                  {phone && <p className="text-gray-500 font-mono text-[11px] truncate">{phone}</p>}
                </div>
              )}

              {/* Live Totals Box */}
              <div className="pt-3 border-t border-gray-100 bg-gray-50 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-3xl">
                <div className="flex items-center justify-between mb-1 text-xs text-gray-500">
                  <span>Est. Duration:</span>
                  <span className="font-bold text-gray-800">⏱ {totalMinutes} mins</span>
                </div>
                <div className="flex items-center justify-between font-bold text-base text-gray-900">
                  <span>Total Investment:</span>
                  <span className="font-mono text-primary text-lg">{formatIDR(totalPrice)}</span>
                </div>

                {/* Primary Shortcut Button within Summary Card */}
                {currentStep < 4 ? (
                  <button
                    type="button"
                    disabled={selectedTreatments.length === 0}
                    onClick={() => {
                      if (currentStep === 1) setCurrentStep(2);
                      else if (currentStep === 2) setCurrentStep(3);
                      else if (currentStep === 3) {
                        if (validateContactInfo()) setCurrentStep(4);
                      }
                    }}
                    className="w-full mt-3 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>
                      {currentStep === 1
                        ? "Next: Select Schedule"
                        : currentStep === 2
                        ? "Next: Fill Contact"
                        : "Next: Review Summary"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalSubmit}
                    className="w-full mt-3 py-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 fill-white" />
                    )}
                    <span>Confirm & Send Request</span>
                  </button>
                )}
              </div>

            </div>

            {/* Quality & Trust Signals */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero obligation & honest medical advice</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 shrink-0 fill-amber-500" />
                <span>Rated 4.9/5 by 1,500+ SCBD patients</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
