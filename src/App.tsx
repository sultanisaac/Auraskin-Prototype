import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin, Calendar, Clock, ChevronDown, Check, Star, ArrowRight, ShieldCheck, Award, ThumbsUp, Users, Instagram, Heart, Sparkles, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import Cal, { getCalApi } from '@calcom/embed-react';

const CAL_LINK = (import.meta as any).env?.VITE_CALLINK?.replace('https://cal.com/', '') || 'sultan-isaac-jgohpm/auraskin-prototype';

// --- Placeholder Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-md px-6 py-3";
  const variants = {
    primary: "bg-primary text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl",
    secondary: "bg-secondary text-white hover:bg-opacity-90 shadow-md",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-primary/10"
  };
  return (
    <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Sections ---

const TopBar = () => (
  <div className="bg-secondary text-white text-center py-2 px-4 text-sm font-medium">
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
      12 consultation slots available this week • <span className="underline cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}>Book Now</span>
    </motion.span>
  </div>
);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="text-secondary w-8 h-8" />
          <span className="font-serif text-2xl font-bold text-primary">AuraSkin</span>
          <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold tracking-widest uppercase rounded shadow-sm">Prototype</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#treatments" className="text-gray-600 hover:text-primary transition font-medium">Treatments</a>
          <a href="#results" className="text-gray-600 hover:text-primary transition font-medium">Results</a>
          <a href="#about" className="text-gray-600 hover:text-primary transition font-medium">Why Us</a>
          <a href="#pricing" className="text-gray-600 hover:text-primary transition font-medium">Pricing</a>
        </nav>
        <Button variant="primary" className="hidden md:flex" onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}>
          Book Consultation
        </Button>
      </div>
    </header>
  );
};

