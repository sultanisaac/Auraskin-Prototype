import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, MessageCircle, MapPin, Calendar, Clock, ChevronDown, Check, Star, 
  ArrowRight, ShieldCheck, Award, ThumbsUp, Heart, Sparkles 
} from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Button } from '../components/Button';
import { PrototypeNotice } from '../components/PrototypeNotice';

// --- Sub-sections of the Homepage ---

const Hero = () => {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Check if the user has a slow connection or data saver enabled
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g' || conn.effectiveType === '3g') {
        setIsSlowConnection(true);
      }
    }
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-background">
      {/* Background Media */}
      <div className="absolute inset-0">
        {!isSlowConnection ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
            poster="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=2400&q=80"
          >
            <source src="/hero-image.mp4.mp4" type="video/mp4" />
          </video>
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=2400&q=80"
            alt="Premium Clinic"
            className="w-full h-full object-cover object-center"
          />
        )}
        {/* Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background/95" />
      </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center mt-16 md:mt-24">
      <PrototypeNotice className="mb-8 md:mb-12 max-w-2xl mx-auto" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="space-y-6 md:space-y-8 max-w-3xl"
      >
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-light text-white leading-[1.1]">
          Reclaim Your <span className="font-bold italic text-secondary">Natural Glow</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-200 font-light leading-relaxed max-w-2xl mx-auto">
          A bespoke approach to aesthetic medicine, designed to honor your unique beauty and elevate your confidence through science and artistry.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link to="/book-consultation" className="w-full sm:w-auto">
            <Button variant="primary" className="text-base md:text-lg py-4 px-10 w-full hover:scale-105 transition-transform duration-300">
              Schedule Your Treatment
            </Button>
          </Link>
          <Link to="/treatments" className="w-full sm:w-auto">
            <Button variant="outline" className="text-base md:text-lg py-4 px-10 w-full border-white/30 text-white hover:bg-white hover:text-gray-900 transition-colors duration-300">
              Explore Treatments
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
    
    {/* Scroll indicator */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
    >
      <span className="text-[10px] tracking-widest uppercase">Scroll</span>
      <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
    </motion.div>
  </section>
  );
};

