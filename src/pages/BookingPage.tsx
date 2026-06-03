import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ShieldCheck, Clock, Award, Star, Loader2, Sparkles, ArrowLeft, ArrowRight, User } from 'lucide-react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { Button } from '../components/Button';

const CAL_LINK = (import.meta as any).env?.VITE_CALLINK?.replace('https://cal.com/', '') || 'sultan-isaac-jgohpm/auraskin-prototype';

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
  const [submittedData, setSubmittedData] = useState<BookingFormValues | null>(null);

  // Initialize Cal.com UI Styling
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: 'auraskin-prototype' });
      cal('ui', {
        theme: 'light',
        styles: { branding: { brandColor: '#0F4C5C' } },
        hideEventTypeDetails: true,
        layout: 'month_view',
      });
    })();
  }, []);

  // Pre-fill the form values based on URL parameters
  const defaultTreatments: string[] = [];
  if (treatmentParam && TREATMENT_OPTIONS.includes(treatmentParam)) {
    defaultTreatments.push(treatmentParam);
  } else if (doctorParam) {
    defaultTreatments.push('General Consultation');
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      treatments: defaultTreatments,
      moreInfo: doctorParam ? `Preferred doctor: ${doctorParam}` : ''
    }
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    // Simulate API call before embedding calendar
    setTimeout(() => {
      setSubmittedData(data);
      setIsSubmitting(false);
    }, 1200);
  };

  const resetForm = () => {
    setSubmittedData(null);
    reset();
  };

  // Compile notes string for Cal.com
  const getNoteStr = (data: BookingFormValues) => {
    const list = [`Treatments Interest: ${data.treatments.join(', ')}`, `WhatsApp Phone: ${data.phone}`];
    if (doctorParam) list.push(`Preferred Specialist: ${doctorParam}`);
    if (data.moreInfo) list.push(`Additional Info: ${data.moreInfo}`);
    return list.join(' | ');
  };

  // Compile dynamic link with pre-filled query parameters for Cal.com
  const getDynamicCalLink = () => {
    if (!submittedData) return CAL_LINK;
    
    const params = new URLSearchParams();
    params.set('name', submittedData.fullName);
    params.set('email', submittedData.email);
    params.set('phone', submittedData.phone);
    params.set('notes', getNoteStr(submittedData));
    params.set('theme', 'light');
    params.set('hideEventTypeDetails', 'true');
    if (submittedData.moreInfo) {
      params.set('More_info', submittedData.moreInfo);
    }
    
    let linkWithParams = `${CAL_LINK}?${params.toString()}`;
    
    // Append duplicate keys for multi-select field (Cal.com query format)
    if (submittedData.treatments && submittedData.treatments.length > 0) {
      submittedData.treatments.forEach((treatment) => {
        linkWithParams += `&Treatment_Interest=${encodeURIComponent(treatment)}`;
      });
    }
    
    return linkWithParams;
  };

  return (
    <div className="bg-background min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back Link */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home Page
          </Link>
        </div>

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
 
          {/* Right Column: Dynamic Form / Cal.com Embed - Rendered at top on mobile */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-5 sm:p-8 md:p-12">
              <AnimatePresence mode="wait">
                {!submittedData ? (
                  <motion.div
                    key="booking-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
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

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin w-5 h-5" /> Verifying Profile...
                          </>
                        ) : (
                          <>
                            <Calendar className="w-5 h-5" /> Verify & View Available Slots <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                      <p className="text-center text-xs text-gray-400">
                        By submitting, you consent to receive booking updates via WhatsApp/Email.
                      </p>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="booking-calendar"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-gray-100 pb-5">
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-primary">Pick Your Slot</h2>
                        <p className="text-sm text-gray-500">Welcome, <span className="font-bold text-gray-800">{submittedData.fullName}</span>. Please choose a consultation slot below.</p>
                      </div>
                      <button 
                        onClick={resetForm} 
                        className="text-xs text-gray-400 hover:text-primary transition underline font-medium"
                      >
                        Edit Details
                      </button>
                    </div>

                    {/* Inline Cal.com scheduler with prefilled details */}
                    <div className="h-[550px] border border-gray-100 rounded-2xl overflow-hidden shadow-inner bg-gray-50">
                      <Cal
                        namespace="auraskin-prototype"
                        calLink={getDynamicCalLink()}
                        style={{ width: "100%", height: "100%", overflow: "scroll" }}
                        config={{}}
                      />
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