const Hero = () => (
  <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-background">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-primary font-medium text-sm">
            <Star className="w-4 h-4 fill-secondary text-secondary" /> 4.9 Rating • 20,000+ Treatments
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Reveal Your Best Skin With <span className="text-primary">Expert Care</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            Advanced aesthetic treatments tailored to your skin goals. Trusted by thousands of women across Jakarta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" className="text-lg py-4 px-8" onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}>
              Book Free Consultation
            </Button>
            <Button variant="outline" className="text-lg py-4 px-8">
              View Treatments
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-4 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2"><Check className="w-5 h-5 text-secondary" /> 15+ Doctors</div>
            <div className="flex items-center gap-2"><Check className="w-5 h-5 text-secondary" /> 10 Years Exp.</div>
            <div className="flex items-center gap-2"><Check className="w-5 h-5 text-secondary" /> FDA Approved</div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-secondary rounded-[2rem] transform rotate-3 scale-105 opacity-20"></div>
          <img 
            src="https://placehold.co/1200x800/0F4C5C/FFFFFF?text=Hero+Image" 
            alt="Premium Beauty Clinic" 
            className="rounded-[2rem] shadow-2xl relative z-10 object-cover h-[400px] md:h-[500px] lg:h-[600px] w-full"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl z-20 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Board-Certified</p>
              <p className="text-sm text-gray-500">Aesthetic Doctors</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const TrustBadges = () => (
  <div className="bg-white py-10 border-y border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
        {['Licensed Clinic', 'Certified Doctors', 'FDA Approved', '20,000+ Treatments'].map((text, i) => (
          <div key={i} className="flex items-center gap-2 font-serif font-bold text-lg text-primary">
            <Check className="text-secondary" /> {text}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BeforeAfter = () => {
  const results = [
    {
      title: "Acne Reset Program",
      duration: "3 Months (4 Sessions)",
      before: "https://placehold.co/500x500/E8DCCB/1F2937?text=Before",
      after: "https://placehold.co/500x500/0F4C5C/FFFFFF?text=After"
    },
    {
      title: "Pico Laser Brightening",
      duration: "1 Month (2 Sessions)",
      before: "https://placehold.co/500x500/E8DCCB/1F2937?text=Before",
      after: "https://placehold.co/500x500/0F4C5C/FFFFFF?text=After"
    },
    {
      title: "Skin Booster & Contouring",
      duration: "Instant Result",
      before: "https://placehold.co/500x500/E8DCCB/1F2937?text=Before",
      after: "https://placehold.co/500x500/0F4C5C/FFFFFF?text=After"
    }
  ];

  return (
    <section id="results" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Real Results. Real Confidence.</h2>
        <p className="text-gray-600 mb-16 max-w-2xl mx-auto">See the transformative power of our personalized treatment plans.</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((r, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
            >
              <div className="h-64 relative group">
                <ReactCompareSlider
                  itemOne={<ReactCompareSliderImage src={r.before} alt="Before" />}
                  itemTwo={<ReactCompareSliderImage src={r.after} alt="After" />}
                  className="h-full w-full"
                />
                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10 pointer-events-none">Before</div>
                <div className="absolute top-3 right-3 bg-primary/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10 pointer-events-none">After</div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-gray-800 shadow-lg flex items-center gap-1">
                    Drag <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <div className="p-6 text-left">
                <h3 className="font-bold text-xl mb-2">{r.title}</h3>
                <p className="text-sm text-gray-500 mb-4">Duration: {r.duration}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12">
          <Button variant="primary">Get My Personalized Plan</Button>
        </div>
      </div>
    </section>
  );
};

const Treatments = () => {
  const treatments = [
    { name: 'Acne Reset Program', price: 'Rp 799.000', desc: 'Clear acne and prevent breakouts', time: '60 mins', img: 'https://placehold.co/500x500/FAF8F4/0F4C5C?text=Acne+Treatment' },
    { name: 'Glass Skin Facial', price: 'Rp 999.000', desc: 'Deep hydration and instant glow', time: '90 mins', img: 'https://placehold.co/500x500/FAF8F4/0F4C5C?text=Glass+Skin' },
    { name: 'Pico Laser Brightening', price: 'Rp 1.490.000', desc: 'Target pigmentation and dark spots', time: '45 mins', img: 'https://placehold.co/500x500/FAF8F4/0F4C5C?text=Pico+Laser' },
    { name: 'Skin Booster', price: 'Rp 2.490.000', desc: 'Deep nourishment and anti-aging', time: '30 mins', img: 'https://placehold.co/500x500/FAF8F4/0F4C5C?text=Skin+Booster' },
  ];

  return (
    <section id="treatments" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Popular Treatments</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Expertly curated procedures designed to deliver visible, long-lasting results.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {treatments.map((t, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.03 }}
              className="group bg-background rounded-2xl p-6 border border-transparent hover:border-secondary transition-all"
            >
              <div className="h-48 rounded-xl mb-6 overflow-hidden relative">
                <img src={t.img} alt={t.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-serif font-bold text-xl mb-2 text-primary">{t.name}</h3>
              <p className="text-sm text-gray-600 mb-4 h-10">{t.desc}</p>
              <div className="flex justify-between items-center mb-6 text-sm font-medium">
                <span className="text-gray-500"><Clock className="w-4 h-4 inline mr-1" />{t.time}</span>
                <span className="text-secondary">From {t.price}</span>
              </div>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary" onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}>
                Book Consultation
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const WhyChooseUs = () => {
  const reasons = [
    { icon: <Sparkles />, title: 'Advanced Technology', desc: 'Latest FDA-approved devices.' },
    { icon: <Award />, title: 'Expert Doctors', desc: 'Certified aesthetic specialists.' },
    { icon: <Heart />, title: 'Personalized Care', desc: 'Every skin is unique.' },
    { icon: <ShieldCheck />, title: 'Transparent Pricing', desc: 'No hidden fees.' },
    { icon: <ThumbsUp />, title: '20,000+ Treatments', desc: 'Proven patient satisfaction.' },
    { icon: <MessageCircle />, title: 'Free Consultation', desc: 'No obligation assessment.' }
  ];

  return (
    <section id="about" className="py-24 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold mb-4">Why Choose AuraSkin</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">We combine medical expertise with luxury care to deliver exceptional results.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((r, i) => (
            <div key={i} className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all">
              <div className="text-secondary mb-4 w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl">
                {r.icon}
              </div>
              <h3 className="font-bold text-xl mb-2">{r.title}</h3>
              <p className="text-gray-300">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQ = () => {
  const faqs = [
    "Does laser treatment hurt?",
    "How many sessions are needed?",
    "How long is recovery?",
    "Can men receive treatments?",
    "How much does consultation cost?",
    "Are treatments safe?",
    "When can I see results?"
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-4xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((q, i) => (
            <details key={i} className="group bg-white rounded-xl shadow-sm border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-lg">
                {q}
                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-6 pt-0 text-gray-600 border-t border-gray-100">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const FinalCTA = () => (
  <section className="py-24 bg-primary relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
      <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Ready To Transform Your Skin?</h2>
      <p className="text-xl text-gray-300 mb-10">Claim your free consultation and receive a personalized treatment plan from our expert team.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button variant="secondary" className="text-lg py-4 px-8 text-primary font-bold" onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}>
          Book Free Consultation
        </Button>
        <Button variant="outline" className="text-lg py-4 px-8 border-white text-white hover:bg-white hover:text-primary">
          <MessageCircle className="mr-2" /> Chat on WhatsApp
        </Button>
      </div>
    </div>
  </section>
);

const SocialProof = () => {
  const reviews = [
    { name: "Sarah M.", loc: "Jakarta Selatan", text: "My acne scars improved dramatically after only 3 sessions. The doctors here are truly experts in what they do.", img: "https://placehold.co/150x150/D4B483/FFFFFF?text=SM" },
    { name: "Jessica T.", loc: "Menteng", text: "The glass skin facial gave me the exact results I wanted for my wedding day. Absolutely premium service.", img: "https://placehold.co/150x150/D4B483/FFFFFF?text=JT" },
    { name: "Anita W.", loc: "Senayan", text: "Transparent pricing and no pushy sales. They genuinely care about your skin goals. Highly recommended!", img: "https://placehold.co/150x150/D4B483/FFFFFF?text=AW" },
  ];

  return (
    <section className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Loved By Thousands</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. Here is what our patients have to say.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {reviews.map((r, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} className="bg-background p-8 rounded-2xl border border-gray-100 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex text-secondary mb-4">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-700 mb-6 italic">"{r.text}"</p>
              </div>
              <div className="flex items-center gap-4">
                <img src={r.img} alt={r.name} className="w-12 h-12 object-cover rounded-full shadow-sm" />
                <div>
                  <h4 className="font-bold text-gray-900">{r.name}</h4>
                  <p className="text-sm text-gray-500">{r.loc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-gray-100 pt-16">
          <div>
            <div className="text-4xl font-serif font-bold text-primary mb-2">20,000+</div>
            <div className="text-gray-500 font-medium">Patients</div>
          </div>
          <div>
            <div className="text-4xl font-serif font-bold text-primary mb-2">4.9</div>
            <div className="text-gray-500 font-medium">Rating</div>
          </div>
          <div>
            <div className="text-4xl font-serif font-bold text-primary mb-2">1,500+</div>
            <div className="text-gray-500 font-medium">Reviews</div>
          </div>
          <div>
            <div className="text-4xl font-serif font-bold text-primary mb-2">250K</div>
            <div className="text-gray-500 font-medium">Instagram</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Experts = () => {
  const doctors = [
    { name: 'Dr. Amanda Wijaya', role: 'Aesthetic Medicine Specialist', exp: '12 Years Experience', spec: 'Laser & Skin Rejuvenation', img: 'https://placehold.co/600x800/E8DCCB/1F2937?text=Dr.+Amanda' },
    { name: 'Dr. Budi Santoso', role: 'Dermatologist', exp: '15 Years Experience', spec: 'Acne & Scar Treatment', img: 'https://placehold.co/600x800/E8DCCB/1F2937?text=Dr.+Budi' },
    { name: 'Dr. Clara Lee', role: 'Aesthetic Doctor', exp: '8 Years Experience', spec: 'Facial Contouring', img: 'https://placehold.co/600x800/E8DCCB/1F2937?text=Dr.+Clara' }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Meet Our Experts</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Board-certified specialists dedicated to your skin's health and beauty.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {doctors.map((doc, i) => (
            <motion.div key={i} whileHover={{ y: -10 }} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <img src={doc.img} alt={doc.name} className="w-full h-80 object-cover object-top" />
              <div className="p-6">
                <h3 className="font-serif font-bold text-2xl text-primary mb-1">{doc.name}</h3>
                <p className="text-secondary font-medium mb-4">{doc.role}</p>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> {doc.exp}</div>
                  <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> {doc.spec}</div>
                </div>
                <Button variant="outline" className="w-full" onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}>Book with {doc.name.split(' ')[1]}</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  const prices = [
    { service: 'Deep Cleansing Facial', price: 'Rp 399.000' },
    { service: 'Intensive Acne Program', price: 'Rp 799.000' },
    { service: 'Pico Laser Rejuvenation', price: 'Rp 1.490.000' },
    { service: 'Premium Skin Booster', price: 'Rp 2.490.000' },
  ];

  return (
    <section id="pricing" className="py-24 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
          <p className="text-gray-600">Premium care without the hidden costs.</p>
        </div>

        <div className="bg-background rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="space-y-6">
            {prices.map((p, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <span className="font-medium text-lg text-gray-800">{p.service}</span>
                <span className="font-serif font-bold text-xl text-primary">{p.price}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="primary" className="w-full sm:w-auto" onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}>Check Eligibility & Promos</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const TREATMENT_OPTIONS = [
  'Acne Treatment',
  'Brightening Program',
  'Anti-Aging',
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

// Global Cal.com initializer
const useCalInit = () => {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: 'auraskin-prototype' });
      cal('ui', {
        theme: 'light',
        styles: { branding: { brandColor: '#0F4C5C' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);
};

// Booking Modal: collects user info, then triggers Cal.com popup
const BookingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  useCalInit();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openBookingModal', handleOpen);
    return () => window.removeEventListener('openBookingModal', handleOpen);
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      treatments: []
    }
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setIsSuccess(true);
    const noteStr = `Treatments: ${data.treatments.join(', ')} | Phone: ${data.phone} | More Info: ${data.moreInfo || ''}`;
    setTimeout(async () => {
      const cal = await getCalApi({ namespace: 'auraskin-prototype' });
      const queryParams = new URLSearchParams();
      queryParams.set('name', data.fullName);
      queryParams.set('email', data.email);
      queryParams.set('phone', data.phone);
      data.treatments.forEach(t => queryParams.append('Treatment_Interest', t));
      queryParams.set('More_info', data.moreInfo || '');

      cal('modal', {
        calLink: `${CAL_LINK}?${queryParams.toString()}`,
        config: {
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          notes: noteStr,
          Treatment_Interest: data.treatments,
          More_info: data.moreInfo || '',
          theme: 'light',
        },
      });
    }, 1200);
    reset();
    setIsSubmitting(false);
  };

  const close = () => { setIsOpen(false); reset(); setIsSuccess(false); };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="booking-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <motion.div
            key="booking-modal-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative p-8 md:p-12 my-auto"
          >
            {/* Header */}
            <button
              onClick={close}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-bold text-primary mb-2">Book Your Consultation</h2>
              <p className="text-gray-500 text-sm">Fill in your details and we'll open the calendar for you to pick a slot.</p>
            </div>

            {isSuccess ? (
              <div className="text-center py-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Check className="w-10 h-10 text-green-600" />
                </motion.div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">You're All Set! 🎉</h3>
                <p className="text-gray-500 text-sm mb-1">Your details have been received.</p>
                <p className="text-primary font-medium text-sm">Your calendar is opening to pick a time slot...</p>
                <button onClick={close} className="mt-8 text-sm text-gray-400 hover:text-gray-600 transition underline">Close</button>
              </div>
            ) : (
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
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

              {/* More Info */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">More Info</label>
                <textarea
                  {...register('moreInfo')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm"
                  placeholder="Additional details (optional)"
                  rows={3}
                />
              </div>

              <Button
                variant="primary"
                className="w-full py-4 text-base mt-2 gap-2"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                Confirm & Choose Your Slot
              </Button>
              <p className="text-center text-xs text-gray-400">We’ll schedule your appointment after you submit the form.</p>
            </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const InlineBookingSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      treatments: []
    }
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setIsSuccess(true);
    const noteStr = `Treatments: ${data.treatments.join(', ')} | Phone: ${data.phone} | More Info: ${data.moreInfo || ''}`;
    setTimeout(async () => {
      const cal = await getCalApi({ namespace: 'auraskin-prototype' });
      const queryParams = new URLSearchParams();
      queryParams.set('name', data.fullName);
      queryParams.set('email', data.email);
      queryParams.set('phone', data.phone);
      data.treatments.forEach(t => queryParams.append('Treatment_Interest', t));
      queryParams.set('More_info', data.moreInfo || '');

      cal('modal', {
        calLink: `${CAL_LINK}?${queryParams.toString()}`,
        config: {
          name: data.fullName,
          email: data.email,
          phone: data.phone,
          notes: noteStr,
          Treatment_Interest: data.treatments,
          More_info: data.moreInfo || '',
          theme: 'light',
        },
      });
    }, 1200);
    setTimeout(() => setIsSuccess(false), 8000);
    reset();
    setIsSubmitting(false);
  };

  return (
    <section id="booking" className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-primary font-medium text-sm mb-4">
            <Calendar className="w-4 h-4" /> Book a Free Consultation
          </div>
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Schedule Your Visit</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Fill in your details below and we'll open the calendar so you can pick your preferred time slot.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
          {isSuccess ? (
            <div className="text-center py-10">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Check className="w-10 h-10 text-green-600" />
              </motion.div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">You're All Set! 🎉</h3>
              <p className="text-gray-500 text-sm mb-1">Your details have been received.</p>
              <p className="text-primary font-medium text-sm">Your calendar is opening to pick a time slot...</p>
            </div>
          ) : (
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">More Info</label>
              <textarea
                {...register('moreInfo')}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition text-sm"
                placeholder="Any additional details you'd like us to know... (optional)"
              />
            </div>

            <Button
              variant="primary"
              className="w-full py-4 text-base gap-2"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Calendar className="w-4 h-4" />}
              Confirm &amp; Choose Your Slot
            </Button>
            <p className="text-center text-xs text-gray-400">
              No obligation. We'll open the live calendar so you can pick your exact date &amp; time.
            </p>
          </form>
          )}
        </div>
      </div>
    </section>
  );
};


// --- Gallery Section ---
const GALLERY_ITEMS = [
  { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', label: 'Acne Treatment' },
  { src: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80', label: 'Brightening' },
  { src: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80', label: 'Laser Therapy' },
  { src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', label: 'Skin Booster' },
  { src: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80', label: 'Anti-Aging' },
  { src: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600&q=80', label: 'Rejuvenation' },
];

const GallerySection = () => (
  <section id="gallery" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-primary font-medium text-sm mb-4">
          <Heart className="w-4 h-4" /> Real Results
        </div>
        <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Treatment Results</h2>
        <p className="text-gray-600 max-w-xl mx-auto">Transformations experienced by our patients. All results are from real AuraSkin treatments.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {GALLERY_ITEMS.map((item, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }} className="relative group overflow-hidden rounded-2xl aspect-square bg-gray-100">
            <img src={item.src} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white font-semibold text-sm">{item.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-10">
        <button onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))} className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition shadow-lg">
          <Calendar className="w-5 h-5" /> Book Your Transformation
        </button>
      </div>
    </div>
  </section>
);

// --- Promotions Section ---
const PACKAGES = [
  {
    badge: 'Most Popular', name: 'Acne Clear Package', highlight: true,
    description: 'Complete acne solution combining laser therapy, extraction, and skin barrier repair.',
    treatments: ['Acne Laser Therapy', 'Deep Extraction', 'Skin Booster', 'Home Care Kit'],
    original: 'Rp 4,500,000', price: 'Rp 2,999,000', sessions: '3 Sessions',
  },
  {
    badge: 'Best Value', name: 'Bridal Glow Package', highlight: false,
    description: "Look your absolute best on your special day with our signature bridal program.",
    treatments: ['Brightening Program', 'Anti-Aging Facial', 'Hydra Infusion', 'Post-Care Kit'],
    original: 'Rp 7,000,000', price: 'Rp 4,499,000', sessions: '5 Sessions',
  },
  {
    badge: 'Premium', name: 'Anti-Aging Revival', highlight: false,
    description: 'Turn back the clock with our scientifically-backed combination therapy.',
    treatments: ['Laser Rejuvenation', 'Filler Consultation', 'Skin Booster', 'Monthly Follow-up'],
    original: 'Rp 9,500,000', price: 'Rp 6,499,000', sessions: '6 Sessions',
  },
];

const PromotionsSection = () => (
  <section id="promotions" className="py-24 bg-primary/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary font-medium text-sm mb-4">
          <Sparkles className="w-4 h-4" /> Limited Time Packages
        </div>
        <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Special Treatment Packages</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Curated bundles for maximum results. Save up to 40% vs. individual sessions.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {PACKAGES.map((pkg) => (
          <motion.div key={pkg.name} whileHover={{ y: -8 }} className={`relative bg-white rounded-3xl shadow-xl border-2 overflow-hidden ${pkg.highlight ? 'border-primary' : 'border-gray-100'}`}>
            {pkg.highlight && <div className="bg-primary text-white text-center text-xs font-bold py-1.5 tracking-widest uppercase">⭐ Most Popular</div>}
            <div className={`p-8 ${pkg.highlight ? 'pt-6' : ''}`}>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${pkg.highlight ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{pkg.badge}</span>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
              <p className="text-gray-500 text-sm mb-5">{pkg.description}</p>
              <ul className="space-y-2 mb-8">
                {pkg.treatments.map(t => (
                  <li key={t} className="flex items-center gap-2 text-sm text-gray-700"><Check className="w-4 h-4 text-primary shrink-0" />{t}</li>
                ))}
              </ul>
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-400 text-sm line-through">{pkg.original}</span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Save!</span>
                </div>
                <div className="text-3xl font-bold text-primary mb-1">{pkg.price}</div>
                <div className="text-gray-500 text-xs mb-6">{pkg.sessions} included</div>
                <button onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))} className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${pkg.highlight ? 'bg-primary text-white hover:bg-primary/90 shadow-lg' : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}>
                  Claim This Package
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mt-8">* Packages valid for 3 months from purchase. Terms apply.</p>
    </div>
  </section>
);

// --- Location Section ---
const LocationSection = () => (
  <section id="location" className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-primary font-medium text-sm mb-4">
          <MapPin className="w-4 h-4" /> Find Us
        </div>
        <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Visit Our Clinic</h2>
        <p className="text-gray-600 max-w-xl mx-auto">Conveniently located in Jakarta's CBD. Easy access by car, MRT, or TransJakarta.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200" style={{ height: 420 }}>
          <iframe title="AuraSkin Jakarta" src="https://maps.google.com/maps?q=SCBD+Tower+2+Jakarta+Selatan&output=embed&z=15" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
        <div className="space-y-4">
          {[
            { icon: <MapPin className="w-5 h-5 text-primary" />, title: 'Address', content: <p className="text-gray-600 text-sm">SCBD Tower 2, Jl. Jend. Sudirman Kav. 52–53,<br />Jakarta Selatan 12190, Indonesia</p> },
            { icon: <Clock className="w-5 h-5 text-primary" />, title: 'Clinic Hours', content: <div className="text-sm text-gray-600 space-y-1"><div className="flex justify-between gap-8"><span>Monday – Friday</span><span className="font-medium">09:00 – 20:00</span></div><div className="flex justify-between gap-8"><span>Saturday – Sunday</span><span className="font-medium">09:00 – 18:00</span></div></div> },
            { icon: <Phone className="w-5 h-5 text-primary" />, title: 'Contact', content: <p className="text-sm text-gray-600">WhatsApp: <a href="https://wa.me/6281288882828" className="text-primary font-medium hover:underline">+62 812-8888-2828</a></p> },
            { icon: <ArrowRight className="w-5 h-5 text-primary" />, title: 'Getting Here', content: <ul className="text-sm text-gray-600 space-y-1"><li>🚇 MRT: Senayan Station (5 min walk)</li><li>🚌 TransJakarta: Halte Bendungan Hilir</li><li>🚗 Valet parking available at SCBD Tower 2</li></ul> },
          ].map(({ icon, title, content }) => (
            <div key={title} className="flex gap-4 items-start bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="bg-primary/10 p-3 rounded-xl shrink-0">{icon}</div>
              <div><h4 className="font-bold text-gray-900 mb-1">{title}</h4>{content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-secondary w-6 h-6" />
          <span className="font-serif text-2xl font-bold text-white">AuraSkin</span>
          <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold tracking-widest uppercase rounded">Prototype</span>
        </div>
        <p className="text-sm text-yellow-400 font-medium mb-4 italic">*This website is a design prototype for demonstration purposes only.*</p>
        <p className="mb-6">Natural Beauty. Expert Results. Premium aesthetic clinic in Jakarta.</p>
        <div className="flex space-x-4">
          <Instagram className="w-6 h-6 hover:text-white cursor-pointer transition" />
        </div>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Contact</h4>
        <ul className="space-y-3">
          <li className="flex gap-2"><MapPin className="w-5 h-5 shrink-0" /> SCBD Tower 2, Jl. Jend. Sudirman, Jakarta Selatan 12190</li>
          <li className="flex gap-2"><Phone className="w-5 h-5 shrink-0" /> +62 812-8888-2828</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Hours</h4>
        <ul className="space-y-2">
          <li>Mon-Fri: 09:00 - 20:00</li>
          <li>Sat-Sun: 09:00 - 18:00</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Links</h4>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
        </ul>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <TopBar />
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <BeforeAfter />
        <Treatments />
        <GallerySection />
        <PromotionsSection />
        <WhyChooseUs />
        <SocialProof />
        <Experts />
        <Pricing />
        <InlineBookingSection />
        <LocationSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      
      {/* Floating WhatsApp - Desktop Only */}
      <a 
        href="https://wa.me/6281288882828" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-transform hover:scale-110 z-50 hidden md:flex items-center justify-center"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-8 h-8" />
      </a>

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 flex">
        <a href="tel:+6281288882828" className="flex-1 py-4 flex flex-col items-center justify-center gap-1 font-medium text-gray-700 border-r border-gray-200 active:bg-gray-50">
          <Phone className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider">Call Us</span>
        </a>
        <button onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))} className="flex-1 py-4 flex flex-col items-center justify-center gap-1 font-bold bg-primary text-white active:bg-primary/90">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider">Book Now</span>
        </button>
      </div>
      
      {/* Booking Modal - global, rendered once */}
      <BookingModal />

      {/* Padding to prevent content from hiding behind mobile bar */}
      <div className="h-20 md:hidden bg-gray-900 w-full"></div>
    </div>
  );
}

export default App;