const TrustBadges = () => (
  <div className="bg-white py-6 md:py-10 border-y border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-4 md:gap-16 opacity-85">
        {[
          { text: 'Licensed Clinic', key: 1 }, 
          { text: 'Certified Doctors', key: 2 }, 
          { text: 'FDA Approved', key: 3 }, 
          { text: '20,000+ Treatments', key: 4 }
        ].map((item) => (
          <div key={item.key} className="flex items-center gap-2 font-serif font-bold text-sm sm:text-base lg:text-lg text-primary justify-center md:justify-start">
            <Check className="text-secondary shrink-0 w-4 h-4 sm:w-5 sm:h-5" /> <span>{item.text}</span>
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
      before: "/transformations/acne_before.png",
      after: "/transformations/acne_after.png"
    },
    {
      title: "Pico Laser Brightening",
      duration: "1 Month (2 Sessions)",
      before: "/transformations/pico_before.png",
      after: "/transformations/pico_after.png"
    },
    {
      title: "Skin Booster & Contouring",
      duration: "Instant Result",
      before: "/transformations/contour_before.png",
      after: "/transformations/contour_after.png"
    }
  ];

  return (
    <section id="results" className="py-16 md:py-24 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-2xl md:text-4xl font-bold text-gray-900 mb-3">The Beautiful Transformations</h2>
        <p className="text-sm md:text-base text-gray-600 mb-10 md:mb-16 max-w-2xl mx-auto">Witness the artistry of our personalized care through the journeys of our beloved community.</p>
        
        {/* Swipable carousel on mobile, Grid on desktop */}
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none gap-6 pb-6 md:pb-0 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {results.map((r, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-center flex flex-col justify-between"
            >
              <div className="h-60 sm:h-64 relative group">
                <ReactCompareSlider
                  itemOne={<ReactCompareSliderImage src={r.before} alt="Before" />}
                  itemTwo={<ReactCompareSliderImage src={r.after} alt="After" />}
                  className="h-full w-full"
                  onlyHandleDraggable={true}
                />
                <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] md:text-xs px-2 py-1 rounded backdrop-blur-sm z-10 pointer-events-none">Before</div>
                <div className="absolute top-3 right-3 bg-primary/80 text-white text-[10px] md:text-xs px-2 py-1 rounded backdrop-blur-sm z-10 pointer-events-none">After</div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-gray-800 shadow-lg flex items-center gap-1">
                    Drag Handle <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <div className="p-5 md:p-6 text-left">
                <h3 className="font-bold text-lg md:text-xl mb-1 text-gray-900">{r.title}</h3>
                <p className="text-xs md:text-sm text-gray-500">Duration: {r.duration}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 md:mt-12">
          <Link to="/book-consultation">
            <Button variant="primary">Book Free Consultation</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};



const GALLERY_ITEMS = [
  { src: '/gallery/acne.png', label: 'Acne Treatment' },
  { src: '/gallery/brightening.png', label: 'Brightening' },
  { src: '/gallery/laser.png', label: 'Laser Therapy' },
  { src: '/gallery/skin_booster.png', label: 'Skin Booster' },
  { src: '/gallery/anti_aging.png', label: 'Anti Aging' },
  { src: '/gallery/rejuvenation.png', label: 'Rejuvenation' },
];

const GallerySection = () => (
  <section id="gallery" className="py-16 md:py-24 bg-white border-t border-gray-100 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-primary font-medium text-xs mb-3">
          <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> Real Results
        </div>
        <h2 className="font-serif text-2xl md:text-4xl font-bold text-gray-900 mb-3">Treatment Results</h2>
        <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">Transformations experienced by our patients. All results are from real AuraSkin treatments.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {GALLERY_ITEMS.map((item, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }} className="relative group overflow-hidden rounded-2xl aspect-square bg-gray-100">
            <img src={item.src} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
              <span className="text-white font-semibold text-xs md:text-sm">{item.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link to="/book-consultation">
          <Button variant="primary" className="gap-2 shadow-lg">
            <Calendar className="w-4 h-4" /> Book Free Consultation
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

const PACKAGES = [
  {
    badge: 'Best Value', name: 'Bridal Glow Package', highlight: false,
    description: "Look your absolute best on your special day with our signature bridal program.",
    treatments: ['Brightening Program', 'Anti Aging Facial', 'Hydra Infusion', 'Post Care Kit'],
    original: 'Rp 7,000,000', price: 'Rp 4,499,000', sessions: '5 Sessions',
  },
  {
    badge: 'Most Popular', name: 'Acne Clear Package', highlight: true,
    description: 'Complete acne solution combining laser therapy, extraction, and skin barrier repair.',
    treatments: ['Acne Laser Therapy', 'Deep Extraction', 'Skin Booster', 'Home Care Kit'],
    original: 'Rp 4,500,000', price: 'Rp 2,999,000', sessions: '3 Sessions',
  },
  {
    badge: 'Premium', name: 'Anti Aging Revival', highlight: false,
    description: 'Turn back the clock with our scientifically backed combination therapy.',
    treatments: ['Laser Rejuvenation', 'Filler Consultation', 'Skin Booster', 'Monthly Follow up'],
    original: 'Rp 9,500,000', price: 'Rp 6,499,000', sessions: '6 Sessions',
  },
];

const PromotionsSection = () => (
  <section id="promotions" className="py-16 md:py-24 bg-primary/5 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary font-medium text-xs mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Limited Time Packages
        </div>
        <h2 className="font-serif text-2xl md:text-4xl font-bold text-gray-900 mb-3">Special Treatment Packages</h2>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">Curated bundles for maximum results. Save up to 40% vs. individual sessions.</p>
      </div>
      
      {/* Scrollable list on mobile, Grid on desktop */}
      <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none gap-6 pb-6 md:pb-0 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
        {PACKAGES.map((pkg) => (
          <motion.div 
            key={pkg.name} 
            whileHover={{ y: -8 }} 
            className={`relative bg-white rounded-3xl shadow-lg border-2 overflow-hidden flex flex-col justify-between w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-center ${pkg.highlight ? 'border-primary' : 'border-gray-100'}`}
          >
            <div>
              {pkg.highlight && <div className="bg-primary text-white text-center text-[10px] md:text-xs font-bold py-1.5 tracking-widest uppercase">⭐ Most Popular</div>}
              <div className={`p-6 md:p-8 ${pkg.highlight ? 'pt-5' : ''}`}>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] md:text-xs font-bold mb-4 ${pkg.highlight ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{pkg.badge}</span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-500 text-xs md:text-sm mb-5 leading-relaxed">{pkg.description}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.treatments.map(t => (
                    <li key={t} className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-6 md:p-8 pt-0 border-t border-gray-100 mt-auto">
              <div className="flex items-center gap-2 mb-1 pt-4">
                <span className="text-gray-400 text-xs md:text-sm line-through">{pkg.original}</span>
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Save!</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{pkg.price}</div>
              <div className="text-gray-500 text-[10px] md:text-xs mb-5">{pkg.sessions} included</div>
              <Link to="/book-consultation" className="w-full block">
                <button className={`w-full py-3 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 ${pkg.highlight ? 'bg-primary text-white hover:bg-primary/90 shadow-lg' : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}>
                  Book Consultation
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-[10px] md:text-xs text-gray-400 mt-6">* Packages valid for 3 months from purchase. Terms apply.</p>
    </div>
  </section>
);

const WhyChooseUs = () => {
  const reasons = [
    { icon: <Award className="w-6 h-6" />, title: 'Certified Specialists', desc: '15+ board certified aesthetic doctors and clinical dermatologists.' },
    { icon: <Sparkles className="w-6 h-6" />, title: 'Modern Equipment', desc: 'State of the art, FDA approved laser and micro hydration systems.' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Safe Procedures', desc: 'Clinically validated, medical grade protocols with zero compromises.' },
    { icon: <Heart className="w-6 h-6" />, title: 'Personalized Care', desc: 'Custom treatments based purely on your skin\'s biological needs.' },
    { icon: <MessageCircle className="w-6 h-6" />, title: 'Consultation Process', desc: 'Complimentary clinical analysis with zero pushy sales targets.' },
    { icon: <Star className="w-6 h-6" />, title: 'Premium Experience', desc: 'A luxurious environment designed for your ultimate comfort and relaxation.' }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-primary text-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-2xl md:text-4xl font-bold mb-3">Why Choose AuraSkin</h2>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">We combine medical expertise with luxury care to deliver exceptional results.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reasons.map((r, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all flex flex-col justify-between">
              <div>
                <div className="text-secondary mb-4 w-11 h-11 flex items-center justify-center bg-white/10 rounded-xl shrink-0">
                  {r.icon}
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-2 text-white">{r.title}</h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SocialProof = () => {
  const reviews = [
    { name: "Sarah M.", loc: "Jakarta Selatan", text: "My acne scars improved dramatically after only 3 sessions. The doctors here are truly experts in what they do.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80" },
    { name: "Jessica T.", loc: "Menteng", text: "The glass skin facial gave me the exact results I wanted for my wedding day. Absolutely premium service.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80" },
    { name: "Anita W.", loc: "Senayan", text: "Transparent pricing and no pushy sales. They genuinely care about your skin goals. Highly recommended!", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80" },
  ];

  return (
    <section id="reviews" className="py-16 md:py-24 bg-white border-b border-gray-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-gray-900 mb-3">Loved By Thousands</h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. Here is what our patients have to say.</p>
        </div>

        {/* Swipeable review carousel on mobile, Grid on desktop */}
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none gap-6 pb-6 md:pb-0 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {reviews.map((r, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }} 
              className="bg-background p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm relative flex flex-col justify-between w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-center"
            >
              <div>
                <div className="flex text-secondary mb-4">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs md:text-sm text-gray-700 mb-6 italic leading-relaxed">"{r.text}"</p>
              </div>
              <div className="flex items-center gap-4">
                <img src={r.img} alt={r.name} className="w-10 h-10 object-cover rounded-full shadow-sm shrink-0" />
                <div>
                  <h4 className="font-bold text-sm md:text-base text-gray-900">{r.name}</h4>
                  <p className="text-[10px] md:text-xs text-gray-500">{r.loc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Strategic CTA placed right after testimonials */}
        <div className="text-center mt-8 md:mt-12">
          <Link to="/book-consultation">
            <Button variant="primary">Book Free Consultation</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center border-t border-gray-100 pt-10 md:pt-16 mt-16">
          <div>
            <div className="text-2xl md:text-4xl font-serif font-bold text-primary mb-1">20,000+</div>
            <div className="text-xs md:text-sm text-gray-500 font-medium">Patients</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-serif font-bold text-primary mb-1">4.9</div>
            <div className="text-xs md:text-sm text-gray-500 font-medium">Rating</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-serif font-bold text-primary mb-1">1,500+</div>
            <div className="text-xs md:text-sm text-gray-500 font-medium">Reviews</div>
          </div>
          <div>
            <div className="text-2xl md:text-4xl font-serif font-bold text-primary mb-1">250K</div>
            <div className="text-xs md:text-sm text-gray-500 font-medium">Instagram</div>
          </div>
        </div>
      </div>
    </section>
  );
};



const FAQItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer font-medium text-sm md:text-lg text-gray-900 select-none outline-none focus:ring-2 focus:ring-primary/20"
      >
        {q}
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-5 md:p-6 pt-0 text-[13px] md:text-sm text-gray-600 border-t border-gray-100 leading-relaxed">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    { q: "How many sessions are needed?", a: "This varies based on skin condition. While initial results are visible after 1 session, long-term conditions (scars, pigmentation) typically benefit from 3 to 5 sessions." },
    { q: "How long is recovery?", a: "Most facial treatments have zero downtime. Laser treatments may leave slight redness for 12 to 24 hours, but you can return to work and apply sunscreen/makeup immediately." },
    { q: "Can men receive treatments?", a: "Absolutely. Around 30% of our patients are men seeking acne scar treatment, skin health restoration, and facial contouring." },
    { q: "How much does the consultation cost?", a: "Our initial consultation with an aesthetic doctor is completely free. We will analyze your skin type and suggest a tailored treatment plan with zero pressure to buy." },
    { q: "Are treatments safe?", a: "Yes. All treatments are performed by board certified doctors using FDA approved technology and medical grade skincare products under strict clinical protocols." }
  ];

  return (
    <section className="py-16 md:py-24 bg-background border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}



const FinalCTA = () => (
  <section className="py-16 md:py-24 bg-primary relative overflow-hidden text-center">
    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
    <div className="max-w-4xl mx-auto px-4 relative z-10 text-white space-y-8">
      <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">Ready To Transform Your Skin?</h2>
      <p className="text-sm md:text-xl text-gray-300 max-w-2xl mx-auto">Claim your free consultation and receive a personalized treatment plan from our expert team.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 max-w-md mx-auto sm:max-w-none">
        <Link to="/book-consultation" className="w-full sm:w-auto">
          <Button variant="secondary" className="text-primary font-bold text-sm md:text-lg py-3.5 md:py-4 px-6 md:px-8 w-full">
            Book Free Consultation
          </Button>
        </Link>
        <a href="https://wa.me/6281288882828" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-sm md:text-lg py-3.5 md:py-4 px-6 md:px-8 w-full">
            <MessageCircle className="mr-2 inline w-4.5 h-4.5" /> Chat on WhatsApp
          </Button>
        </a>
      </div>
    </div>
  </section>
);

// --- Export Home Component ---
export default function Home() {
  return (
    <>
      <Hero />
      <TrustBadges />
      <BeforeAfter />

      <GallerySection />
      <PromotionsSection />
      <WhyChooseUs />
      <SocialProof />
      <FAQ />
      <FinalCTA />
    </>
  );
}
