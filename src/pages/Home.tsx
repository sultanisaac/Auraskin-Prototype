import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, MessageCircle, MapPin, Calendar, Clock, ChevronDown, Check, Star, 
  ArrowRight, ShieldCheck, Award, ThumbsUp, Heart, Sparkles 
} from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Button } from '../components/Button';
import { PrototypeNotice } from '../components/PrototypeNotice';

// --- Sub-sections of the Homepage ---

const Hero = () => (
  <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-background">
    {/* Background Image */}
    <div className="absolute inset-0">
      <img 
        src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=2400&q=80"
        alt="Premium Clinic"
        className="w-full h-full object-cover object-center"
      />
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
          <Link to="/#treatments" className="w-full sm:w-auto">
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
      before: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=500&h=500&q=80",
      after: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&h=500&q=80"
    },
    {
      title: "Pico Laser Brightening",
      duration: "1 Month (2 Sessions)",
      before: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&h=500&q=80",
      after: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&h=500&q=80"
    },
    {
      title: "Skin Booster & Contouring",
      duration: "Instant Result",
      before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=500&q=80",
      after: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=500&h=500&q=80"
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

const Treatments = () => {
  const treatments = [
    { 
      name: 'Acne & Clarity Treatment', 
      price: 'Rp 799.000', 
      desc: 'Reclaim your confidence with a clear, glowing complexion. A gentle yet effective approach to purifying and balancing troubled skin.', 
      time: '60 mins', 
      img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&h=800&q=80',
      benefits: ['Soothes inflammation', 'Purifies congested pores', 'Restores natural barrier']
    },
    { 
      name: 'Luminous Glass Skin', 
      price: 'Rp 999.000', 
      desc: 'A deeply nourishing journey to lasting radiance. Plump, hydrate, and revive your skin for that coveted dewy finish.', 
      time: '90 mins', 
      img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&h=800&q=80',
      benefits: ['Intense cellular hydration', 'Silky smooth texture', 'Immediate visible glow']
    },
    { 
      name: 'Pico Brilliance Therapy', 
      price: 'Rp 1.490.000', 
      desc: 'Shatter pigmentation and unveil a flawless canvas. Our advanced laser technology brings your skin tone into perfect harmony.', 
      time: '45 mins', 
      img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=1200&h=800&q=80',
      benefits: ['Evens skin tone', 'Targets stubborn spots', 'Zero social downtime']
    },
    { 
      name: 'Youthful Contour Infusion', 
      price: 'Rp 2.490.000', 
      desc: 'Defy time with profound nourishment. Stimulate your skin’s innate collagen production for a lifted, rejuvenated appearance.', 
      time: '30 mins', 
      img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&h=800&q=80',
      benefits: ['Stimulates natural collagen', 'Softens fine expression lines', 'Lifts and firms']
    },
  ];

  return (
    <section id="treatments" className="py-20 md:py-32 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-4">Our Signature Treatments</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-light">Experience aesthetic excellence designed to honor your natural beauty and elevate your spirit.</p>
        </div>
        
        <div className="space-y-16 md:space-y-32">
          {treatments.map((t, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16`}>
              {/* Image Side */}
              <motion.div 
                initial={{ opacity: 0, x: i % 2 === 1 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="w-full md:w-1/2 relative group"
              >
                <div className="absolute inset-0 bg-primary/10 -m-4 md:-m-6 rounded-3xl transform rotate-2 group-hover:rotate-1 transition-transform duration-500" />
                <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-2xl">
                  <img 
                    src={t.img} 
                    alt={t.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    loading="lazy"
                  />
                </div>
              </motion.div>
              
              {/* Text Side */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full md:w-1/2 space-y-6"
              >
                <div className="flex items-center gap-4 text-xs font-medium tracking-widest text-secondary uppercase">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {t.time}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <span>From {t.price}</span>
                </div>
                
                <h3 className="font-serif text-2xl md:text-4xl font-bold text-gray-900">{t.name}</h3>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed font-light">{t.desc}</p>
                
                <ul className="space-y-3 pt-2">
                  {t.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm md:text-base">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-6">
                  <Link to="/book-consultation">
                    <Button variant="outline" className="px-8 py-3.5 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-full transition-all duration-300">
                      Reserve This Treatment
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Dynamic visual CTA placed strategically after Treatments */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-50 rounded-[2.5rem] p-8 md:p-16 mt-20 md:mt-32 text-center max-w-4xl mx-auto border border-gray-100 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-32 h-32 text-primary" />
          </div>
          <div className="relative z-10">
            <h3 className="font-serif text-2xl md:text-4xl font-bold text-gray-900 mb-4">Not Sure Where To Begin?</h3>
            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-xl mx-auto font-light">Allow our experts to guide you. Schedule a complimentary clinical consultation for a personalized roadmap.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/book-consultation" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full px-8 py-4 rounded-full text-base shadow-lg shadow-primary/20">Book Complimentary Consultation</Button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full px-8 py-4 rounded-full text-base">View Full Price List</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const GALLERY_ITEMS = [
  { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', label: 'Acne Treatment' },
  { src: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80', label: 'Brightening' },
  { src: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80', label: 'Laser Therapy' },
  { src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', label: 'Skin Booster' },
  { src: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80', label: 'Anti Aging' },
  { src: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600&q=80', label: 'Rejuvenation' },
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
    badge: 'Most Popular', name: 'Acne Clear Package', highlight: true,
    description: 'Complete acne solution combining laser therapy, extraction, and skin barrier repair.',
    treatments: ['Acne Laser Therapy', 'Deep Extraction', 'Skin Booster', 'Home Care Kit'],
    original: 'Rp 4,500,000', price: 'Rp 2,999,000', sessions: '3 Sessions',
  },
  {
    badge: 'Best Value', name: 'Bridal Glow Package', highlight: false,
    description: "Look your absolute best on your special day with our signature bridal program.",
    treatments: ['Brightening Program', 'Anti Aging Facial', 'Hydra Infusion', 'Post Care Kit'],
    original: 'Rp 7,000,000', price: 'Rp 4,499,000', sessions: '5 Sessions',
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
    { icon: <MessageCircle className="w-6 h-6" />, title: 'Consultation Process', desc: 'Complimentary clinical analysis with zero pushy sales targets.' }
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

const Experts = () => {
  const doctors = [
    { name: 'Dr. Amanda Wijaya', role: 'Aesthetic Medicine', exp: '12 Years Exp.', spec: 'Laser & Rejuvenation', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=800&fit=crop&q=80' },
    { name: 'Dr. Budi Santoso', role: 'Dermatologist', exp: '15 Years Exp.', spec: 'Acne & Scar Treatment', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=800&fit=crop&q=80' },
    { name: 'Dr. Clara Lee', role: 'Aesthetic Doctor', exp: '8 Years Exp.', spec: 'Facial Contouring', img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=600&h=800&fit=crop&q=80' }
  ];

  return (
    <section id="experts" className="py-16 md:py-24 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-gray-900 mb-3">Meet Our Experts</h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">Board-certified specialists dedicated to your skin's health and beauty.</p>
        </div>

        {/* Swipeable carousel on mobile, Grid on desktop */}
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none gap-6 pb-6 md:pb-0 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {doctors.map((doc, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -10 }} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col justify-between w-[80vw] sm:w-[300px] md:w-auto shrink-0 snap-center"
            >
              <div>
                <img src={doc.img} alt={doc.name} className="w-full h-64 sm:h-72 md:h-80 object-cover object-top" loading="lazy" />
                <div className="p-5 md:p-6">
                  <h3 className="font-serif font-bold text-lg md:text-2xl text-primary mb-1">{doc.name}</h3>
                  <p className="text-secondary font-medium text-xs md:text-sm mb-4">{doc.role}</p>
                  <div className="space-y-2 text-xs md:text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2"><Award className="w-4 h-4 text-primary shrink-0" /> {doc.exp}</div>
                    <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary shrink-0" /> {doc.spec}</div>
                  </div>
                </div>
              </div>
              <div className="p-5 md:p-6 pt-0 mt-auto">
                <Link to={`/book-consultation?doctor=${encodeURIComponent(doc.name)}`} className="w-full block">
                  <Button variant="outline" className="w-full text-xs md:text-sm py-2.5">
                    Book with {doc.name.split(' ')[1]}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
            <details key={i} className="group bg-white rounded-xl shadow-sm border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-5 md:p-6 cursor-pointer font-medium text-sm md:text-lg text-gray-900 select-none">
                {item.q}
                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform shrink-0" />
              </summary>
              <div className="p-5 md:p-6 pt-0 text-[13px] md:text-sm text-gray-600 border-t border-gray-100 leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const LocationSection = () => (
  <section id="location" className="py-16 md:py-24 bg-gray-50 scroll-mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-primary font-medium text-xs mb-3">
          <MapPin className="w-3.5 h-3.5" /> Find Us
        </div>
        <h2 className="font-serif text-2xl md:text-4xl font-bold text-gray-900 mb-3">Visit Our Clinic</h2>
        <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">Conveniently located in Jakarta's CBD. Easy access by car, MRT, or TransJakarta.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-200 h-[280px] sm:h-[350px] md:h-[420px]">
          <iframe title="AuraSkin Jakarta" src="https://maps.google.com/maps?q=SCBD+Tower+2+Jakarta+Selatan&output=embed&z=15" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
        <div className="space-y-4">
          {[
            { icon: <MapPin className="w-5 h-5 text-primary" />, title: 'Address', content: <p className="text-gray-600 text-xs md:text-sm">SCBD Tower 2, Jl. Jend. Sudirman Kav. 52, 53,<br />Jakarta Selatan 12190, Indonesia</p> },
            { icon: <Clock className="w-5 h-5 text-primary" />, title: 'Clinic Hours', content: <div className="text-xs md:text-sm text-gray-600 space-y-1"><div className="flex justify-between gap-8"><span>Monday to Friday</span><span className="font-medium">09:00 to 20:00</span></div><div className="flex justify-between gap-8"><span>Saturday to Sunday</span><span className="font-medium">09:00 to 18:00</span></div></div> },
            { icon: <Phone className="w-5 h-5 text-primary" />, title: 'Contact', content: <p className="text-xs md:text-sm text-gray-600">WhatsApp: <a href="https://wa.me/6281288882828" className="text-primary font-medium hover:underline">+62 812 8888 2828</a></p> },
            { icon: <ArrowRight className="w-5 h-5 text-primary" />, title: 'Getting Here', content: <ul className="text-xs md:text-sm text-gray-600 space-y-1"><li>🚇 MRT: Senayan Station (5 min walk)</li><li>🚌 TransJakarta: Halte Bendungan Hilir</li><li>🚗 Valet parking available at SCBD Tower 2</li></ul> },
          ].map(({ icon, title, content }) => (
            <div key={title} className="flex gap-4 items-start bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
              <div className="bg-primary/10 p-2.5 md:p-3 rounded-xl shrink-0">{icon}</div>
              <div><h4 className="font-bold text-sm md:text-base text-gray-900 mb-1">{title}</h4>{content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

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
      <Treatments />
      <GallerySection />
      <PromotionsSection />
      <WhyChooseUs />
      <SocialProof />
      <Experts />
      <LocationSection />
      <FAQ />
      <FinalCTA />
    </>
  );
}
