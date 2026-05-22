import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin, Calendar, Clock, ChevronDown, Check, Star, ArrowRight, ShieldCheck, Award, ThumbsUp, Users, Instagram, Heart, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

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
      12 consultation slots available this week • <span className="underline cursor-pointer">Book Now</span>
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
        <Button variant="primary" className="hidden md:flex">
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
            <Button variant="primary" className="text-lg py-4 px-8">
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
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary">
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
        <Button variant="secondary" className="text-lg py-4 px-8 text-primary font-bold">
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
                <Button variant="outline" className="w-full">Book with {doc.name.split(' ')[1]}</Button>
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
            <Button variant="primary" className="w-full sm:w-auto">Check Eligibility & Promos</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  treatment: z.string().min(1, 'Please select a treatment'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const BookingFunnel = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema)
  });

  const onSubmit = (data: BookingFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      const text = `Hi AuraSkin, I would like to book a consultation.\n\nName: ${data.fullName}\nPhone: ${data.phone}\nTreatment: ${data.treatment}\nDate: ${data.date}\nTime: ${data.time}`;
      window.open(`https://wa.me/6281288882828?text=${encodeURIComponent(text)}`, '_blank');
    }, 1500);
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl font-bold text-primary mb-3">Book Your Consultation</h2>
            <p className="text-gray-600">Take the first step towards flawless skin.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input {...register('fullName')} type="text" className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary focus:border-primary outline-none transition`} placeholder="Jane Doe" />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                <input {...register('phone')} type="tel" className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary focus:border-primary outline-none transition`} placeholder="+62 812..." />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Interest</label>
              <div className="relative">
                <select {...register('treatment')} className={`w-full px-4 py-3 rounded-xl border ${errors.treatment ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary focus:border-primary outline-none transition appearance-none bg-white`}>
                  <option value="">Select Treatment</option>
                  <option value="Acne Treatment">Acne Treatment</option>
                  <option value="Brightening Program">Brightening Program</option>
                  <option value="Anti-Aging">Anti-Aging</option>
                  <option value="Laser Rejuvenation">Laser Rejuvenation</option>
                  <option value="Skin Booster">Skin Booster</option>
                  <option value="Consultation">General Consultation</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.treatment && <p className="text-red-500 text-xs mt-1">{errors.treatment.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <div className="relative">
                  <input {...register('date')} type="date" className={`w-full px-4 py-3 rounded-xl border ${errors.date ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary focus:border-primary outline-none transition`} />
                </div>
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                <div className="relative">
                  <select {...register('time')} className={`w-full px-4 py-3 rounded-xl border ${errors.time ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-primary focus:border-primary outline-none transition appearance-none bg-white`}>
                    <option value="">Select Time</option>
                    <option value="Morning">Morning (09:00 - 12:00)</option>
                    <option value="Afternoon">Afternoon (12:00 - 16:00)</option>
                    <option value="Evening">Evening (16:00 - 20:00)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>}
              </div>
            </div>

            <Button variant="primary" className="w-full py-4 text-lg mt-4" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
              Confirm Booking via WhatsApp
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

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
        <WhyChooseUs />
        <SocialProof />
        <Experts />
        <Pricing />
        <BookingFunnel />
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
      >
        <MessageCircle className="w-8 h-8" />
      </a>

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 flex">
        <a href="tel:+6281288882828" className="flex-1 py-4 flex flex-col items-center justify-center gap-1 font-medium text-gray-700 border-r border-gray-200 active:bg-gray-50">
          <Phone className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider">Call Us</span>
        </a>
        <a href="https://wa.me/6281288882828" className="flex-1 py-4 flex flex-col items-center justify-center gap-1 font-bold bg-primary text-white active:bg-primary/90">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider">Book Now</span>
        </a>
      </div>
      
      {/* Padding to prevent content from hiding behind mobile bar */}
      <div className="h-20 md:hidden bg-gray-900 w-full"></div>
    </div>
  );
}

export default App;
