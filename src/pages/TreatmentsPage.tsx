import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export default function TreatmentsPage() {
  const navigate = useNavigate();
  const treatments = [
    { 
      name: 'Acne & Clarity Treatment', 
      slug: 'acne-clarity',
      price: 'Rp 799.000', 
      desc: 'Reclaim your confidence with a clear, glowing complexion. A gentle yet effective approach to purifying and balancing troubled skin.', 
      time: '60 mins', 
      img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&h=800&q=80',
      benefits: ['Soothes inflammation', 'Purifies congested pores', 'Restores natural barrier']
    },
    { 
      name: 'Luminous Glass Skin', 
      slug: 'luminous-glass-skin',
      price: 'Rp 999.000', 
      desc: 'A deeply nourishing journey to lasting radiance. Plump, hydrate, and revive your skin for that coveted dewy finish.', 
      time: '90 mins', 
      img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&h=800&q=80',
      benefits: ['Intense cellular hydration', 'Silky smooth texture', 'Immediate visible glow']
    },
    { 
      name: 'Pico Brilliance Therapy', 
      slug: 'pico-brilliance',
      price: 'Rp 1.490.000', 
      desc: 'Shatter pigmentation and unveil a flawless canvas. Our advanced laser technology brings your skin tone into perfect harmony.', 
      time: '45 mins', 
      img: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=1200&h=800&q=80',
      benefits: ['Evens skin tone', 'Targets stubborn spots', 'Zero social downtime']
    },
    { 
      name: 'Youthful Contour Infusion', 
      slug: 'youthful-contour',
      price: 'Rp 2.490.000', 
      desc: 'Defy time with profound nourishment. Stimulate your skin’s innate collagen production for a lifted, rejuvenated appearance.', 
      time: '30 mins', 
      img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&h=800&q=80',
      benefits: ['Stimulates natural collagen', 'Softens fine expression lines', 'Lifts and firms']
    },
  ];

  return (
    <div className="bg-white min-h-screen py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 md:mb-12">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="text-center mb-16 md:mb-24">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 mb-6">Our Signature Treatments</h1>
            <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">Experience aesthetic excellence designed to honor your natural beauty and elevate your spirit. Each treatment is tailored to your unique skin biology.</p>
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
                    <Link to={`/treatments/${t.slug}`}>
                      <Button variant="outline" className="px-8 py-3.5 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-full transition-all duration-300">
                        View Treatment Details
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
    </div>
  );
}
