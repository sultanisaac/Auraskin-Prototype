import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ShieldCheck, Clock, Award, Star, Loader2, Sparkles, ArrowLeft, ArrowRight, User, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { PrototypeNotice } from '../components/PrototypeNotice';
import { submitBooking, getConfirmedBookings, Booking } from '../actions/booking';
import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isBefore, startOfDay, getDay, setMonth, setYear } from 'date-fns';

const TREATMENT_OPTIONS = [
  'Acne Treatment',
  'Brightening Program',
  'Anti Aging',
  'Laser Rejuvenation',
  'Skin Booster',
  'General Consultation'
];

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  treatments: z.array(z.string()).min(1, 'Please select at least one treatment'),
  moreInfo: z.string().optional()
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const doctorParam = searchParams.get('doctor') || '';
  const treatmentParam = searchParams.get('treatment') || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1: Details, 2: Date & Time
  const [formData, setFormData] = useState<BookingFormValues | null>(null);
  
  // Date and Time selection state
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const defaultTreatments: string[] = [];
  if (treatmentParam && TREATMENT_OPTIONS.includes(treatmentParam)) {
    defaultTreatments.push(treatmentParam);
  } else if (doctorParam) {
    defaultTreatments.push('General Consultation');
  }

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      treatments: defaultTreatments,
      moreInfo: doctorParam ? `Preferred doctor: ${doctorParam}` : ''
    }
  });

  const onDetailsSubmit = (data: BookingFormValues) => {
    setFormData(data);
    setStep(2);
    loadConfirmedBookings();
  };

  const loadConfirmedBookings = async () => {
    setIsLoadingSlots(true);
    const bookings = await getConfirmedBookings();
    setConfirmedBookings(bookings);
    setIsLoadingSlots(false);
  };

  const onFinalSubmit = async () => {
    if (!formData || !selectedTime) return;
    setIsSubmitting(true);
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    const res = await submitBooking({
      ...formData,
      date: formattedDate,
      time: selectedTime
    });

    setIsSubmitting(false);
    
    if (res.success) {
      setIsSuccess(true);
      
      const message = `*New Booking Request*\n\n*Name:* ${formData.fullName}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Treatments:* ${formData.treatments.join(', ')}\n*Notes:* ${formData.moreInfo || '-'}\n*Date:* ${format(selectedDate, 'MMMM d, yyyy')}\n*Time:* ${selectedTime}`;
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=6281288882828&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
      
      // Attempt to open WhatsApp automatically
      window.open(whatsappUrl, '_blank');
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
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

  // Determine available time slots based on selected date
  const getAvailableTimeSlots = (date: Date) => {
    const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const endHour = isWeekend ? 18 : 20; // 18:00 for weekends, 20:00 for weekdays

    const slots = [];
    for (let hour = 9; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };
  
  // Check if a time slot is already confirmed
  const isTimeSlotTaken = (time: string) => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    return confirmedBookings.some(b => b.date === formattedDate && b.time === time);
  };

  if (isSuccess) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">Request Sent!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for choosing AuraSkin. We have received your booking request for <strong>{format(selectedDate, 'MMMM d, yyyy')}</strong> at <strong>{selectedTime}</strong>.
            <br/><br/>
            If WhatsApp didn't open automatically, please click below to send us your booking details to finalize your appointment.
          </p>
          <div className="space-y-3">
            <a 
              href={`https://api.whatsapp.com/send/?phone=6281288882828&text=${encodeURIComponent(`*New Booking Request*\n\n*Name:* ${formData?.fullName}\n*Email:* ${formData?.email}\n*Phone:* ${formData?.phone}\n*Treatments:* ${formData?.treatments.join(', ')}\n*Notes:* ${formData?.moreInfo || '-'}\n*Date:* ${format(selectedDate, 'MMMM d, yyyy')}\n*Time:* ${selectedTime}`)}&type=phone_number&app_absent=0`}
              target="_blank" 
              rel="noreferrer" 
              className="block w-full"
            >
              <Button variant="primary" className="w-full bg-[#25D366] hover:bg-[#128C7E] border-transparent shadow-md">
                Confirm via WhatsApp
              </Button>
            </a>
            <Link to="/" className="block w-full">
              <Button variant="outline" className="w-full border-gray-200 text-gray-600 hover:bg-gray-50">Return to Homepage</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back Link */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home Page
          </Link>
        </div>

        <PrototypeNotice className="mt-28 md:mt-0 mb-8 md:mb-12" />

        {/* Page Title & Intro */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-primary font-medium text-sm mb-4">
            <Sparkles className="w-4 h-4 text-primary fill-primary" /> 100% Free Consultation
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Start Your Journey to <span className="text-primary">Healthy, Radiant Skin</span>
          </h1>
          <p className="text-lg text-gray-600">
            Book a complimentary 15 minute consultation with our medical specialists in SCBD, Jakarta. Receive a clinical skin assessment and customized roadmap with zero sales pressure.
          </p>
        </div>

        {/* Two-Column Booking Hub */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Trust elements & expectations - Pushed below on mobile */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            
            {/* Consultation Blueprint */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h2 className="font-serif text-xl md:text-2xl font-bold text-gray-900 mb-6">What to Expect</h2>
              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "Advanced Skin Analysis",
                    desc: "Meet your dedicated aesthetic doctor for a close-up analysis. We examine hydration, sebum levels, pigmentation, and pores."
                  },
                  {
                    step: "02",
                    title: "Personalized Roadmap",
                    desc: "Receive a tailored treatment timeline and product adjustments based purely on your skin's biological needs."
                  },
                  {
                    step: "03",
                    title: "Zero Sales Pressure",
                    desc: "You can book treatments immediately, take the advice home, or think it over. We stand for transparency and clinical honesty."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <span className="font-serif font-bold text-xl text-secondary bg-secondary/10 px-2.5 py-1 rounded-xl shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1">{item.title}</h3>
                      <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Clinic Standards */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 px-2">AuraSkin Clinical Standards</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: <ShieldCheck className="text-secondary" />, title: "FDA Approved Lasers" },
                  { icon: <Award className="text-secondary" />, title: "Certified Specialist MDs" },
                  { icon: <Clock className="text-secondary" />, title: "SCBD CBD Location" },
                  { icon: <Star className="text-secondary" />, title: "4.9/5 Rating (1.5k+ Reviews)" }
                ].map((std, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="bg-primary/5 p-2 rounded-lg">{std.icon}</div>
                    <span className="text-xs md:text-sm font-semibold text-gray-700">{std.title}</span>
                  </div>
                ))}
              </div>
            </div>
 
            {/* High-quality Patient Testimonial */}
            <div className="bg-primary text-white rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 font-serif text-9xl transform translate-x-4 -translate-y-4 font-bold select-none">“</div>
              <p className="font-medium text-base md:text-lg leading-relaxed relative z-10 mb-6 italic">
                "The doctor took 15 minutes to look at my skin barrier and told me exactly why my previous routine wasn't working. No upsells, just pure clinical science. My skin has never looked better."
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80" 
                  alt="Reviewer" 
                  className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full border-2 border-white/20"
                />
                <div>
                  <h4 className="font-bold text-sm md:text-base">Valerie K.</h4>
                  <p className="text-[10px] md:text-xs text-gray-300">SCBD Patient since 2024</p>
                </div>
              </div>
            </div>
 
          </div>
 
          {/* Right Column: Dynamic Form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5 sm:p-8 md:p-12 overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="booking-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="font-serif text-3xl font-bold text-primary mb-2">Provide Your Details</h2>
                      <p className="text-sm text-gray-500">First, we need some contact information to sync with your patient profile.</p>
                    </div>

                    {doctorParam && (
                      <div className="flex items-center gap-3 bg-secondary/10 border border-secondary/20 p-4 rounded-2xl">
                        <div className="bg-white p-2.5 rounded-xl text-secondary shadow-sm">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-secondary font-bold uppercase tracking-wider">Preferred Specialist</p>
                          <p className="text-sm font-bold text-gray-800">{doctorParam}</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                          <input
                            {...register('fullName')}
                            type="text"
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200'
                            } focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm`}
                            placeholder="Jane Doe"
                          />
                          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                          <input
                            {...register('email')}
                            type="email"
                            className={`w-full px-4 py-3 rounded-xl border ${
                              errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'
                            } focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm`}
                            placeholder="jane@example.com"
                          />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp / Phone Number</label>
                        <input
                          {...register('phone')}
                          type="tel"
                          className={`w-full px-4 py-3 rounded-xl border ${
                            errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
                          } focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm`}
                          placeholder="+62 812..."
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Interest (Choose 1 or more)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {TREATMENT_OPTIONS.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all duration-200"
                            >
                              <input
                                type="checkbox"
                                value={option}
                                {...register('treatments')}
                                className="rounded text-primary focus:ring-primary focus:ring-offset-0 w-4.5 h-4.5 border-gray-300 transition cursor-pointer"
                              />
                              <span className="text-sm font-medium text-gray-700 select-none">{option}</span>
                            </label>
                          ))}
                        </div>
                        {errors.treatments && <p className="text-red-500 text-xs mt-1">{errors.treatments.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes (Optional)</label>
                        <textarea
                          {...register('moreInfo')}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm"
                          placeholder="Tell us about your skin concerns, allergies, or questions..."
                        />
                      </div>

                      <Button
                        variant="primary"
                        className="w-full py-4 text-base mt-2 gap-2"
                        type="submit"
                      >
                        <Calendar className="w-5 h-5" /> Choose Date & Time <ArrowRight className="w-4 h-4" />
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="booking-calendar"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-primary">Pick Your Slot</h2>
                        <p className="text-sm text-gray-500">Welcome, <span className="font-bold text-gray-800">{formData?.fullName}</span>. Please choose a consultation slot below.</p>
                      </div>
                      <button 
                        onClick={() => setStep(1)} 
                        className="text-xs text-gray-400 hover:text-primary transition underline font-medium whitespace-nowrap ml-4"
                      >
                        Back to Details
                      </button>
                    </div>

                    <div className="space-y-8">
                      {/* Date Selection */}
                      <div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                          <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">1. Select Date</label>
                          <div className="flex items-center gap-1 sm:gap-2 bg-gray-50/80 rounded-xl p-1 border border-gray-100 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
                            <button 
                              onClick={prevMonth} 
                              disabled={isBefore(currentMonth, startOfMonth(today))} 
                              className="p-2 rounded-lg hover:bg-white hover:shadow-sm hover:text-primary disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none disabled:hover:text-gray-600 transition-all"
                            >
                              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                            </button>
                            <div className="flex gap-1.5 justify-center bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                              <select 
                                value={currentMonth.getMonth()} 
                                onChange={handleMonthChange}
                                className="appearance-none bg-transparent text-gray-800 font-bold text-sm sm:text-base cursor-pointer outline-none hover:text-primary transition-colors focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 text-center"
                              >
                                {Array.from({ length: 12 }).map((_, i) => (
                                  <option key={i} value={i} className="text-gray-900">{format(new Date(2026, i, 1), 'MMMM')}</option>
                                ))}
                              </select>
                              <span className="text-gray-300 font-light select-none py-1">/</span>
                              <select 
                                value={currentMonth.getFullYear()} 
                                onChange={handleYearChange}
                                className="appearance-none bg-transparent text-gray-800 font-bold text-sm sm:text-base cursor-pointer outline-none hover:text-primary transition-colors focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 text-center"
                              >
                                {Array.from({ length: 5 }).map((_, i) => {
                                  const year = today.getFullYear() + i;
                                  return <option key={year} value={year} className="text-gray-900">{year}</option>;
                                })}
                              </select>
                            </div>
                            <button 
                              onClick={nextMonth} 
                              className="p-2 rounded-lg hover:bg-white hover:shadow-sm hover:text-primary transition-all"
                            >
                              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-sm">
                          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/80">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                              <div key={day} className="py-2.5 sm:py-3 text-center text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 p-1.5 sm:p-3 gap-1 sm:gap-1.5">
                            {daysInMonth.map(date => {
                              const isPast = isBefore(date, today);
                              const isCurrentMonth = isSameMonth(date, currentMonth);
                              const isSelected = isSameDay(date, selectedDate);
                              
                              return (
                                <button
                                  key={date.toISOString()}
                                  disabled={isPast || !isCurrentMonth}
                                  onClick={() => {
                                    setSelectedDate(date);
                                    setSelectedTime('');
                                  }}
                                  className={`aspect-square flex flex-col items-center justify-center rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-all duration-200 ${
                                    isSelected ? 'bg-primary text-white font-bold shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-2 scale-95' :
                                    isPast || !isCurrentMonth ? 'text-gray-300 cursor-not-allowed opacity-30 bg-transparent' :
                                    'text-gray-700 bg-gray-50 hover:bg-primary/10 hover:text-primary font-medium hover:scale-105 active:scale-95'
                                  }`}
                                >
                                  <span>{format(date, 'd')}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Time Selection */}
                      <div className="pt-2">
                        <label className="block text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center justify-between">
                          <span>2. Select Time</span>
                          <span className="text-primary font-medium bg-primary/10 px-3 py-1 rounded-full normal-case text-xs">
                            {format(selectedDate, 'MMM d, yyyy')}
                          </span>
                        </label>
                        
                        {isLoadingSlots ? (
                          <div className="flex items-center justify-center p-8 text-primary">
                            <Loader2 className="animate-spin w-8 h-8" />
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {getAvailableTimeSlots(selectedDate).map(time => {
                              const isTaken = isTimeSlotTaken(time);
                              return (
                                <button
                                  key={time}
                                  disabled={isTaken}
                                  onClick={() => setSelectedTime(time)}
                                  className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                                    isTaken ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed' :
                                    selectedTime === time 
                                      ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-1' 
                                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50'
                                  }`}
                                >
                                  {time}
                                  {isTaken && <span className="block text-[10px] mt-0.5">Booked</span>}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <Button
                        variant="primary"
                        className="w-full py-4 text-base gap-2 shadow-lg shadow-primary/20"
                        onClick={onFinalSubmit}
                        disabled={!selectedTime || isSubmitting}
                      >
                        {isSubmitting ? (
                          <><Loader2 className="animate-spin w-5 h-5" /> Processing...</>
                        ) : (
                          <>Confirm Booking Request</>
                        )}
                      </Button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
