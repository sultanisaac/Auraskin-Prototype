import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, MessageCircle, MapPin, Calendar, Clock, ChevronDown, Check, Star, 
  ArrowRight, ShieldCheck, Award, ThumbsUp, Heart, Sparkles 
} from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Button } from '../components/Button';

// --- Sub-sections of the Homepage ---

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
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in">
            Reveal Your Best Skin With <span className="text-primary">Expert Care</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
            Advanced aesthetic treatments tailored to your skin goals. Trusted by thousands of women across Jakarta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/book-consultation">
              <Button variant="primary" className="text-lg py-4 px-8 w-full sm:w-auto">
                Book Free Consultation
              </Button>
            </Link>
            <Link to="/#treatments">
              <Button variant="outline" className="text-lg py-4 px-8 w-full sm:w-auto">
                View Treatments
              </Button>
            </Link>
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
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&h=800&q=80" 
            alt="Premium Beauty Clinic SCBD" 
            className="rounded-[2rem] shadow-2xl relative z-10 object-cover h-[400px] md:h-[500px] lg:h-[600px] w-full"
          />
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl z-20 flex items-center gap-4 border border-gray-50">
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
          <Link to="/book-consultation">
            <Button variant="primary">Get My Personalized Plan</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const Treatments = () => {
  const treatments = [
    { name: 'Acne Reset Program', price: 'Rp 799.000', desc: 'Clear acne and prevent breakouts', time: '60 mins', img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=500&h=500&q=80' },
    { name: 'Glass Skin Facial', price: 'Rp 999.000', desc: 'Deep hydration and instant glow', time: '90 mins', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&h=500&q=80' },
    { name: 'Pico Laser Brightening', price: 'Rp 1.490.000', desc: 'Target pigmentation and dark spots', time: '45 mins', img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=500&h=500&q=80' },
    { name: 'Skin Booster', price: 'Rp 2.490.000', desc: 'Deep nourishment and anti-aging', time: '30 mins', img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=500&h=500&q=80' },
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
              className="group bg-background rounded-2xl p-6 border border-transparent hover:border-secondary transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 rounded-xl mb-6 overflow-hidden relative bg-gray-100">
                  <img src={t.img} alt={t.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-2 text-primary">{t.name}</h3>
                <p className="text-sm text-gray-600 mb-4 h-10">{t.desc}</p>
                <div className="flex justify-between items-center mb-6 text-sm font-medium">
                  <span className="text-gray-500"><Clock className="w-4 h-4 inline mr-1" />{t.time}</span>
                  <span className="text-secondary">From {t.price}</span>
                </div>
              </div>
              <Link to="/book-consultation" className="w-full block">
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                  Book Consultation
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/pricing">
            <Button variant="ghost" className="gap-2">
              View All Treatments & Pricing <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

const GALLERY_ITEMS = [
  { src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', label: 'Acne Treatment' },
  { src: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80', label: 'Brightening' },
  { src: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&q=80', label: 'Laser Therapy' },
  { src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80', label: 'Skin Booster' },
  { src: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80', label: 'Anti-Aging' },
  { src: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600&q=80', label: 'Rejuvenation' },
];

const GallerySection = () => (
  <section id="gallery" className="py-24 bg-white border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-primary font-medium text-sm mb-4">
          <Heart className="w-4 h-4 text-primary fill-primary" /> Real Results
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
        <Link to="/book-consultation">
          <Button variant="primary" className="gap-2 shadow-lg">
            <Calendar className="w-5 h-5" /> Book Your Transformation
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
          <motion.div key={pkg.name} whileHover={{ y: -8 }} className={`relative bg-white rounded-3xl shadow-xl border-2 overflow-hidden flex flex-col justify-between ${pkg.highlight ? 'border-primary' : 'border-gray-100'}`}>
            <div>
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
              </div>
            </div>
            <div className="p-8 pt-0 border-t border-gray-100 mt-auto">
              <div className="flex items-center gap-2 mb-1 pt-6">
                <span className="text-gray-400 text-sm line-through">{pkg.original}</span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Save!</span>
              </div>
              <div className="text-3xl font-bold text-primary mb-1">{pkg.price}</div>
              <div className="text-gray-500 text-xs mb-6">{pkg.sessions} included</div>
              <Link to="/book-consultation" className="w-full block">
                <button className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${pkg.highlight ? 'bg-primary text-white hover:bg-primary/90 shadow-lg' : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}>
                  Claim This Package
                </button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 mt-8">* Packages valid for 3 months from purchase. Terms apply.</p>
    </div>
  </section>
);

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

const SocialProof = () => {
  const reviews = [
    { name: "Sarah M.", loc: "Jakarta Selatan", text: "My acne scars improved dramatically after only 3 sessions. The doctors here are truly experts in what they do.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80" },
    { name: "Jessica T.", loc: "Menteng", text: "The glass skin facial gave me the exact results I wanted for my wedding day. Absolutely premium service.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80" },
    { name: "Anita W.", loc: "Senayan", text: "Transparent pricing and no pushy sales. They genuinely care about your skin goals. Highly recommended!", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80" },
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
    { name: 'Dr. Amanda Wijaya', role: 'Aesthetic Medicine Specialist', exp: '12 Years Experience', spec: 'Laser & Skin Rejuvenation', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=800&fit=crop&q=80' },
    { name: 'Dr. Budi Santoso', role: 'Dermatologist', exp: '15 Years Experience', spec: 'Acne & Scar Treatment', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=800&fit=crop&q=80' },
    { name: 'Dr. Clara Lee', role: 'Aesthetic Doctor', exp: '8 Years Experience', spec: 'Facial Contouring', img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=600&h=800&fit=crop&q=80' }
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
            <motion.div key={i} whileHover={{ y: -10 }} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col justify-between">
              <div>
                <img src={doc.img} alt={doc.name} className="w-full h-80 object-cover object-top" />
                <div className="p-6">
                  <h3 className="font-serif font-bold text-2xl text-primary mb-1">{doc.name}</h3>
                  <p className="text-secondary font-medium mb-4">{doc.role}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> {doc.exp}</div>
                    <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> {doc.spec}</div>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link to={`/book-consultation?doctor=${encodeURIComponent(doc.name)}`} className="w-full block">
                  <Button variant="outline" className="w-full">
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
    { q: "Does laser treatment hurt?", a: "Most patients describe it as a warm, tingling sensation. We apply high-grade topical numbing cream prior to treatments to ensure complete comfort." },
    { q: "How many sessions are needed?", a: "This varies based on skin condition. While initial results are visible after 1 session, long-term conditions (scars, pigmentation) typically benefit from 3–5 sessions." },
    { q: "How long is recovery?", a: "Most facial treatments have zero downtime. Laser treatments may leave slight redness for 12–24 hours, but you can return to work and apply sunscreen/makeup immediately." },
    { q: "Can men receive treatments?", a: "Absolutely. Around 30% of our patients are men seeking acne scar treatment, skin health restoration, and facial contouring." },
    { q: "How much does the consultation cost?", a: "Our initial consultation with an aesthetic doctor is completely free. We will analyze your skin type and suggest a tailored treatment plan with zero pressure to buy." },
    { q: "Are treatments safe?", a: "Yes. All treatments are performed by board-certified doctors using FDA-approved technology and medical-grade skincare products under strict clinical protocols." }
  ];

  return (
    <section className="py-24 bg-background border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-4xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <details key={i} className="group bg-white rounded-xl shadow-sm border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-lg text-gray-900 select-none">
                {item.q}
                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-6 pt-0 text-gray-600 border-t border-gray-100 leading-relaxed text-sm">
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

const FinalCTA = () => (
  <section className="py-24 bg-primary relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
      <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 animate-pulse">Ready To Transform Your Skin?</h2>
      <p className="text-xl text-gray-300 mb-10">Claim your free consultation and receive a personalized treatment plan from our expert team.</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/book-consultation">
          <Button variant="secondary" className="text-lg py-4 px-8 text-primary font-bold w-full sm:w-auto">
            Book Free Consultation
          </Button>
        </Link>
        <a href="https://wa.me/6281288882828" target="_blank" rel="noreferrer">
          <Button variant="outline" className="text-lg py-4 px-8 border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto">
            <MessageCircle className="mr-2 inline w-5 h-5" /> Chat on WhatsApp
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
