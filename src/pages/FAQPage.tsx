"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../components/Button';

const FAQItem = ({ q, a, isOpen, onClick }: { q: string, a: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button 
        onClick={onClick}
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

export default function FAQPage() {
  const router = useRouter();
  const navigate = (path: string | -1) => { if (path === -1) router.back(); else router.push(path); };
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "How many sessions are needed?", a: "This varies based on skin condition. While initial results are visible after 1 session, long-term conditions (scars, pigmentation) typically benefit from 3 to 5 sessions." },
    { q: "How long is recovery?", a: "Most facial treatments have zero downtime. Laser treatments may leave slight redness for 12 to 24 hours, but you can return to work and apply sunscreen/makeup immediately." },
    { q: "Can men receive treatments?", a: "Absolutely. Around 30% of our patients are men seeking acne scar treatment, skin health restoration, and facial contouring." },
    { q: "How much does the consultation cost?", a: "Our initial consultation with an aesthetic doctor is completely free. We will analyze your skin type and suggest a tailored treatment plan with zero pressure to buy." },
    { q: "Are treatments safe?", a: "Yes. All treatments are performed by board certified doctors using FDA approved technology and medical grade skincare products under strict clinical protocols." },
    { q: "Is it possible to combine different treatments on the same day?", a: "Yes, many of our treatments complement each other and can be safely performed on the same day. Your doctor will advise you on the best combinations during your consultation." },
    { q: "Do you offer treatment packages?", a: "Yes, we offer comprehensive packages for multi-session treatments, which often provide better value and optimal long-term results." },
    { q: "What forms of payment do you accept?", a: "We accept all major credit and debit cards, QRIS, bank transfers, and offer flexible installment plans for larger treatment packages." },
    { q: "Can I purchase skincare products online?", a: "Yes, you can browse and purchase our curated selection of medical-grade skincare products directly from our online Store. We ship nationwide." },
    { q: "Do I need a consultation before buying products?", a: "While many of our over-the-counter clinical products can be purchased directly, certain prescription-strength items may require a brief consultation with our doctors first." }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 md:pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6 md:mb-8">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl font-bold text-center text-gray-900 mb-4 md:mb-6">Frequently Asked Questions</h1>
        <p className="text-center text-gray-600 mb-8 md:mb-10 max-w-xl mx-auto">
          Find answers to the most common questions about our treatments, consultations, and safety protocols.
        </p>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <FAQItem 
              key={i} 
              q={item.q} 
              a={item.a} 
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-12 md:mt-16 bg-primary/5 rounded-3xl p-8 md:p-12 text-center border border-primary/10">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Our clinical team is always ready to help. Reach out to us directly or book a free consultation to discuss your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/book-consultation" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full">Book Consultation</Button>
            </Link>
            <a href="https://wa.me/6281288882828" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full bg-white border-gray-200">
                <MessageCircle className="w-4 h-4 mr-2 inline" /> Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
