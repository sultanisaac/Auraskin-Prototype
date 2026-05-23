import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Check, ShieldCheck, ArrowLeft, ArrowRight, 
  Percent, CreditCard, HeartHandshake, BadgeHelp 
} from 'lucide-react';
import { Button } from '../components/Button';

// Extended list of treatments for a robust, premium pricing page
const INDIVIDUAL_TREATMENTS = [
  { name: 'Doctor Consultation', category: 'General', price: 'FREE', originalPrice: 'Rp 250.000', duration: '15 mins', desc: 'Full clinical skin barrier assessment and digital mapping with an aesthetic specialist.' },
  { name: 'Deep Cleansing Facial', category: 'Facial', price: 'Rp 399.000', duration: '60 mins', desc: 'Gentle extraction, ultrasonic exfoliation, and custom soothing mask.' },
  { name: 'Intensive Acne Facial', category: 'Facial', price: 'Rp 599.000', duration: '75 mins', desc: 'Deep extraction, high-frequency acne bacteria disinfection, and blue LED light therapy.' },
  { name: 'Glass Skin Facial', category: 'Facial', price: 'Rp 999.000', duration: '90 mins', desc: 'Premium micro-hydration infusion and cooling collagen mask for instant glow.' },
  { name: 'Acne Reset Program (Individual)', category: 'Facial', price: 'Rp 799.000', duration: '60 mins', desc: 'Targeted clinical acne-clear procedure combined with skin barrier hydration.' },
  { name: 'Pico Laser Brightening', category: 'Laser', price: 'Rp 1.490.000', duration: '45 mins', desc: 'State-of-the-art picosecond laser to fragment pigment particles and clear dark spots.' },
  { name: 'Pico Laser Rejuvenation', category: 'Laser', price: 'Rp 1.490.000', duration: '45 mins', desc: 'Collagen-stimulating picosecond laser to improve skin texture and reduce pore size.' },
  { name: 'Premium Skin Booster', category: 'Skin Booster', price: 'Rp 2.490.000', duration: '30 mins', desc: 'Direct micro-injections of pure hyaluronic acid to lock in deep, long-lasting moisture.' },
  { name: 'DNA Salmon Skin Restoration', category: 'Skin Booster', price: 'Rp 2.990.000', duration: '45 mins', desc: 'Cell-regenerating salmon DNA booster to repair damaged skin barriers and smooth fine wrinkles.' }
];

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

const CATEGORIES = ['All', 'Facial', 'Laser', 'Skin Booster', 'General'];

export default function PricingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter treatments based on search query & selected category
  const filteredTreatments = INDIVIDUAL_TREATMENTS.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-background min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back Link */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition font-medium text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home Page
          </Link>
        </div>

        {/* Page Title */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/30 text-primary font-medium text-sm mb-4">
            <ShieldCheck className="w-4 h-4 text-primary fill-primary" /> 100% Honest Pricing
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Transparent Pricing. <span className="text-primary">Zero Hidden Costs.</span>
          </h1>
          <p className="text-lg text-gray-600">
            At AuraSkin, we believe in clinical integrity. The price you see is exactly what you pay. Standard doctor fees, room setup, and taxes are fully included. No surprises, no aggressive sales.
          </p>
        </div>

        {/* Category Tabs & Interactive Search */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between pb-6 border-b border-gray-100">
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    (selectedCategory === cat) 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-background text-gray-500 hover:text-primary hover:bg-gray-100'
                  }`}
                >
                  {cat} {cat !== 'All' ? 'Treatments' : ''}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search treatments..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

          </div>

          {/* Individual Treatments Listing */}
          <div className="divide-y divide-gray-100">
            {filteredTreatments.length > 0 ? (
              filteredTreatments.map((t, idx) => (
                <div key={idx} className="py-6 first:pt-4 last:pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-xl text-primary">{t.name}</h3>
                      <span className="text-[10px] bg-secondary/10 text-secondary font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {t.category}
                      </span>
                      <span className="text-xs text-gray-400 font-medium ml-2">⏱ {t.duration}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
                  </div>
                  
                  <div className="flex flex-col items-end shrink-0 min-w-[180px]">
                    <div className="flex items-center gap-2">
                      {t.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">{t.originalPrice}</span>
                      )}
                      <span className="font-serif font-bold text-2xl text-primary">{t.price}</span>
                    </div>
                    <Link to={`/book-consultation?treatment=${encodeURIComponent(t.name)}`} className="mt-2 text-xs font-semibold text-secondary hover:text-primary transition flex items-center gap-1">
                      Book Treatment <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <BadgeHelp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">No treatments found</h3>
                <p className="text-gray-500 text-sm">Try broadening your keywords or clearing the category filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Packages Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-medium text-sm mb-4">
              <Percent className="w-4 h-4" /> Bundle & Save
            </div>
            <h2 className="font-serif text-3xl font-bold text-gray-900">Treatment Bundles</h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">Get maximum clinical results. Our packages offer up to 40% savings compared to single sessions.</p>
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
        </div>

        {/* Why AuraSkin Pricing is Different */}
        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary text-center mb-10">
            Why Our Pricing Structure is Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CreditCard className="w-8 h-8 text-secondary" />,
                title: "0% Instalments",
                desc: "We support split payments. Make transactions with 0% interest up to 12 months using major credit cards or ShopeePayLater."
              },
              {
                icon: <HeartHandshake className="w-8 h-8 text-secondary" />,
                title: "Post-Care Included",
                desc: "Clinical treatments require recovery care. We include standard clinical post-care creams and sunscreens without charging extra."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-secondary" />,
                title: "No Upsell Guarantee",
                desc: "Our doctors are evaluated on skin health progress, not sales targets. We will never push treatments you do not need."
              }
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <div className="bg-secondary/10 p-4 rounded-full mb-4">{card.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="mt-16 bg-primary text-white rounded-3xl p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Unsure which treatment fits your skin?</h2>
            <p className="text-gray-300">
              Get an accurate clinical plan. Book a 100% free skin consult. Our aesthetic doctors will inspect your skin barrier and give you an honest pricing breakdown.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link to="/book-consultation">
                <Button variant="secondary" className="text-primary font-bold text-md px-8 py-3.5 w-full sm:w-auto">
                  Book Free Consultation
                </Button>
              </Link>
              <a href="https://wa.me/6281288882828" target="_blank" rel="noreferrer">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-md px-8 py-3.5 w-full sm:w-auto">
                  Ask via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
